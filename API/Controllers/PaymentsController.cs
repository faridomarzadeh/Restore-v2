using System;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers;

public class PaymentsController(PaymentsService paymentsService,
 StoreContext storeContext,
 IConfiguration configuration,
 ILogger<PaymentsController> logger) : BaseApiController
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
    {
        var basket = await storeContext.Baskets.GetBasketAsync(Request.Cookies["basketId"]);

        if (basket == null) return BadRequest("problem with the basket");

        var intent = await paymentsService.CreateOrUpdatePaymentIntent(basket);

        if (intent == null) return BadRequest("Problem creating payment intent");

        basket.PaymentIntentId ??= intent.Id;
        basket.ClientSecret ??= intent.ClientSecret;

        if (storeContext.ChangeTracker.HasChanges())
        {
            var result = await storeContext.SaveChangesAsync() > 0;

            if (!result) return BadRequest("Problem updating basket with intent");
        }

        return basket.ToDto();
    }
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();
        try
        {
            var stripeEvent = ConstructStripeEvent(json);
            if(stripeEvent.Data.Object is not PaymentIntent intent)
            {
                return BadRequest("Invalid event data");
            }
            if(intent.Status == "succeeded")
            {
                await HandlePaymentIntentSucceeded(intent);
            }
            else
            {
                await HandlePaymentIntentFailed(intent);
            }

            return Ok();
        }
        catch (StripeException ex)
        {
            logger.LogError(ex, "Stripe webhook error");
            return StatusCode(StatusCodes.Status500InternalServerError,"webhook error");
        }
        catch(Exception ex)
        {
            logger.LogError(ex, "Unexpected error has occurred");
            return StatusCode(StatusCodes.Status500InternalServerError,"Unexpected error"); 
        }
    }

    private async Task HandlePaymentIntentFailed(PaymentIntent intent)
    {
        var order = await storeContext.Orders
        .Include(x => x.OrderItems)
        .FirstOrDefaultAsync( x=> x.PaymentIntentId==intent.Id)?? throw new Exception("order not found");

        foreach (var item in order.OrderItems)
        {
            var orderItem = await storeContext.
            Products.
            FirstOrDefaultAsync(x=> x.Id==item.Item.ProductId)?? throw new Exception("product not found");

            orderItem.QuantityInStock += item.Quantity;
        }

        order.OrderStatus = OrderStatus.PaymentFailed;
        await storeContext.SaveChangesAsync();
    }

    private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
    {
        var order = await storeContext.Orders
        .Include(x => x.OrderItems)
        .FirstOrDefaultAsync( x=> x.PaymentIntentId==intent.Id)?? throw new Exception("order not found");

        if(order.GetTotal() != intent.Amount)
        {
            order.OrderStatus = OrderStatus.PaymentMisMatch;
        }
        else
        {
            order.OrderStatus = OrderStatus.PaymentReceived;
        }
        var basket =await  storeContext.Baskets.FirstOrDefaultAsync(x => x.PaymentIntentId==intent.Id);

        if(basket != null)
        {
            storeContext.Baskets.Remove(basket);
        }

        await storeContext.SaveChangesAsync();
    }

    private Event ConstructStripeEvent(string json)
    {
        try
        {
            return EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], configuration["StripeSettings:WhSecret"]);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to construct stripe event");
            throw new StripeException("Invalid Signature");
        }
    }
}
