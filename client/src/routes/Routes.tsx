import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../app/layout/App";
import AboutPage from "../features/about/AboutPage";
import HomePage from "../features/home/HomePage";
import Catalog from "../features/catalog/Catalog";
import ProductDetails from "../features/catalog/ProductDetails";
import ContactPage from "../features/contact/ContactPage";
import { ServerError } from "../app/error/serverError";
import { NotFound } from "../app/error/notFound";
import BasketPage from "../features/basket/BasketPage";
import CheckoutPage from "../features/checkout/CheckoutPage";
import { LoginForm } from "../features/account/LoginForm";
import RegisterForm from "../features/account/RegisterForm";
import RequireAuth from "./RequireAuth";

export const router = createBrowserRouter([{
    path: '/',
    element: <App/>,
    children: [
        {element: <RequireAuth/>, children: [
            {path: 'checkout', element: <CheckoutPage/> },
        ]},
        {path: '', element: <HomePage /> },
        {path: 'catalog', element: <Catalog /> },
        {path: 'catalog/:id', element: <ProductDetails /> },
        {path: 'about', element: <AboutPage /> },
        {path: 'contact', element: <ContactPage/> },
        {path: 'basket', element: <BasketPage/> },
        {path: 'register', element: <RegisterForm/>},
        {path: 'login', element: <LoginForm/>},
        {path: 'server-error', element: <ServerError/>},
        {path: 'not-found', element: <NotFound/>},
        {path: '*', element: <Navigate replace to='/not-found'/>}
    ]
}])
