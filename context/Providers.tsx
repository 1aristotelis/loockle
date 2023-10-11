'use client'

import React from "react"
import { RelayXProvider } from "./RelayXContext"
import { TwetchProvider } from "./TwetchContext"
import { LocalWalletProvider } from "./LocalWalletContext"
import { BitcoinProvider } from "./BitcoinContext"

export function Providers({ children }: { children: React.ReactNode }){
    return (
        <LocalWalletProvider>
                <TwetchProvider>
                    <RelayXProvider>
                        <BitcoinProvider>
                            {children}
                        </BitcoinProvider>
                    </RelayXProvider>
                </TwetchProvider>
            </LocalWalletProvider>
    )
}