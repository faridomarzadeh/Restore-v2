using System;
using API.Entities;
using Stripe;

namespace API.Services;

public class PaymentsService(IConfiguration configuration)
{
    public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
    {
        StripeConfiguration.ApiKey = configuration["StripeSettings:SecretKey"];
        var intentService = new PaymentIntentService();
        var intent = new PaymentIntent();
        var subtotal = basket.Items.Sum( item => item.Quantity * item.Product.Price);
        var deliveryFee = subtotal > 10000 ? 0:500;

        if(string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = subtotal + deliveryFee,
                Currency = "usd",
                PaymentMethodTypes = ["card"]
            };

            intent = await intentService.CreateAsync(options);
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = subtotal + deliveryFee
            };

            await intentService.UpdateAsync(basket.PaymentIntentId, options);
        }

        return intent;
    }
}
