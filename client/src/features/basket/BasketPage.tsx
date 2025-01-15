import { Grid2, Typography } from "@mui/material";
import { useFetchBasketQuery } from "./basketApi";
import BasketItem from "./BasketItem";

export default function BasketPage() {
  const { data, isLoading } = useFetchBasketQuery();

  if (isLoading) return <Typography>Basket Loading...</Typography>;

  if (!data) return <Typography variant="h3">your basket is Empty</Typography>;

  return (
    <Grid2 container spacing={2}>
        <Grid2 size={8} spacing={1}>
            {data.items.map(item => (
                <BasketItem item ={item} key={item.productId}/>
            ))}
        </Grid2>
    </Grid2>
  )
}
