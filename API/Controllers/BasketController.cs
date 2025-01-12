using System;
using API.Data;
using API.Data.Migrations;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController(StoreContext context): BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<Basket>> GetBasket()
    {
        var basket = await GetBasketAsync();

        if(basket==null) return NoContent();

        return basket;
    }

    [HttpPost]
    public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
    {
        var basket = await GetBasketAsync();
        basket??=CreateBasket();

        var product = await context.Products.FirstOrDefaultAsync(p=>p.Id==productId);

        if(product == null)
            return BadRequest("Problem adding item to basket");

        basket.AddItem(product, quantity);
        
        var result = await context.SaveChangesAsync() > 0;

        if(result) return CreatedAtAction(nameof(GetBasket), basket);

        return BadRequest("Problem updating basket");
    }


    [HttpDelete]
    public async Task<ActionResult> DeleteItemFromBasket(int productId, int quantity)
    {
        var basket = await GetBasketAsync();
        if(basket == null)
            return BadRequest("problem deleting item from basket");

        basket.RemoveItem(productId, quantity);

        await context.SaveChangesAsync();
        return Ok();
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
