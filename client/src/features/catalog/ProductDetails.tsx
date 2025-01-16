import { useParams } from "react-router-dom";
import {
  Button,
  Divider,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useGetProductQuery } from "./catalogApi";
import { useAddItemsToBasketMutation, useFetchBasketQuery, useRemoveItemsFromBasketMutation } from "../basket/basketApi";
import { ChangeEvent, useEffect, useState } from "react";
import { currencyFormat } from "../../lib/util";

export default function ProductDetails() {
  const { id } = useParams();

  const {data: basket} = useFetchBasketQuery();
  const [addItemToBasket] = useAddItemsToBasketMutation();
  const [removeItemsFromBasket] = useRemoveItemsFromBasketMutation();

  const item = basket?.items.find(p=>p.productId == +id!);

  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if(item) setQuantity(item.quantity);
  },[item])

  const {data: product, isLoading} = useGetProductQuery( id? +id : 0);

  if (!product  || isLoading) return <div>Loding...</div>;


  const handleUpdateQuantity = () => {

    const updatedQuantity = item? Math.abs(quantity - item.quantity): quantity;

    if(!item || quantity > item.quantity)
      addItemToBasket({product,quantity:updatedQuantity});

    else if(item && quantity < item.quantity)
      removeItemsFromBasket({productId:item.productId, quantity:updatedQuantity});
  }

  const handleChangeValue = (event: ChangeEvent<HTMLInputElement>) => {

    const value = +event.currentTarget.value;

    if(value>=0) setQuantity(value);
  }

  const productDetails = [
    {label: 'Name', value: product.name},
    {label: 'Description', value: product.description},
    {label: 'Type', value: product.type},
    {label: 'Brand', value: product.brand},
    {label: 'Quantity in stock', value: product.quantityInStock}
  ]

  return (
    <Grid2 container spacing={6} maxWidth="lg" sx={{ mx: "auto" }}>
      <Grid2 size={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid2>
      <Grid2 size={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          {currencyFormat(product.price)}
        </Typography>
        <TableContainer>
          <Table sx={{
            '& td' : {fontSize: '1rem'}
          }}>
            <TableBody>
                {productDetails.map((details,index)=> (
                         <TableRow key={index}>
                            <TableCell sx={{fontSize:'bold'}}>{details.label}</TableCell>
                            <TableCell sx={{fontSize:'bold'}}>{details.value}</TableCell>
                         </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid2 container spacing={2} mt={3}>
            <Grid2 size={6}>
                <TextField
                variant="outlined"
                type="number"
                label="Quantity in basket"
                fullWidth
                onChange={handleChangeValue}
                value={quantity}
                />
            </Grid2>
            <Grid2 size={6} >
                <Button
                disabled={(item && item.quantity==quantity) || (!item && quantity<=0)}
                color="primary"
                size="large"
                variant="contained"
                fullWidth
                sx={{height:'55px'}}
                onClick={() => handleUpdateQuantity()}
                >
                   {(!item && quantity>0)? 'Add to basket' : 'Update basket'} 
                </Button>
            </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
