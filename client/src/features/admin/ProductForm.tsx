import { useForm } from "react-hook-form"
import { createProductSchema, CreateProductSchema } from "../../lib/schemas/createProductSchema"
import { Box, Button, Grid2, Paper, Typography } from "@mui/material"
import AppTextInput from "../../app/shared/components/AppTextInput"
import { zodResolver } from "@hookform/resolvers/zod"

export default function ProductForm() {

    const {control, handleSubmit} = useForm<CreateProductSchema>({
        //mode: 'onTouched',
        resolver: zodResolver(createProductSchema)
    })

    const onSubmit = (data: CreateProductSchema) => {
        console.log(data);
        
    }
  return (
    <Box component = {Paper} sx={{p:4, maxWidth: 'lg', mx: 'auto' }}>
        <Typography variant="h4" sx={{mb:4}}>
            Product details
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container spacing={3}>
                <Grid2 size={12}>
                    <AppTextInput control={control} name="name" label='Product name'/>
                </Grid2>

            </Grid2>

            <Box display='flex' justifyContent='space-between' sx={{mt:3}}>
                <Button variant="contained" color="inherit">Cancel</Button>
                <Button variant="contained" color="success" type="submit">Submit</Button>
            </Box>
        </form>
    </Box>
  )
}
