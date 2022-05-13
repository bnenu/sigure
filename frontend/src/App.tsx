import React, { useEffect, useState } from "react";
import "./App.css";
import { ContractProvider, useContract } from "./contexts/contractContext";
import { AccountProvider } from "./contexts/accountContext";
import { WalletDataProvider } from "./contexts/walletDataContext";
import { LoadingScreen } from "./components/LoadingScreen";
import { Header } from "./components/Header";
import { ContractInfo } from "./components/ContractInfo";
import { Transfers } from "./components/Transfers";

function App() {
  return (
    <ContractProvider>
      <AccountProvider>
        <WalletDataProvider>
          <UI />
        </WalletDataProvider>
      </AccountProvider>
    </ContractProvider>
  );
}

const UI = () => {
  const { contract, provider } = useContract();

  if (!contract || !provider) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <Header />
      <main>
        <Transfers />
      </main>
    </div>
  );
};

export default App;
