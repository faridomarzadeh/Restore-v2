import { useForm } from "react-hook-form";
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

export default function ProductForm() {
  const { control, handleSubmit, watch } = useForm<CreateProductSchema>({
    mode: 'onTouched',
    resolver: zodResolver(createProductSchema),
  });

  const watchFile = watch('file');
  const { data } = useGetFiltersQuery();
  const onSubmit = (data: CreateProductSchema) => {
    console.log(data);
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
            {watchFile && (
                <img src={watchFile.preview} alt="Preview of Image" style={{maxHeight:200}} />
            )}
          </Grid2>
        </Grid2>

        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button variant="contained" color="inherit">
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
