'use client'
import { createContext, useCallback, useState, useContext, useMemo, useEffect } from "react"
import { useLocalStorage } from "../utils/storage";
import { useRelayX } from "./RelayXContext";
import { useTwetch } from "./TwetchContext";
import { useLocalWallet } from "./LocalWalletContext";
import axios, { AxiosResponse } from "axios";
import React from 'react'

type BitcoinContextValue = {
    wallet: 'relayx' | 'twetch' | 'local';
    avatar: string | undefined;
    balance: number; // in sats
    paymail: string | undefined;
    setWallet: (wallet: 'relayx' | 'twetch' | 'local' | null) => void;
    authenticate: () => Promise<void>;
    authenticated: boolean;
    logout: () => void;
    exchangeRate: number;
    walletPopupOpen: boolean;
    setWalletPopupOpen: (isOpen: boolean) => void;
}

const BitcoinContext = createContext<BitcoinContextValue | undefined>(undefined)
const BitcoinProvider = (props: { children: React.ReactNode }) => {
    const [wallet, setWallet] = useLocalStorage(walletStorageKey)
    const [walletPopupOpen, setWalletPopupOpen] = useState(false);

    const [exchangeRate, setExchangeRate] = useState(0)
    const { relayXAuthenticate, relayXAuthenticated, relayXLogout, relayXAvatar, relayXPaymail } = useRelayX()
    const { twetchAuthenticate, twetchAuthenticated, twetchLogout, twetchAvatar, twetchPaymail } = useTwetch()
    const { localWalletAuthenticate, localWalletAuthenticated, localWalletLogout, localWalletAvatar, localWalletPaymail, localWalletUserName, localWallet, seedPhrase } = useLocalWallet()
    const [balance, setBalance] = useState(0)
    

    useEffect(() => {
        axios.get('https://api.whatsonchain.com/v1/bsv/main/exchangerate').then((resp:AxiosResponse) => {
            setExchangeRate(resp.data.rate.toFixed(2))
            console.log("exchange rate", resp.data.rate.toFixed(2))
        })
    },[])

    const authenticate = useCallback(async () => {
        switch (wallet){
            case 'relayx':
                await relayXAuthenticate()
                break;
            case 'twetch':
                await twetchAuthenticate()
                break;
            case 'local':
                await localWalletAuthenticate(seedPhrase)
                break
            default:
                break;
        }
    },[wallet])
    

    const avatar = useMemo(() => {
        switch (wallet){
            case 'relayx':
                return relayXAvatar
            case 'twetch':
                return twetchAvatar
            case 'local':
                return localWalletAvatar
            default:
                break;
        }
    },[wallet, relayXAvatar, twetchAvatar, localWalletAvatar])


    const paymail = useMemo(() => {
        switch (wallet){
            case 'relayx':
                return relayXPaymail
            case 'twetch':
                return twetchPaymail
            case "local": 
                return localWalletPaymail
            default:
                break;
        }
    },[wallet, relayXPaymail, twetchPaymail, localWalletPaymail])

    const authenticated = useMemo(()=> wallet === "relayx" && relayXAuthenticated || wallet === "twetch" && twetchAuthenticated || wallet === "local" && localWalletAuthenticated, [wallet, relayXAuthenticated, twetchAuthenticated, localWalletAuthenticated])

    useEffect(() => {
        if(authenticated){
            switch (wallet){
                case "relayx":
                    break;
                case "twetch":
                    break;
                case "local":
                    localWallet?.listUnspent().then((utxos) => {
                        let satoshis = utxos.map(utxo => utxo.satoshis).reduce((acc, val) => acc + val, 0)
                        console.log("bitcoin.wallet.balance", satoshis)
                        setBalance(satoshis)
                    })
                    break;
                default: 
                    break;                
            }
        }
    },[authenticated, wallet])

    const logout = () => {
        setWallet("")
        relayXLogout()
        twetchLogout()
        localWalletLogout()
        localStorage.removeItem(walletStorageKey)
    }

    const value = useMemo(
        () => ({
            avatar,
            balance,
            paymail,
            wallet,
            setWallet,
            authenticate,
            authenticated,
            logout, 
            exchangeRate,
            walletPopupOpen,
            setWalletPopupOpen
        }),
        [
            avatar,
            balance,
            wallet,
            paymail,
            setWallet,
            authenticate,
            authenticated,
            logout,
            exchangeRate,
            walletPopupOpen,
            setWalletPopupOpen
        ]
    )

    return (<BitcoinContext.Provider value={value} {...props}/>)

}

const useBitcoin = () => {
    const context = useContext(BitcoinContext);
    if (context === undefined){
        throw new Error("useBitcoin must be used within a BitcoinProvider")
    }
    return context
} 

export { BitcoinProvider, useBitcoin }

const walletStorageKey = `Loockle__BitcoinProvider_wallet`