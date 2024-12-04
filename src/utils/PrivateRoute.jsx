/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, isAdmin, ...rest }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const isUserAdmin = localStorage.getItem("isAdmin") === "true";

    if (!authToken) {
      navigate("/login");
    } else if (isAdmin && !isUserAdmin) {
      // If admin route but user is not admin, redirect to home
      navigate("/");
    } else {
      // User is authenticated and has correct permissions
      setIsAuthenticated(true);
    }
  }, [navigate, isAdmin]);

  // Only render the component if authenticated
  return isAuthenticated ? <Component {...rest} /> : null;
};

export default PrivateRoute;
