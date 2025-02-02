using System;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class BasketExtension
{
    public static BasketDto ToDto(this Basket basket)
    {
        return new BasketDto
        {
            BasketId = basket.BasketId,
            Items = basket.Items.Select(x => new BasketItemDto
            {
                ProductId = x.ProductId,
                Name = x.Product.Name,
                Brand = x.Product.Brand,
                Type = x.Product.Type,
                Price = x.Product.Price,
                PictureUrl = x.Product.PictureUrl,
                Quantity = x.Quantity,
            }).ToList(),
            ClientSecret = basket.ClientSecret,
            PaymentIntentId = basket.PaymentIntentId
        };
    }

    public static async Task<Basket> GetBasketAsync(this IQueryable<Basket> query, string? basketId)
    {
        return await query.Include(x=>x.Items)
        .ThenInclude(x=>x.Product)
        .FirstOrDefaultAsync(x=>x.BasketId==basketId)?? throw new Exception("problem retrieving basket");
    }
}
