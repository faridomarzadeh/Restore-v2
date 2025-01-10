import { Button, ButtonGroup, Container, Typography } from "@mui/material";
import { useLazyGet400ErrorQuery, useLazyGet401ErrorQuery, useLazyGet404ErrorQuery, useLazyGet500ErrorQuery, useLazyGetValidationErrorQuery } from "./errorApi";

export default function AboutPage() {

  const [get400Error] = useLazyGet400ErrorQuery();
  const [get404Error] = useLazyGet404ErrorQuery();
  const [get401Error] = useLazyGet401ErrorQuery();
  const [get500Error] = useLazyGet500ErrorQuery();
  const [getValidationError] = useLazyGetValidationErrorQuery();

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
        onClick={() => getValidationError().catch(err => console.log(err))}
        >
          Get Validation Error
        </Button>
      </ButtonGroup>
    </Container>
  )
}
