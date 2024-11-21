/* eslint-disable no-unused-vars */
import axios from "axios";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const instance = axios.create({
    baseURL: "https://fakestoreapi.com",
});

export const fakeStoreApi = createApi({
    reducerPath: 'fakeStoreApi',  // Path in Redux store
    baseQuery: fetchBaseQuery({baseUrl: 'https://fakestoreapi.com'}),
    endpoints: (builder) => ({
        getProducts : builder.query({
            query: () => '/products', // Route for fetching products
        })
    })
 })

 export const { useGetProductsQuery } = fakeStoreApi;

