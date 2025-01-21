import { Grid2 } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
};

export default function ProductList({ products }: Props) {
  return (
    <Grid2 spacing={3} container>
      {products.map((product) => (
        <Grid2 key={product.id} size={3} display="flex">
          <ProductCard product={product} />
        </Grid2>
      ))}
    </Grid2>
  );
}
