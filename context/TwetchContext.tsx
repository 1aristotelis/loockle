'use client'

import { lsTest, useLocalStorage } from "@/utils/storage";
import React, { createContext, useContext, useMemo } from "react"
import { bsv } from "scrypt-ts";
//@ts-ignore
import TwetchWeb3 from '@twetch/web3';

interface TwetchContextValue {
  twetchPaymail: string;
  twetchAddress: string;
  twetchPublicKey: string;
  twetchAvatar: string;
  twetchAuthenticate: () => Promise<void>;
  twetchAuthenticated: boolean;
  twetchLogout: () => void
}

const TwetchContext = createContext<TwetchContextValue | undefined>(undefined);

const TwetchProvider = (props: { children: React.ReactNode }) => {
    const [twetchPaymail, setTwetchPaymail] = useLocalStorage(paymailStorageKey);
    //const [twetchAuthToken, setTwetchAuthToken] = useLocalStorage(tokenStorageKey);
    const [twetchPublicKey, setTwetchPublicKey] = useLocalStorage(pubkeyStorageKey)
    const twetchAvatar = useMemo(() => twetchPaymail && twetchPaymail.length > 0 ? `https://auth.twetch.app/api/v2/users/${
      twetchPaymail.split("@")[0]
    }/icon` : "", [twetchPaymail])
    const twetchAddress = useMemo(() => {
      return twetchPublicKey && twetchPublicKey.length > 0 ? new bsv.PublicKey(twetchPublicKey).toAddress().toString() : ""
    },[twetchPublicKey])
    const twetchAuthenticated = useMemo(() => (twetchPaymail && twetchPaymail.length > 0) && (twetchPublicKey && twetchPublicKey.length > 0) ,[])

    const twetchAuthenticate = async () => {
      const resp = await TwetchWeb3.connect();
      setTwetchPaymail(resp.paymail.toString());
      setTwetchPublicKey(resp.publicKey)
    }
  

    const twetchLogout = () => {
      setTwetchPaymail(undefined)
      setTwetchPublicKey(undefined)
      localStorage.removeItem(paymailStorageKey)
      localStorage.removeItem(pubkeyStorageKey)

    }
    
    const value = useMemo(() => ({
      twetchPaymail,
      twetchAddress,
      twetchPublicKey,
      twetchAvatar,
      twetchAuthenticate,
      twetchAuthenticated,
      twetchLogout
    }),[
      twetchPaymail,
      twetchAddress,
      twetchPublicKey,
      twetchAvatar,
      twetchAuthenticate,
      twetchAuthenticated,
      twetchLogout
    ])
    return (<TwetchContext.Provider value={value} {...props} />);
}

const useTwetch = () => {
    const context = useContext(TwetchContext);
    if (context === undefined) {
      throw new Error("useTwetch must be used within a TwetchProvider");
    }
    return context;
};

export { TwetchProvider, useTwetch };

//
// Utils
//

const paymailStorageKey = `Loockle__TwetchProvider_paymail`;
const pubkeyStorageKey = `Loockle__TwetchProvider_publicKey`