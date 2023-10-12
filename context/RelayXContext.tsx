'use client'

import { RelayBroadcastResponse } from "@/types";
import { getAddressByPaymail } from "@/utils/relayx";
import { lsTest, useLocalStorage } from "@/utils/storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { bsv } from "scrypt-ts";

interface RelayXContextValue {
  relayXPaymail: string;
  relayXAddress: string;
  relayXAuthToken: string;
  relayXPublicKey: string;
  relayXAvatar: string;
  relayXAuthenticate: () => Promise<void>;
  relayXAuthenticated: boolean;
  relayXLogout: () => void;
  relayXSendTransaction: (tx: bsv.Transaction) => Promise<RelayBroadcastResponse | null>;
}

const RelayContext = createContext<RelayXContextValue | undefined>(undefined);

const RelayXProvider = (props: { children: React.ReactNode }) => {
    const [relayXPaymail, setRelayXPaymail] = useLocalStorage(paymailStorageKey);
    const [relayXAuthToken, setRelayXAuthToken] = useLocalStorage(tokenStorageKey);
    const relayXAvatar = useMemo(() => relayXPaymail && relayXPaymail.length > 0 ? `https://a.relayx.com/u/${relayXPaymail}` : "", [relayXPaymail])
    const relayXPublicKey = useMemo(() => {
      if(!relayXAuthToken){
        return ""
      }
      const payloadBase64 = relayXAuthToken?.split(".")[0]; // Token structure: "payloadBase64.signature"
      const { paymail: returnedPaymail, pubkey } = JSON.parse(atob(payloadBase64));
  
      const publicKey = new bsv.PublicKey(pubkey)
      if(publicKey){
        return publicKey.toString()
      } else {
        return ""
      }
  
    },[relayXAuthToken])
    const [relayXAddress, setRelayXAddress] = useState("")
    const relayXAuthenticated = useMemo(() => relayXAuthToken && relayXAuthToken.length > 0,[relayXAuthToken])

    useEffect(() => {
      relayXPaymail && relayXPaymail.length > 0 && getAddressByPaymail(relayXPaymail).then(address => setRelayXAddress(address))
    }, [relayXPaymail])

    const relayXAuthenticate = async () => {
      if (typeof window === "undefined") {
        return
      }
      //@ts-ignore
      const relayOne = window.relayone
  
      // Test localStorage is accessible
      if (!lsTest()) {
        throw new Error("localStorage is not available");
      }
      const authToken = await relayOne.authBeta();
  
      if (authToken) {
  
        setRelayXAuthToken(authToken)
  
        const payloadBase64 = authToken.split(".")[0]; // Token structure: "payloadBase64.signature"
  
        console.log('relayx.authBeta.result', JSON.parse(atob(payloadBase64)))
  
        const { paymail: returnedPaymail, pubkey } = JSON.parse(atob(payloadBase64));
        // localStorage.setItem('paymail', returnedPaymail);
        setRelayXPaymail(returnedPaymail);
        console.log('pubkey', new bsv.PublicKey(pubkey))
        
  
      } else {
        throw new Error(
          "If you are in private browsing mode try again in a normal browser window. (Relay requires localStorage)"
        );
      }
    }

    const relayXSendTransaction = async (tx: bsv.Transaction): Promise<RelayBroadcastResponse | null> => {
      if (typeof window === "undefined") {
        throw new Error ("RelayX not yet Loaded")
      }
      //@ts-ignore
      const relayOne = window.relayone
      const outputs = tx.outputs
      try {
        const response: RelayBroadcastResponse = await relayOne.send({
    
          outputs: outputs.map((output: bsv.Transaction.Output) => ({
              to: output.script.toASM(),
              amount: Number(output.satoshis) * 1e-8,
              currency: 'BSV',
          })),
    
        })
  
        return response
        
      } catch (error) {
        throw error
      }

    }

    const relayXLogout = () => {
      setRelayXAuthToken(undefined)
      setRelayXPaymail(undefined)
      localStorage.removeItem(paymailStorageKey)
      localStorage.removeItem(tokenStorageKey)
    }
    
    const value = useMemo(() => ({
      relayXPaymail,
      relayXAddress,
      relayXAuthToken,
      relayXPublicKey,
      relayXAvatar,
      relayXAuthenticate,
      relayXAuthenticated,
      relayXSendTransaction,
      relayXLogout
    }),[
      relayXPaymail,
      relayXAddress,
      relayXAuthToken,
      relayXPublicKey,
      relayXAvatar,
      relayXAuthenticate,
      relayXAuthenticated,
      relayXSendTransaction,
      relayXLogout
    ])
    return (<RelayContext.Provider value={value} {...props} />);
}

const useRelayX = () => {
    const context = useContext(RelayContext);
    if (context === undefined) {
      throw new Error("useRelay must be used within a RelayProvider");
    }
    return context;
};

export { RelayXProvider, useRelayX };

//
// Utils
//

const paymailStorageKey = `Loockle__RelayXProvider_paymail`;
const tokenStorageKey = `Loockle__RelayXProvider_token`