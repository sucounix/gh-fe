import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router";

const UserContext = createContext({});

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(user ? false : true);
  const { setSubscriptionInfo } = useContext(SubscriptionContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("id_token") && !user) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchUser = () => {
    axios
      .get(`/auth/user/`)
      .then(async (res) => {
        let data = await res.data;
        setUser(data);
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          logoutUser();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const loginHandler = (userData, id_token) => {
    setUser(userData);
    localStorage.setItem("id_token", id_token);
  };

  const logoutUser = async () => {
    localStorage.clear();
    sessionStorage.clear();
    try {
      await Auth.signOut();
      navigate("/login");
    } catch (error) {
      navigate("/login");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loginHandler,
        logoutUser,
        fetchUser,
      }}
    >
      {!isLoading ? children : <div>Loading..</div>}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
