import { ShoppingBag, ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

type Props = {
  handleSwitch: () => void;
};

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];

const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

const linksStyle = { 
  color: "inherit",
  typography: "h6",
  textDecoration: 'none',
  '&:hover': {
    color: 'grey.500'
  },
  '&.active': {
    color: '#baecf9'
  }
   }

export default function NavBar({ handleSwitch }: Props) {
  const label = { inputProps: { "aria-label": "Dark" } };
  return (
    <AppBar position="fixed">
      <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Box display={'flex'} alignItems={'center'}>
        <Typography variant="h6" component={NavLink} to={"/"} sx={linksStyle}>
          RE-STORE
        </Typography>
        <Switch {...label} onChange={handleSwitch} color="primary" />
        </Box>
        <List sx={{ display: "flex" }}>
          {midLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={linksStyle}
            >
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
        <Box display={'flex'} alignItems={'center'}>
        <IconButton size="large">
          <Badge badgeContent="4" color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>
        <List sx={{ display: "flex" }}>
          {rightLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={linksStyle}
            >
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
