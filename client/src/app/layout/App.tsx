import { useEffect, useState } from "react";
import { Product } from "../models/product";
import Catalog from "../../features/catalog/Catalog";


function App() {

  const [products, setProducts] = useState<Product[]>([])

  const addProduct = () => {

    setProducts(prevState => [...prevState , 
      {
        id: prevState.length +1,
        name:'product'+ (prevState.length + 1),
        price: (prevState.length + 1) * 100,
        description: 'test',
        pictureUrl: 'https://picsum.photo/200',
        type: 'test',
        brand: 'test',
        quantityInStock: 100
      }
    ]);
  }

  useEffect(() => {

    fetch("https://localhost:5001/api/products")
    .then( response => response.json())
    .then(data => setProducts(data));

  },[])
  return (
    <div>
      <h1 style={{color:'red'}}>Re-Store</h1>
      <Catalog products={products} addProduct={addProduct}/>
    </div>
  );
}

export default App;
