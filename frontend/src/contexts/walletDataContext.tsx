import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useContract } from "./contractContext";
import { useAccount } from "./accountContext";

export type Transfer = {
  id: string;
  amount: string;
  to: string;
  approvals: string;
  sent: boolean;
};
export type WalletDataProviderProps = {
  children: React.ReactNode;
};

export type WalletDataContextValue = {
  approvers: string[];
  isApprover: boolean;
  quorum: string | null;
  transfers: Transfer[];
  approvals: Record<string, boolean>;
  fetchTransfers: () => Promise<void>;
};

export const WalletDataContext = createContext<WalletDataContextValue>(
  {} as WalletDataContextValue
);

export const WalletDataProvider = ({
  children,
}: WalletDataProviderProps): JSX.Element => {
  const { contract, provider } = useContract();
  const { account } = useAccount();
  const [approvers, setApprovers] = useState<string[]>([]);
  const [quorum, setQuorum] = useState(null);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [approvals, setApprovals] = useState({});
  const [isApprover, setIsApprover] = useState(false);

  const checkApprover = useCallback(
    (account: string): boolean => {
      return approvers.includes(account);
    },
    [account, approvers]
  );

  const fetchTransfers = useCallback(async () => {
    const ts = await contract?.getTransfers();

    const reversed = ts.slice().reverse()
    setTransfers(reversed);
  }, [contract]);

  const fetchApprovers = useCallback(async () => {
    const a = await contract?.getApprovers();
    setApprovers(a);
  }, [contract]);

  const fetchQuorum = useCallback(async () => {
    const q = await contract?.quorum();
    setQuorum(q.toString());
  }, [contract]);

  const fetchApprovals = useCallback(
    async (address: string, transferId: string) => {
      const aps = await contract?.approvals(address, transferId);
      setApprovals((s) => ({ ...s, [transferId]: aps }));
    },
    [contract]
  );

  useEffect(() => {
    const init = async () => {
      await fetchTransfers();
      await fetchApprovers();
      await fetchQuorum();
    };

    init();
  }, [contract]);

  useEffect(() => {
    if (account) {
      const approver = checkApprover(account as string);
      setIsApprover(approver);
    }
  }, [account]);

  useEffect(() => {
    const init = async () => {
      if (account) {
        for (let i = 0; i <= transfers.length; i++) {
          if (transfers[i]) {
            await fetchApprovals(account, transfers[i].id);
          }
        }
      }
    };

    init();
  }, [account, transfers]);

  return (
    <WalletDataContext.Provider
      value={{
        approvers,
        isApprover,
        quorum,
        transfers,
        approvals,
        fetchTransfers,
      }}
    >
      {children}
    </WalletDataContext.Provider>
  );
};

export const useWalletData = () => {
  return useContext(WalletDataContext);
};
