import React, { useEffect, useState, useContext } from "react";
import femtologo from "../../assets/images/femto-logo.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { useViewportSize } from "@mantine/hooks";
import { Container, Grid, Flex, Space, useMantineTheme } from "@mantine/core";

import "./style/NoAuthHeader.scss";

const NoAuthHeader = () => {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="NoAuthHeader"
      data-testid="no_auth_header_container"
    >
      <Grid columns={12} className="h__100">
        <Grid.Col span={6} sm={6} md={3} lg={4} className="logo__col">
          <Flex align="center" h="100%" className="logo__div">
            <Link to="/" style={{ cursor: "pointer" }}>
              <img
                src={femtologo}
                alt="femtologo"
                data-testid="femto_logo"
                className="femto_logo"
                width={100}
              />
            </Link>
          </Flex>
        </Grid.Col>
        <Grid.Col span={6} sm={6} md={9} lg={8} className="content__col">
          <Flex justify="flex-end" align="center" h="100%">
            <i className="fas fa-user-circle user__icon"></i>
            <div
              className="signin__div"
              onClick={() => {
                navigate("/login");
              }}
            >
              <p>Sign in</p>
            </div>
          </Flex>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
export default NoAuthHeader;
