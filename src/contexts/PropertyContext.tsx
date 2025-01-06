import React, { createContext, useContext, useState } from "react";

interface PropertyContextProps {
  isRent: boolean;
  setIsRent: (value: boolean) => void;
}

const PropertyContext = createContext<PropertyContextProps | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRent, setIsRent] = useState(true); // true para "Aluguel", false para "Venda"

  return (
    <PropertyContext.Provider value={{ isRent, setIsRent }}>
      {children}
    </PropertyContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePropertyContext = (): PropertyContextProps => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("usePropertyContext must be used within a PropertyProvider");
  }
  return context;
};
