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
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import Review from "./Review";
import {
  useFetchAddressQuery,
  useUpdateUserAddressMutation,
} from "../account/accountApi";
import { Address } from "../../app/models/user";
import {
    ConfirmationToken,
  StripeAddressElementChangeEvent,
  StripePaymentElementChangeEvent,
} from "@stripe/stripe-js";
import { useBasket } from "../../lib/hooks/useBasket";
import { currencyFormat } from "../../lib/util";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoadingButton} from '@mui/lab'

const steps = ["Address", "Payment", "Review"];

export default function CheckoutStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const { data: { name, ...restAddress } = {} as Address, isLoading } = useFetchAddressQuery();
  const {basket, clearBasket} = useBasket();
  const [submitting, setSubmitting] = useState(false);
  const [addressChecked, setAddressChecked] = useState(false);
  const [updateAddress] = useUpdateUserAddressMutation();
  const elements = useElements();
  const stripe = useStripe();
  const [addressComplete, setAddressComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { total } = useBasket();
  const navigate = useNavigate();
  const [confirmationToken, setConfirmationToken] = useState<ConfirmationToken | null>(null);

  const handleNext = async () => {
    if (activeStep === 0 && addressChecked && elements) {
      const address = await getStripeAddress();
      if (address) await updateAddress(address);
    }

    if(activeStep===1)
    {
        if(!elements || !stripe) return;

        const result = await elements.submit();
        if(result.error)
        {
            toast.error(result.error.message);
            return;
        }
        const stripeResult = await stripe.createConfirmationToken({elements});
        if(stripeResult.error)
        {
            toast.error(stripeResult.error.message);
            return;
        }
        setConfirmationToken(stripeResult.confirmationToken);
    }
    if(activeStep===2)
        await confirmPayment();
    if (activeStep < steps.length - 1) {
      setActiveStep((step) => step + 1);
    }
  };

  const confirmPayment = async () => {

    setSubmitting(true);
    try {
        if(!basket?.clientSecret || !confirmationToken) 
            throw new Error('Unable to process payment');

        const paymentResult = await stripe?.confirmPayment({
            redirect: 'if_required',
            clientSecret: basket.clientSecret,
            confirmParams : {
                confirmation_token: confirmationToken.id
            }
        });

        if(paymentResult?.paymentIntent?.status==='succeeded')
        {
            navigate("/checkout/success");
            clearBasket();
        }
        else if(paymentResult?.error)
        {
            throw new Error(paymentResult.error.message);
        }
        else
        {
            throw new Error('Something went wrong');
        }

    } catch (error) {
        if(error instanceof Error)
        {
            toast.error(error.message);
        }
        setActiveStep(activeStep - 1);
    }
    finally
    {
        setSubmitting(false);
    }
  }

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

  const handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    setAddressComplete(event.complete);
  };

  const handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    setPaymentComplete(event.complete);
  };

  if (isLoading) return <Typography>Loading Address...</Typography>;

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
            onChange={handleAddressChange}
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
          <PaymentElement onChange={handlePaymentChange} 
          options={
            {
                wallets: {
                    applePay: 'never',
                    googlePay: 'never'
                }
            }
          }
          />
        </Box>
        <Box display={activeStep === 2 ? "block" : "none"}>
          <Review  confirmationToken = {confirmationToken} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" paddingTop={2}>
        <Button onClick={handleBack} disabled={activeStep < 1}>
          Back
        </Button>
        <LoadingButton
          onClick={handleNext}
          disabled={
            (activeStep === 0 && !addressComplete) ||
            (activeStep === 1 && !paymentComplete) ||
            submitting
          }
          loading={submitting}
        >
          {activeStep === steps.length - 1
            ? `Pay ${currencyFormat(total)}`
            : "Next"}
        </LoadingButton>
      </Box>
    </Paper>
  );
}
