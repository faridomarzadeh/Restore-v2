import { FieldValues, useForm } from "react-hook-form";
import {
  createProductSchema,
  CreateProductSchema,
} from "../../lib/schemas/createProductSchema";
import { Box, Button, Grid2, Paper, Typography } from "@mui/material";
import AppTextInput from "../../app/shared/components/AppTextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetFiltersQuery } from "../catalog/catalogApi";
import AppSelectInput from "../../app/shared/components/AppSelectInput";
import AppDropzone from "../../app/shared/components/AppDropzone";
import { Product } from "../../app/models/product";
import { useEffect } from "react";
import { useCreateProductMutation, useUpdateProductMutation } from "./adminApi";
import { handleApiError } from "../../lib/util";

type Props = {
  handleCancel: () => void;
  product: Product | null;
  refetch: () => void;
}

export default function ProductForm({product, handleCancel, refetch}:Props) {
  const { control, handleSubmit, watch, reset, setError } = useForm<CreateProductSchema>({
    mode: 'onTouched',
    resolver: zodResolver(createProductSchema),
  });

  const watchFile = watch('file');
  const { data } = useGetFiltersQuery();

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  useEffect(()=> {

    if(product) reset(product);

    return () => {
      if(watchFile) URL.revokeObjectURL(watchFile.preview);
    }

  },[product, reset, watchFile]);

  const createFormData = (items:FieldValues) => {
    const formData = new FormData();

    for(const key in items)
    {
      formData.append(key,items[key]);
    }

    return formData;
  }

  const onSubmit = async (data: CreateProductSchema) => {

    try {

      const formData = createFormData(data);

      if(watchFile) formData.append('file',watchFile);
      if(product) await updateProduct({id:product.id.toString(), data: formData}).unwrap();
      else await createProduct(formData).unwrap();
      handleCancel();
      refetch();
    } catch (error) {
      handleApiError<CreateProductSchema>(error,setError,
        ['brand','description','file','name', 'pictureUrl', 'price', 'quantityInStock', 'type']);
    }
  };
  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: "lg", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Product details
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={3}>
          <Grid2 size={12}>
            <AppTextInput control={control} name="name" label="Product name" />
          </Grid2>
          <Grid2 size={6}>
            {data?.brands && (
              <AppSelectInput
                items={data?.brands}
                control={control}
                name="brand"
                label="Brand"
              />
            )}
          </Grid2>
          <Grid2 size={6}>
            {data?.types && (
              <AppSelectInput
                items={data.types}
                control={control}
                name="type"
                label="Type"
              />
            )}
          </Grid2>
          <Grid2 size={6}>
            <AppTextInput
              type="number"
              control={control}
              name="price"
              label="Price in cents"
            />
          </Grid2>
          <Grid2 size={6}>
            <AppTextInput
              type="number"
              control={control}
              name="quantityInStock"
              label="Quantity in stock"
            />
          </Grid2>

          <Grid2 size={12}>
            <AppTextInput
              control={control}
              name="description"
              label="Description"
              multiline
              rows={4}
            />
          </Grid2>
          <Grid2 size={12} display='flex' justifyContent='space-between' alignItems='center'>
            <AppDropzone control={control} name="file"/>
            {watchFile?.preview ? (
                <img src={watchFile.preview} alt="Preview of Image" style={{maxHeight:200}} />
            ): ( 
              product?.pictureUrl && <img src={product.pictureUrl} alt="Preview of Image" style={{maxHeight:200}} />
            )}
          </Grid2>
        </Grid2>

        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button onClick={()=>handleCancel()} variant="contained" color="inherit">
            Cancel
          </Button>
          <Button variant="contained" color="success" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
