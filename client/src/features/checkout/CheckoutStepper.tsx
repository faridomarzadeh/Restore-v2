import { Box, Button, Paper, Step, StepLabel, Stepper } from "@mui/material";
import { useState } from "react"

const steps = ['Address', 'Payment', 'Review'];

export default function CheckoutStepper() {

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep(step => step + 1);
    }

    const handleBack = () => {
        setActiveStep(step => step -1);
    }
  return (
    <Paper sx={{p: 3, borderRadius: 3}}>
        <Stepper activeStep={activeStep}>
            {steps.map((label,index) => {
                return (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                )
            })}
        </Stepper>
        <Box sx={{mt: 2}}>
            <Box display={activeStep===0 ? 'block': 'none'}>
                Address
            </Box>
            <Box display={activeStep===1 ? 'block': 'none'}>
                Payment
            </Box>
            <Box display={activeStep===2 ? 'block': 'none'}>
                Review
            </Box>
        </Box>
        <Box display='flex' justifyContent='space-between' paddingTop={2}>
            <Button onClick={handleBack} disabled={activeStep < 1}>Back</Button>
            <Button onClick={handleNext} disabled={activeStep > 1}>Next</Button>
        </Box>
    </Paper>
  )
}
