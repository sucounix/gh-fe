import React, { useContext, useEffect } from "react";
import notfound from "../assets/images/notfound.png";
import Header from "../private/layout/header/Header";
import NoAuthHeader from "../layout/header/NoAuthHeader";
import { UserContext } from "../contexts/UserContext";
import { Flex } from "@mantine/core";
import { BreadcrumbsContext } from "../contexts/BreadcrumbsContext";

import "./NotFound.css";

const NotFound = () => {
  const { user } = useContext(UserContext);
  const { setBreadCrumbs } = useContext(BreadcrumbsContext);

  useEffect(() => {
    setBreadCrumbs([]);
  }, []);

  return (
    <>
      {user ? <Header /> : <NoAuthHeader />}
      <div>
        <Flex mt="6%" align="center" justify={"center"}>
          <img src={notfound} alt={"notfound"} className="not__found__img" />
        </Flex>
        <div>
          <p className="not__found__title" data-testid="not__found__title">
            No Result found
          </p>
          <p className="not__found__text" data-testid="not__found__text">
            We couldn’t find the page that you looking for try to go back and
            try again
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFound;
