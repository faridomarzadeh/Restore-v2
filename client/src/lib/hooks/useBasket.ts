import { useClearBasketMutation, useFetchBasketQuery } from "../../features/basket/basketApi";

export const useBasket = () => {
      const { data: basket } = useFetchBasketQuery();
      const [clearBasket] = useClearBasketMutation();
      const subtotal = (basket == null) ? 0: basket.items.reduce((sum, item) => (sum += item.price * item.quantity),0);
      const deliveryFee = subtotal === 0 || subtotal / 100 >= 100 ? 0 : 500;
      const total = subtotal + deliveryFee;

      return {basket, subtotal, deliveryFee, total, clearBasket}
}