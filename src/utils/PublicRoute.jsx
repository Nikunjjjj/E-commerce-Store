/* eslint-disable react/prop-types */
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";


const PublicRoute = ({ component: Component, ...rest }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        const loggedIn = localStorage.getItem("loggedIn");

        if(authToken && loggedIn){
            navigate('/')
        }
    }, [])
    
  return <Component {...rest}/>
}

export default PublicRoute