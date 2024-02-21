import React from "react";
import { Link } from "react-router-dom";
import "./style/Submenu.scss";

function Submenu({ activeTab, setActiveTab, title, links }) {
  return (
    <div className="submenu__routes" data-testid="submenu">
      <p className="routes__title">{title}</p>
      {links &&
        links.map((link, index) => (
          <Link
            data-testid={`submenu_link_${index + 1}`}
            id={`submenu_link_${index + 1}`}
            onClick={() => {
              setActiveTab(index + 1);
            }}
            to={link.to}
            className={
              activeTab === index + 1 ? "single__tab__active" : "single__tab"
            }
          >
            {link.title}
          </Link>
        ))}
    </div>
  );
}

export default Submenu;
