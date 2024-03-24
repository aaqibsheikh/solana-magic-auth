import { useCallback, useEffect, useState } from "react";
import { LoginProps } from "../utils/types";
import { logout } from "../utils/common";
import { useMagic } from "./MagicProvider";
import Spinner from "../components/ui/Spinner";
import { getNetworkName } from "../utils/network";
import RefreshIcon from "../assets/icons/refresh.svg";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { checkIn } from "../solana";
import showToast from "../utils/showToast";

const UserInfo = ({ token, setToken }: LoginProps) => {
  const { magic, connection } = useMagic();

  const [balance, setBalance] = useState("...");
  const [copied, setCopied] = useState("Copy");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setCheckInStatus] = useState("");

  const [publicAddress, setPublicAddress] = useState(
    localStorage.getItem("user")
  );

  useEffect(() => {
    const checkLoginandGetBalance = async () => {
      const isLoggedIn = await magic?.user.isLoggedIn();
      if (isLoggedIn) {
        try {
          const metadata = await magic?.user.getInfo();
          if (metadata) {
            localStorage.setItem("user", metadata?.publicAddress!);
            setPublicAddress(metadata?.publicAddress!);
            setEmail(metadata?.email!);
          }
        } catch (e) {
          console.log("error in fetching address: " + e);
        }
      }
    };
    setTimeout(() => checkLoginandGetBalance(), 5000);
  }, []);

  const getBalance = useCallback(async () => {
    if (publicAddress && connection) {
      const balance = await connection.getBalance(new PublicKey(publicAddress));
      if (balance == 0) {
        setBalance("0");
      } else {
        setBalance((balance / LAMPORTS_PER_SOL).toString());
      }
      console.log("BALANCE: ", balance);
    }
  }, [connection, publicAddress]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await getBalance();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  }, [getBalance]);

  useEffect(() => {
    if (connection) {
      refresh();
    }
  }, [connection, refresh]);

  useEffect(() => {
    setBalance("...");
    console.log("magic", magic);
  }, [magic]);

  const disconnect = useCallback(async () => {
    if (magic) {
      await logout(setToken, magic);
    }
  }, [magic, setToken]);

  const copy = useCallback(() => {
    if (publicAddress && copied === "Copy") {
      setCopied("Copied!");
      navigator.clipboard.writeText(publicAddress);
      setTimeout(() => {
        setCopied("Copy");
      }, 1000);
    }
  }, [copied, publicAddress]);

  const checkInUserHandler = async () => {
    const publicAddress = localStorage.getItem("user");
    if (publicAddress) {
      const checkInnStatus = await checkIn(publicAddress);
      setCheckInStatus(checkInnStatus);
    } else {
      showToast({ message: "Public address not found", type: "error" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-medium text-lg">
          Connected to {getNetworkName()}
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={copy}
            type="button"
            className="rounded-md cursor-default bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm  flex items-center space-x-3"
          >
            <p className="cursor-pointer">
              {publicAddress?.length == 0
                ? "Fetching address.."
                : publicAddress?.substring(0, 10) +
                  "..." +
                  publicAddress?.substring(33, 43)}
            </p>{" "}
            &nbsp;&nbsp; | <p>{balance} SOL</p>
            {isRefreshing ? (
              <Spinner />
            ) : (
              <img
                className="cursor-pointer"
                onClick={refresh}
                src={RefreshIcon}
              />
            )}
          </button>

          <button
            onClick={disconnect}
            type="button"
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Disconnect
          </button>
        </div>
      </div>
      <div className="mt-10">
        <div className="flex flex-col space-y-5">
          <p className="font-medium text-base">
            <span className="font-bold text-base">Email:</span> {" "}
            {email?.length == 0 ? "Fetching email.." : email}

          </p>
          <p className="font-medium text-base">
            <span className="font-bold text-base">Wallet:</span> {" "}
            {publicAddress?.length == 0 ? "Fetching address.." : publicAddress}
          </p>
        </div>
        <div className="flex flex-col mt-5 space-y-2">
          <p className="">
            <span className="font-bold text-base">CheckIn Status:</span>{" "}
            {status ? status : "Null"}
          </p>
          <button
            onClick={checkInUserHandler}
            type="button"
            className="rounded-md w-[120px] bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Check-in
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
