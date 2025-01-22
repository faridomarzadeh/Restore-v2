import { Box, Paper } from "@mui/material";
import Search from "./Search";
import RadioButtonGroup from "../../app/shared/components/RadioButtonGroup";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setBrands, setOrderBy, setTypes } from "./catalogSlice";
import CheckboxButtons from "../../app/shared/components/CheckboxButtons";

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'price', label: 'Price: Low to High'},
    {value: 'priceDesc', label: 'Price: High to Low'},

]

type Props = {
    filterData: {brands: string[], types: string[]}
}
export default function Filters({filterData: data}:Props) {
    const {orderBy, brands, types} = useAppSelector(state=>state.catalog);
    const dispatch = useAppDispatch();
    
  return (
    <Box sx={{display:'flex', flexDirection:'column', gap: 3}}>
        <Paper>
            <Search/>
        </Paper>
        <Paper sx={{p:3}}>
            <RadioButtonGroup options={sortOptions}
            selectedValue= {orderBy}
            onChange={e => dispatch(setOrderBy(e.target.value))}
            />
        </Paper>
        <Paper sx={{p:3}}>
            <CheckboxButtons
            items={data.brands}
            checked={brands}
            onChange={(items:string[]) => dispatch(setBrands(items))}
            />
        </Paper>

        <Paper sx={{p:3}}>
        <CheckboxButtons
            items={data.types}
            checked={types}
            onChange={(items:string[]) => dispatch(setTypes(items))}
            />
        </Paper>
    </Box>
  )
}
