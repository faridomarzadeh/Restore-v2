using System;
using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }
    public required DbSet<Basket> Baskets { get; set; }
    public required DbSet<Order> Orders {get; set;}

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<IdentityRole>()
        .HasData(
            new IdentityRole{Id="5cdafb13-0326-4634-a0c6-873004470268", Name="Member", NormalizedName="MEMBER"},
            new IdentityRole{Id ="eb7fddfd-8c7c-406c-85ce-cdab435d6084", Name="Admin", NormalizedName="ADMIN"}
        );
    }
}
