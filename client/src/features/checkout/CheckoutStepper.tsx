import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import {
  AddressElement,
  PaymentElement,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import Review from "./Review";
import {
  useFetchAddressQuery,
  useUpdateUserAddressMutation,
} from "../account/accountApi";
import { Address } from "../../app/models/user";

const steps = ["Address", "Payment", "Review"];

export default function CheckoutStepper() {
  const [activeStep, setActiveStep] = useState(0);

  const { data: { name, ...restAddress } = {} as Address , isLoading } =
    useFetchAddressQuery();

  const [addressChecked, setAddressChecked] = useState(false);
  const [updateAddress] = useUpdateUserAddressMutation();
  const elements = useElements();

  const handleNext = async () => {
    if (activeStep === 0 && addressChecked && elements) {
      const address = await getStripeAddress();
      if (address) await updateAddress(address);
    }
    setActiveStep((step) => step + 1);
  };

  const getStripeAddress = async () => {
    const addressElement = elements?.getElement("address");

    if (!addressElement) return null;

    const {
      value: { name, address },
    } = await addressElement.getValue();
    if (name && address) return { ...address, name };

    return null;
  };

  const handleBack = () => {
    setActiveStep((step) => step - 1);
  };

  if(isLoading)
    return <Typography>Loading Address...</Typography>

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box sx={{ mt: 2 }}>
        <Box display={activeStep === 0 ? "block" : "none"}>
          <AddressElement
            options={{
              mode: "shipping",
              defaultValues: {
                name: name,
                address: restAddress,
              },
            }}
          />
          <FormControlLabel
            sx={{ display: "flex", justifyContent: "end" }}
            control={
              <Checkbox
                checked={addressChecked}
                onChange={(e) => setAddressChecked(e.target.checked)}
              />
            }
            label="save as default address"
          />
        </Box>
        <Box display={activeStep === 1 ? "block" : "none"}>
          <PaymentElement />
        </Box>
        <Box display={activeStep === 2 ? "block" : "none"}>
          <Review />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" paddingTop={2}>
        <Button onClick={handleBack} disabled={activeStep < 1}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={activeStep > 1}>
          Next
        </Button>
      </Box>
    </Paper>
  );
}
