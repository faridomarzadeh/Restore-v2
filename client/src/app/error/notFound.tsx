import { SearchOff } from "@mui/icons-material"
import { Button, Paper, Typography } from "@mui/material"
import { Link } from "react-router-dom"

export const NotFound = () => {
    return(
        <Paper
        sx={{
            height:400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}
        >
            <SearchOff
            sx={{
                fontSize: 100
            }}
            color="primary"
            />
            <Typography gutterBottom variant="h3">
                Oops! we could not find what you were looking for
            </Typography>
            <Button component={Link} to='/catalog' fullWidth>
            Back to shop
            </Button>
        </Paper>
    )
}