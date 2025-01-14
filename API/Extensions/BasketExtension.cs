using System;
using API.DTOs;
using API.Entities;

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
                Quantity = x.Quantity
            }).ToList()
        };
    }
}
