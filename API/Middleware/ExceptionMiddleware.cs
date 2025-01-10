using System;
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware;

public class ExceptionMiddleware(IHostEnvironment environment,
 ILogger<ExceptionMiddleware> logger) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleException(ex,context);
        }
    }

    private async Task HandleException(Exception ex, HttpContext context)
    {
        logger.LogError(ex,ex.Message);

        context.Response.ContentType="application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response = new ProblemDetails 
        {
            Status = 500,
            Detail = environment.IsDevelopment() ? ex.StackTrace : null,
            Title = ex.Message
        };

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        var json = JsonSerializer.Serialize(response,options);

        await context.Response.WriteAsync(json);
    }
}
