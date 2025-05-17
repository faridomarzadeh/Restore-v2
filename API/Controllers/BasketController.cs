using System;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController(StoreContext context): BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await GetBasketAsync();

        if(basket==null) return NoContent();

        return basket.ToDto();
    }

    [HttpPost]
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
        var basket = await GetBasketAsync();
        basket??=CreateBasket();

        var product = await context.Products.FirstOrDefaultAsync(p=>p.Id==productId);

        if(product == null)
            return BadRequest("Problem adding item to basket");

        basket.AddItem(product, quantity);
        
        var result = await context.SaveChangesAsync() > 0;

        if(result) return CreatedAtAction(nameof(GetBasket), basket.ToDto());

        return BadRequest("Problem updating basket");
    }


    [HttpDelete]
    public async Task<ActionResult> DeleteItemFromBasket(int productId, int quantity)
    {
        var basket = await GetBasketAsync();
        if(basket == null)
            return BadRequest("Unable to retrieve basket");

        basket.RemoveItem(productId, quantity);

        var result = await context.SaveChangesAsync() > 0;

        if(result) return Ok();

        return BadRequest("Problem deleting item from basket");
    }

    private async Task<Basket?> GetBasketAsync()
    {
        return await context.Baskets
        .Include(x=>x.Items)
        .ThenInclude(x=>x.Product)
        .FirstOrDefaultAsync(x=>x.BasketId==Request.Cookies["basketId"]);
    }

    private Basket CreateBasket()
    {
        var basketId = Guid.NewGuid().ToString();

        var cookiesOption = new CookieOptions
        {
            IsEssential = true,
            Expires = DateTime.UtcNow.AddDays(30)
        };
        Response.Cookies.Append("basketId",basketId,cookiesOption);
        var basket = new Basket{ BasketId = basketId};
        context.Baskets.Add(basket);
        return basket;
    }
}
