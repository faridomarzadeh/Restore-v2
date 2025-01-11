import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, Typography } from "@mui/material";
import { useLazyGet400ErrorQuery, useLazyGet401ErrorQuery, useLazyGet404ErrorQuery, useLazyGet500ErrorQuery, useLazyGetValidationErrorQuery } from "./errorApi";
import { useState } from "react";


export default function AboutPage() {


  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [get400Error] = useLazyGet400ErrorQuery();
  const [get404Error] = useLazyGet404ErrorQuery();
  const [get401Error] = useLazyGet401ErrorQuery();
  const [get500Error] = useLazyGet500ErrorQuery();
  const [getValidationError] = useLazyGetValidationErrorQuery();

  const handleValidationErrors = async() => {
    try {
      await getValidationError().unwrap();
    } catch (errors : unknown) {

      if(errors && typeof errors ==='object' && 'message' in
        errors && typeof(errors as {message: unknown}).message ==='string')
        {
          const errorsArray = (errors as {message: string}).message.split('; ');
          setValidationErrors(errorsArray);
        }
      
    }
  }

  return (
    <Container maxWidth='lg'>
      <Typography variant="h3" gutterBottom>Testing Errors Page</Typography>
      <ButtonGroup sx={{width:'100%'}}>
        <Button variant="contained"
        onClick={() => get400Error().catch(err => console.log(err))}
        >
          Get 400 Error
        </Button>
        <Button variant="contained"
        onClick={() => get404Error().catch(err => console.log(err))}
        >
          Get 404 Error
        </Button>
        <Button variant="contained"
        onClick={() => get401Error().catch(err => console.log(err))}
        >
          Get 401 Error
        </Button>
        <Button variant="contained"
        onClick={() => get500Error().catch(err => console.log(err))}
        >
          Get 500 Error
        </Button>
        <Button variant="contained"
        onClick={() => handleValidationErrors()}
        >
          Get Validation Error
        </Button>
      </ButtonGroup>
      {
        validationErrors.length >0 && 
        <Alert>
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
            {validationErrors.map(error =>(
              <ListItem key={error}>{error}</ListItem>
            ))}
          </List>
        </Alert>
      }
    </Container>
  )
}
