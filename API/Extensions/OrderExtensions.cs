using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        public static IQueryable<OrderDto> ProjectToDto(this IQueryable<Order> query)
        {
            return query.Select(order => new OrderDto
            {
                Id = order.Id,
                BuyerEmail = order.BuyerEmail,
                OrderDate = order.OrderDate,
                ShippingAddress = order.ShippingAddress,
                PaymentSummary = order.PaymentSummary,
                DeliveryFee = order.DeliveryFee,
                Discount = order.Discount,
                Subtotal = order.Subtotal,
                OrderItems = order.OrderItems.Select(item => new 
                OrderItemDto
                {
                    Name = item.Item.Name,
                    PictureUrl = item.Item.PictureUrl,
                    Price = item.Price,
                    ProductId = item.Item.ProductId,
                     Quantity = item.Quantity,
                }).ToList(),
                OrderStatus = order.OrderStatus.ToString(),
                Total = order.GetTotal(),
            }).AsNoTracking();
        }

        public static OrderDto ToDto(this Order order)
        {
            return new OrderDto {
                Id = order.Id,
                BuyerEmail = order.BuyerEmail,
                OrderDate = order.OrderDate,
                ShippingAddress = order.ShippingAddress,
                PaymentSummary = order.PaymentSummary,
                DeliveryFee = order.DeliveryFee,
                Discount = order.Discount,
                Subtotal = order.Subtotal,
                OrderStatus = order.OrderStatus.ToString(),
                Total = order.GetTotal(),
                OrderItems = order.OrderItems.Select(item => new 
                OrderItemDto
                {
                    Name = item.Item.Name,
                    PictureUrl = item.Item.PictureUrl,
                    Price = item.Price,
                    ProductId = item.Item.ProductId,
                     Quantity = item.Quantity,
                }).ToList(),
            };
        }
    }
}