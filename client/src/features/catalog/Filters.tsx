import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Paper, Radio, TextField } from "@mui/material";
import { useGetFiltersQuery } from "./catalogApi"

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'price', label: 'Price: Low to High'},
    {value: 'priceDesc', label: 'Price: High to Low'},

]
export default function Filters() {
    const {data} = useGetFiltersQuery();
    console.log(data);
    
  return (
    <Box sx={{display:'flex', flexDirection:'column', gap: 3}}>
        <Paper>
            <TextField
            label = 'Search Products'
            variant="outlined"
            fullWidth
            />
        </Paper>
        <Paper sx={{p:3}}>
            <FormControl>
                {sortOptions.map(({value,label}) => (
                    <FormControlLabel
                     key={label}
                    control={<Radio sx={{py:0.7}} />}
                    label={label}
                    value={value}
                    />
                ))}
            </FormControl>
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
