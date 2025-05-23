using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    public class OrderItem
    {
        public int Id { get; set; }
        public required ProductItemOrdered Item { get; set; }
        public int Quantity { get; set; }
        public long Price { get; set; }
    }
}