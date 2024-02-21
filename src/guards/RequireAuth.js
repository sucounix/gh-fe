import React from "react";
import { Auth } from "aws-amplify";
import { useEffect, useState, useContext } from "react";
import { Outlet } from "react-router";
import { UserContext } from "../contexts/UserContext";

export default function RequireAuth() {
  const [page, setPage] = useState(null);

  const { fetchUser, user, logoutUser } = useContext(UserContext);

  useEffect(() => {
    handleGetUser();
  }, []);

  const handleGetUser = async () => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      if (cognitoUser.signInUserSession.idToken.jwtToken) {
        localStorage.setItem(
          "id_token",
          cognitoUser.signInUserSession.idToken.jwtToken
        );
        if (!user) fetchUser();
        setPage(<Outlet />);
      } else {
        logoutUser();
      }
    } catch (error) {
      logoutUser();
    }
  };
  return <>{page}</>;
}
