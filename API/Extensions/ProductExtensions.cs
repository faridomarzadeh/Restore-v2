using System;
using API.Entities;

namespace API.Extensions;

public static class ProductExtensions
{
    public static IQueryable<Product> Sort(this IQueryable<Product> products, string? orderBy)
    {
        var query = orderBy switch
        {
            "price" => products.OrderBy(x => x.Price),
            "priceDesc" => products.OrderByDescending(x => x.Price),
            _ => products.OrderBy(x => x.Name)
        };

        return query;
    }

    public static IQueryable<Product> Search(this IQueryable<Product> products, string? searchTerm)
    {
        if (searchTerm == null) return products;

        var loweredSearchTerm = searchTerm.Trim().ToLower();

        return products.Where(x => x.Name.ToLower().Contains(loweredSearchTerm));
    }

    public static IQueryable<Product> Filter(this IQueryable<Product> products, string? brands, string? types)
    {
        var brandsList = new List<string>();
        var typesList = new List<string>();
        if (!string.IsNullOrEmpty(brands))
        {
            brandsList.AddRange([.. brands.ToLower().Split(",")]);
        }
        if (!string.IsNullOrEmpty(types))
        {
            typesList.AddRange([.. types.ToLower().Split(",")]);
        }

        var query = products.Where(x => brandsList.Count==0 || brandsList.Contains(x.Brand.ToLower()))
        .Where(x=> typesList.Count ==0 || typesList.Contains(x.Type.ToLower()));

        return query;
    }
}
