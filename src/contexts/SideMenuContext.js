import React, { createContext, useState } from "react";

const SideMenuContext = createContext({});

function SideMenuProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SideMenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </SideMenuContext.Provider>
  );
}

export { SideMenuProvider, SideMenuContext };
