import ProductList from "./ProductList";
import { useGetProductsQuery } from "./catalogApi";

export default function Catalog() {

  const {data, isLoading } = useGetProductsQuery();

  if(isLoading || !data)
    return <div>Loading...</div>
  
  return (
    <>
      <ProductList products={data} />
    </>
  );
}
