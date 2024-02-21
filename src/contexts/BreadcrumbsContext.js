import React, { createContext, useState } from "react";

const BreadcrumbsContext = createContext({});

function BreadcrumbsProvider({ children }) {
  const [breadCrumbs, setBreadCrumbs] = useState([]);

  return (
    <BreadcrumbsContext.Provider
      value={{
        breadCrumbs,
        setBreadCrumbs,
      }}
    >
      {children}
    </BreadcrumbsContext.Provider>
  );
}

export { BreadcrumbsProvider, BreadcrumbsContext };
