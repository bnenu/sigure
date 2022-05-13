import React, { createContext, useContext } from "react";
import { ethers } from "ethers";
import WalletArtifact from "../contracts/Wallet.json";
import contractAddress from "../contracts/contract-address.json";

export type ContractContextValue = {
  contract: Record<string, any> | null;
  provider: Record<string, any> | null;
};

export type ContractProviderProps = {
  children: React.ReactNode;
};

export const ContractContext = createContext<ContractContextValue>({
  contract: null,
  provider: null,
});

export const ContractProvider = ({ children }: ContractProviderProps) => {
  const provider = getProvider();
  const contract = new ethers.Contract(
    contractAddress.Wallet,
    WalletArtifact.abi,
    provider
  );

  return (
    <ContractContext.Provider value={{ contract, provider }}>
      {children}
    </ContractContext.Provider>
  );
};

export function useContract() {
  return useContext(ContractContext);
}

const getProvider = () => {
  let provider;

  console.info(`Deploy env ${process.env.REACT_APP_ENVIRONMENT}`);

  if (process.env.REACT_APP_ENVIRONMENT === "rinkeby") {
    provider = new ethers.providers.InfuraProvider(
      "rinkeby",
      process.env.REACT_APP_INFURA_API_KEY
    );
  } else if (process.env.REACT_APP_ENVIRONMENT === "mumbai") {
    provider = new ethers.providers.JsonRpcProvider(
      process.env.REACT_APP_MUMBAI
    );
  } else if (process.env.REACT_APP_ENVIRONMENT === "polygon") {
    provider = new ethers.providers.JsonRpcProvider(
      process.env.REACT_APP_POLYGON
    );
  } else {
    provider = new ethers.providers.JsonRpcProvider();
  }

  return provider;
};
