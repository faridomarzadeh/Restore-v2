import { Box, Checkbox, FormControlLabel, FormGroup, Paper, TextField } from "@mui/material";
import { useGetFiltersQuery } from "./catalogApi"
import Search from "./Search";
import RadioButtonGroup from "../../app/shared/components/RadioButtonGroup";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setOrderBy } from "./catalogSlice";

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'price', label: 'Price: Low to High'},
    {value: 'priceDesc', label: 'Price: High to Low'},

]
export default function Filters() {
    const {data} = useGetFiltersQuery();
    const {orderBy} = useAppSelector(state=>state.catalog);
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
            <FormGroup>
                {data && data.brands.map((item) => (
                    <FormControlLabel
                    key={item}
                    control={<Checkbox sx={{py:0.7, fontSize: 40}} color="secondary"/>}
                    label={item}
                    >
                        </FormControlLabel>
                ))}
            </FormGroup>
        </Paper>

        <Paper sx={{p:3}}>
            <FormGroup>
                {data && data.types.map((item) => (
                    <FormControlLabel
                    key={item}
                    control={<Checkbox sx={{py:0.7, fontSize: 40}} color="secondary"/>}
                    label={item}
                    >
                        </FormControlLabel>
                ))}
            </FormGroup>
        </Paper>
    </Box>
  )
}
