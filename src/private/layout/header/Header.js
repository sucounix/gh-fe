import React, { useEffect, useState, useContext } from "react";
import femtologo from "../../../assets/images/femto-logo.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import { useViewportSize } from "@mantine/hooks";
import {
  Container,
  Grid,
  Flex,
  Space,
  Divider,
  Menu,
  Burger,
  MediaQuery,
  Drawer,
  CloseButton,
  useMantineTheme,
  NavLink,
  Box,
  Popover,
} from "@mantine/core";
import { BreadcrumbsContext } from "../../../contexts/BreadcrumbsContext";
import { defaultMenuItems } from "../navigationItems";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";
import "./style/Header.scss";

const Header = () => {
  // if {ShowBurgerBtn} is true will show the menu button
  // else will render the normal header (desktop) and (tablet > 967px)
  const [showBurgerButton, setShowBurgerBtn] = useState(false);
  const [menuChoiceOpened, setMenuChoiceOpened] = useState(false);
  // if {opened} is true will open the mobile menu
  const [opened, setOpened] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const { user, logoutUser } = useContext(UserContext);
  const { isAllowedToAddNewCompany } = useContext(SubscriptionContext);
  const { width } = useViewportSize();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const params = useParams();
  const { breadCrumbs } = useContext(BreadcrumbsContext);
  const { companies, selectedCompany, setSelectedCompany } =
    useContext(CompaniesContext);

  useEffect(() => {
    setMenuItems(
      defaultMenuItems(
        selectedCompany ? selectedCompany.uuid : params?.companyId
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.companyId, selectedCompany]);

  useEffect(() => {
    setShowBurgerBtn(width <= 967);
  }, [width]);

  const handleNavigate = (link) => {
    setOpened(false);
    navigate(link);
  };

  return (
    <Container fluid className="Auth_header" data-testid="header_container">
      <Grid columns={12} className="h__100">
        <Grid.Col span={6} sm={6} md={3} lg={4}>
          <Flex align="center" h="100%">
            <Link to="/" style={{ cursor: "pointer" }}>
              <img
                src={femtologo}
                alt="femtologo"
                data-testid="femto_logo"
                className="femto_logo"
                width={100}
              />
            </Link>
            {breadCrumbs.length > 0 && (
              <div
                style={{
                  marginLeft: "20px",
                  display: "flex",
                  alignItems: "center  ",
                }}
              >
                {breadCrumbs.map((pathItem, pathItemIndex) => {
                  return (
                    <>
                      <span
                        className="breadcrumbs"
                        data-testid={`breadcrumps_${pathItemIndex}`}
                        key={`path_${pathItemIndex}`}
                        style={{
                          marginLeft: pathItemIndex === 0 && "15px",
                          fontWeight:
                            pathItemIndex === breadCrumbs.length - 1
                              ? "600"
                              : "400",
                        }}
                      >
                        {pathItem.title}
                      </span>
                      {pathItemIndex != breadCrumbs.length - 1 && (
                        <span className="breadcrumbs__arrow">
                          <i class="fa-regular fa-arrow-right"></i>
                        </span>
                      )}
                    </>
                  );
                })}
              </div>
            )}
          </Flex>
        </Grid.Col>
        <Grid.Col span={6} sm={6} md={9} lg={8}>
          <Flex justify="flex-end" align="center" h="100%">
            {showBurgerButton ? (
              <Burger
                data-testid="burger_menu"
                className="menu__bars"
                opened={opened}
                color={"white"}
                onClick={() => setOpened((o) => !o)}
              />
            ) : (
              <Flex align="center">
                {!["/", "/upload/excel", "/quickbooks/callback"].includes(
                  window.location.pathname
                ) && (
                  <>
                    {companies.length > 0 && (
                      <>
                        <div className="company__name__header">
                          <span className="company__name__header__title">
                            Company Name
                          </span>

                          <Popover
                            width={230}
                            position="bottom"
                            withArrow
                            shadow="md"
                            radius={"md"}
                            closeOnClickOutside
                            onClose={() => {
                              setMenuChoiceOpened(false);
                            }}
                            opened={menuChoiceOpened}
                          >
                            <Popover.Target>
                              <div
                                onClick={() => {
                                  setMenuChoiceOpened(!menuChoiceOpened);
                                }}
                                data-testid="selected_company_name"
                              >
                                <span className="company__name__header__value">
                                  {selectedCompany && selectedCompany.name}
                                </span>
                                <i
                                  class="fa-solid fa-chevron-down"
                                  style={{
                                    marginInlineStart: "0.5rem",
                                    color: "white",
                                  }}
                                ></i>
                              </div>
                            </Popover.Target>

                            <Popover.Dropdown p={0}>
                              <div data-testid="selected_companies_list">
                                <div className="company__choice__header">
                                  Company List
                                </div>
                                <div className="company__choice__options">
                                  {companies.length > 0 &&
                                    companies
                                      .filter((company) => {
                                        return company.is_enabled;
                                      })
                                      .map((company) => {
                                        return (
                                          <div
                                            onClick={() => {
                                              setSelectedCompany(company);
                                              setMenuChoiceOpened(false);
                                            }}
                                            key={company.uuid}
                                            data-testid={`selected_company_${company.uuid}`}
                                          >
                                            <span
                                              className={
                                                selectedCompany &&
                                                company.name ===
                                                  selectedCompany.name
                                                  ? "company__choice__option company__choice__option__selected"
                                                  : "company__choice__option"
                                              }
                                            >
                                              {company.name}
                                            </span>
                                          </div>
                                        );
                                      })}
                                </div>
                                <Link
                                  to="/upload/excel"
                                  disabled={
                                    !isAllowedToAddNewCompany(
                                      null,
                                      companies,
                                      false
                                    )
                                  }
                                  data-testid="add_new_company_link"
                                  onClick={(event) => {
                                    setMenuChoiceOpened(false);
                                    isAllowedToAddNewCompany(event, companies);
                                  }}
                                >
                                  <div className="company__choice__footer">
                                    <span>
                                      <i className="fa fa-add"></i>
                                    </span>
                                    <span>Add a Company</span>
                                  </div>
                                </Link>
                              </div>
                            </Popover.Dropdown>
                          </Popover>
                        </div>

                        <Divider
                          orientation="vertical"
                          style={{ padding: "0 1rem" }}
                        />
                      </>
                    )}
                  </>
                )}

                <div className="help__center__div">
                  <i className="fa question fa-question-circle"></i>
                  <Link to="/help-center/faq" data-testid="help_center_link">
                    <span
                      className="help__center"
                      data-testid="help_center_desktop"
                    >
                      Help Center
                    </span>
                  </Link>
                </div>

                <Space w="lg" />

                <Flex justify="center" align="center">
                  <i className="fas fa-user-circle user__icon"></i>
                  <div className="info__div">
                    {user && (
                      <p className="user__name" data-testid="user_name_desktop">
                        Hello {user.name}
                      </p>
                    )}
                    <Flex justify="center" align="center">
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <h2
                            data-testid="account_settings_desktop"
                            className="account__settings"
                          >
                            Account & settings
                          </h2>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item style={{ padding: "0" }}>
                            <Link
                              to="/organisation-settings/company-profile"
                              className="settings__desktop__link"
                              data-testid="organization_settings_link"
                            >
                              <p className=" text__span settings__desktop">
                                <span>
                                  <i class="fa-solid fa-screwdriver-wrench"></i>
                                </span>
                                <span
                                  className="text__span__settings"
                                  data-testid="settings_desktop"
                                >
                                  Organisation Settings
                                </span>
                              </p>
                            </Link>
                          </Menu.Item>
                          <Menu.Item onClick={logoutUser}>
                            <p className="logout__desktop">
                              <i className="fas fa-right-from-bracket logoutIcon"></i>
                              <span
                                className="text__span"
                                data-testid="logout_desktop"
                              >
                                Logout
                              </span>
                            </p>
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                      <i className="fas fa-angle-down arrow"></i>
                    </Flex>
                  </div>
                </Flex>
              </Flex>
            )}
          </Flex>
        </Grid.Col>
      </Grid>
      {/* mobile menu */}
      <MediaQuery query="(min-width: 967px)" className="header__media__query">
        <Drawer
          overlayColor={theme.colors.gray[10]}
          opened={opened}
          onClose={() => setOpened(false)}
          overlayOpacity={0.55}
          overlayBlur={3}
          position="right"
          size={width <= 810 && "75%"}
          className="mobile__drawer"
        >
          <div className="sideMenue__screen" data-testid="sideMenue__screen">
            <div className="sideMenu_mobile" data-testid="sideMenu_mobile">
              <Flex align={"center"} justify="space-between">
                <Flex align="center" className="user__info">
                  <i className="fas fa-circle-user user__icon"></i>
                  {user && (
                    <p className="user__name" data-testid="user_name_mobile">
                      Hello {user.name}
                    </p>
                  )}
                </Flex>
                <CloseButton
                  aria-label="Close modal"
                  size={"lg"}
                  className="close__btn"
                  data-testid="close_menu_btn_mobile"
                  onClick={() => setOpened(false)}
                />
              </Flex>
              <div className="list__items">
                <Divider size="lg" className="mobiledivider" />
                {selectedCompany?.uuid && (
                  <Box className="nav__box" style={{ width: "100%" }}>
                    {menuItems.map((item, index) => {
                      return (
                        <>
                          <NavLink
                            key={index}
                            icon={item.icon}
                            label={item.label}
                          >
                            {item?.children?.map((child, index) => {
                              return (
                                <NavLink
                                  key={index}
                                  icon={child.icon}
                                  label={child.label}
                                  onClick={() => {
                                    handleNavigate(child.url);
                                  }}
                                  data-testid={`mobile__menu__link_${child.label}`}
                                />
                              );
                            })}
                          </NavLink>
                          <Divider size="lg" className="mobiledivider" />
                        </>
                      );
                    })}
                  </Box>
                )}
              </div>
              <Divider size="lg" className="mobiledivider" />
              <div className=" settings">
                <Link
                  to="/organisation-settings/company-profile"
                  onClick={() => setOpened(false)}
                  data-testid="organization_settings_link_mobile"
                >
                  <p>
                    <i class="fa-solid fa-screwdriver-wrench cogIcon"></i>

                    <span
                      className="text__span"
                      data-testid="account_settings_mobile"
                    >
                      Organisation Settings
                    </span>
                  </p>
                </Link>
                <Link
                  to="/help-center/faq"
                  data-testid="help_center_mobile_link"
                  onClick={() => setOpened(false)}
                >
                  <i className="fas question fa-question-circle"></i>
                  <span className="text__span" data-testid="help_center_mobile">
                    Help Center
                  </span>
                </Link>
              </div>
              <Divider size="lg" className="mobiledivider" />
              <div className=" logout">
                <p onClick={logoutUser}>
                  <i className="fas fa-right-from-bracket logoutIcon "></i>
                  <span className="text__span" data-testid="logout_mobile">
                    Logout
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Drawer>
      </MediaQuery>
    </Container>
  );
};
export default Header;
