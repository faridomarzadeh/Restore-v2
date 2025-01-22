import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  items: string[];
  checked: string[];
  onChange: (items: string[]) => void;
};

export default function CheckboxButtons({ items, checked, onChange }: Props) {
  const [checkedItems, setCheckedItems] = useState(checked);

  useEffect(() => {
    setCheckedItems(checked);
  }, [checked]);

  const handleToggle = (value: string) => {
    const updatedCheckedList = checkedItems.includes(value)
      ? checkedItems.filter((item) => item !== value)
      : [...checkedItems, value];

    setCheckedItems(updatedCheckedList);
    onChange(updatedCheckedList);
  };
  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          checked={checkedItems.includes(item)}
          onClick={() => handleToggle(item)}
          key={item}
          control={
            <Checkbox sx={{ py: 0.7, fontSize: 40 }} color="secondary" />
          }
          label={item}
        ></FormControlLabel>
      ))}
    </FormGroup>
  );
}
