import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { ChangeEvent } from "react";

type Props = {
    options: {value:string, label:string}[],
    selectedValue: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
export default function RadioButtonGroup({options,selectedValue,onChange}:Props) {
  return (
    <FormControl>
        <RadioGroup 
        onChange={onChange}
        value={selectedValue}
        >
        {options.map(({value,label}) => (
        <FormControlLabel
         key={label}
        control={<Radio sx={{py:0.7}} color="secondary"/>}
        label={label}
        value={value}
        />
    ))}
        </RadioGroup>
</FormControl>
  )
}
