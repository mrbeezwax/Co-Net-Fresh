import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // Store the token in localStorage
      localStorage.setItem("jwtToken", token);

      // Set the token as the default Authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch user data
      axios
        .get("http://localhost:3001/users/currentuser", {
          withCredentials: true,
        })
        .then((response) => {
          // Here you might want to update your global state with user data
          // For example, if you're using Redux:
          // dispatch(setUser(response.data));

          console.log("User data:", response.data);

          // Redirect to the Feed page
          navigate("/Feed");
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          navigate("/");
        });
    } else {
      // If there's no token, redirect to the login page
      navigate("/");
    }
  }, [navigate, location]);

  return (
    <div>
      <p>Authentication successful. Redirecting...</p>
    </div>
  );
};

export default AuthSuccess;
