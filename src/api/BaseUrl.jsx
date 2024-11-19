import axios from "axios";

const instance = axios.create({
    baseURL: "https://fakestoreapi.com",
});

export const getProducts = () => {
   return instance.get("/products");
}
