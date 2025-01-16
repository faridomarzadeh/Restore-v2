import { Box, Grid2, IconButton, Paper, Typography } from "@mui/material";
import { Item } from "../../app/models/basket";
import { Add, Close, Remove } from "@mui/icons-material";
import {
  useAddItemsToBasketMutation,
  useRemoveItemsFromBasketMutation,
} from "./basketApi";
import { currencyFormat } from "../../lib/util";

type Props = {
  item: Item;
};
export default function BasketItem({ item }: Props) {
  const [addItemToBasket] = useAddItemsToBasketMutation();
  const [removeItemsFromBasket] = useRemoveItemsFromBasketMutation();
  return (
    <Paper
      sx={{
        height: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 2,
        mb: 1,
      }}
    >
      <Box display="flex" alignItems="center">
        <Box
          component="img"
          src={item.pictureUrl}
          sx={{
            height: 100,
            width: 100,
            borderRadius: "4px",
            objectFit: "cover",
            ml: 8,
            mr: 4,
          }}
          alt={item.name}
        />
        <Box display="flex" flexDirection={"column"} gap={1}>
          <Typography variant="h6">{item.name}</Typography>
          <Box display="flex" alignItems={"center"} gap={3}>
            <Typography sx={{ fontSize: "1.1rem" }}>
              {currencyFormat(item.price * item.quantity)}
            </Typography>
            <Typography sx={{ fontSize: "1.1rem" }} color="primary">
              {currencyFormat(item.price)}
            </Typography>
          </Box>
          <Grid2 display="flex" alignItems="center" gap={2}>
            <IconButton
              onClick={() =>
                removeItemsFromBasket({
                  productId: item.productId,
                  quantity: 1,
                })
              }
              sx={{ border: 1, borderRadius: 1, minHeight: 0 }}
              color="error"
            >
              <Remove />
            </IconButton>
            <Typography variant="h6">{item.quantity}</Typography>
            <IconButton
            onClick={() => addItemToBasket({product: item, quantity:1})}
              sx={{ border: 1, borderRadius: 1, minHeight: 0 }}
              color="success"
            >
              <Add />
            </IconButton>
          </Grid2>
        </Box>
      </Box>
      <IconButton
        onClick={() =>
          removeItemsFromBasket({
            productId: item.productId,
            quantity: item.quantity,
          })
        }
        sx={{
          border: 1,
          borderRadius: 1,
          minHeight: 0,
          mt: 1,
          mr: 1,
          alignSelf: "start",
        }}
        color="error"
      >
        <Close />
      </IconButton>
    </Paper>
  );
}
