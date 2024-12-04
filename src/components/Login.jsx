import { useState } from "react";
import {useNavigate} from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin' && password === 'nikunj') {
        // For admin login
        localStorage.setItem('authToken', 'admin_token');
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
    }
    else if(username && password ){
        // For regular user login
        localStorage.setItem('authToken', 'user_token');
        localStorage.setItem('isAdmin', 'false');
        navigate("/");
    }
  }

  return (
    <div className="container mx-auto sm:px-6 lg:px-8 py-8 bg-gray-50 flex justify-center items-center h-screen">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-4xl font-semibold  text-gray-800 mb-6 text-center">Login</h2>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
               onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Login
          </button>
        </div>
    </div>
  );
};

export default Login;
