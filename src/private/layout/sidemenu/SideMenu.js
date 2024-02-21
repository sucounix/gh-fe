import { Box, NavLink, Tooltip } from "@mantine/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink as Linker, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./style/SideMenu.scss";
import { defaultMenuItems } from "../navigationItems";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { SideMenuContext } from "../../../contexts/SideMenuContext";
import { useViewportSize } from "@mantine/hooks";
import { TABLET_VIEW } from "../../../constant/ViewPortSizes";
import TutorialPopup from "./TutorialPopup";

function SideMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const menuRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const { width } = useViewportSize();

  const { selectedCompany } = useContext(CompaniesContext);
  const { isOpen, setIsOpen } = useContext(SideMenuContext);

  const sidemenuAnimation = {
    open: {
      width: width > TABLET_VIEW ? "15%" : "22%",
      transition: {
        ease: "linear",
        duration: 0.42,
        stiffness: 20,
      },
    },
    closed: {
      width: width > TABLET_VIEW ? "5%" : "7%",
      transition: {
        ease: "linear",
        stiffness: 20,
        duration: 0.3,
      },
    },
  };

  useEffect(() => {
    setMenuItems(
      defaultMenuItems(
        selectedCompany ? selectedCompany.uuid : params.companyId
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.companyId, selectedCompany]);

  const handleNavigate = (url) => {
    if (!selectedCompany) return "/";
    return url;
  };

  return (
    <motion.div
      animate={isOpen ? sidemenuAnimation.open : sidemenuAnimation.closed}
      ref={menuRef}
      className={
        isOpen
          ? "sidemenu__wrapper open_wrapper"
          : "sidemenu__wrapper closed_wrapper"
      }
      data-testid="side-menu-wrapper"
    >
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        data-testid="arrow-toggle"
        className={
          isOpen ? "arrow__toggle_open arrow__toggle" : "arrow__toggle"
        }
      >
        <i className="fa fa-chevrons-right arrow__toggle__icon"></i>
      </div>
      <div className="sidemenu__web">
        <div>
          {!isOpen ? (
            <div
              className="sidemenu__web__closed"
              data-testid="sidemenu__web__closed"
            >
              {menuItems.map((item, index) => {
                return (
                  <Linker
                    to={handleNavigate(item.url)}
                    style={{ color: "inherit" }}
                    key={index}
                    className={({ isActive }) => {
                      let childrenLinks = [];
                      item.children.forEach((child) => {
                        childrenLinks.push(child.url);
                      });
                      return childrenLinks.includes(window.location.pathname) ||
                        isActive
                        ? "main__category__active"
                        : "main__category__inactive";
                    }}
                  >
                    <div key={index}>
                      <div className="menu__category">
                        <span>{item.label}</span>
                      </div>
                      {!item.available ? (
                        <div
                          className={
                            window.location.pathname.includes(item.url)
                              ? "category__coming__soon category__coming__soon__active"
                              : "category__coming__soon"
                          }
                        >
                          <span>coming soon</span>
                        </div>
                      ) : null}
                      <div className="menu__category__children">
                        {item.children.map((child, index) => {
                          return (
                            <Tooltip
                              key={index}
                              label={child.label}
                              position="right"
                              transitionDuration={700}
                            >
                              <Linker
                                className={({ isActive }) =>
                                  isActive ||
                                  window.location.pathname.includes(child.url)
                                    ? "ignore__link__default menu__child__active"
                                    : "ignore__link__default"
                                }
                                to={handleNavigate(child.url)}
                              >
                                <div className={`menu__child`}>
                                  {child.icon}
                                </div>
                              </Linker>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  </Linker>
                );
              })}
              <TutorialPopup isSideMenuOpen={isOpen} />
            </div>
          ) : (
            <div
              className="sidemenu__web__opened"
              data-testid="sidemenu__web__opened"
            >
              <Box className="sidemenu_content_tabs">
                {menuItems.map((item, index) => {
                  return (
                    <NavLink
                      key={index}
                      label={item.label}
                      icon={item.icon}
                      childrenOffset={28}
                      variant={item.variant}
                      color={item.color}
                      noWrap
                      data-active={
                        item.url === window.location.pathname ? true : false
                      }
                      rightSection={
                        item.available ? null : (
                          <div className="menu__coming__soon">coming soon</div>
                        )
                      }
                      disableRightSectionRotation={!item.available}
                      onClick={item.available ? null : () => navigate(item.url)}
                      data-testid={`sidemenu_item_${index}`}
                      /* 
                      If the current url matches the url of any of the children,
                      then the parent menu item should be opened by default
                    */
                      defaultOpened={
                        item.children.filter((child) => {
                          return child.url === window.location.pathname;
                        }).length > 0
                      }
                    >
                      {item.children &&
                        item?.children?.map((child, index) => {
                          return (
                            <Linker
                              key={index}
                              to={handleNavigate(child.url)}
                              className={({ isActive }) =>
                                isActive
                                  ? "ignore__link__default menu__opened__active"
                                  : "ignore__link__default"
                              }
                            >
                              <NavLink
                                key={index}
                                icon={child.icon}
                                label={child.label}
                                variant={child.variant}
                                color={child.color}
                                url={handleNavigate(child.url)}
                              />
                            </Linker>
                          );
                        })}
                    </NavLink>
                  );
                })}
              </Box>
              <TutorialPopup isSideMenuOpen={isOpen} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default SideMenu;
