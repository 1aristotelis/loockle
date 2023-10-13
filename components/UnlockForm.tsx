'use client'

import { Lockup } from "@/contracts/lockup"
import { Lockup as LoadedLockup } from "@/utils/lockup"
import LocalWallet from "@/wallets/local"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { MethodCallOptions, PubKey, findSig, hash160, toByteString, toHex } from "scrypt-ts"

export default function UnlockForm(){
    const [txToUnlock, setTxToUnlock] = useState("")
    const [seedPhrase, setSeedPhrase] = useState("")
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const wallet = LocalWallet.fromPhrase({ phrase : seedPhrase })
            await wallet.signer.connect()
            const tx = await wallet.signer.connectedProvider.getTransaction(txToUnlock)
            const instance = LoadedLockup.fromTx(tx, 0)

            console.log("pkhash to unlock",instance.pkhash)
            console.log("my pkhash", hash160(PubKey(toHex(wallet.publicKey!))))

            const lockUntilHeight = Number(instance.lockUntilHeight)

            await instance.connect(wallet.signer)
            
            const { tx: callTx } = await instance.methods.redeem(
                (sigResps:any) => findSig(sigResps, wallet.publicKey!),
                PubKey(toHex(wallet.publicKey!)),
                {
                    //pubKeyOrAddrToSign: wallet.publicKey,
                    lockTime:lockUntilHeight
                } as MethodCallOptions<Lockup>
            )

            console.log('contract called: ', callTx.id);
            toast.custom(
                <div className="alert alert-success max-w-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="">You just unlocked 10₿, congrats!</span>
                    <a href={`https://whatsonchain.com/tx/${callTx.id}`} target="_blank" rel="noreferrer" className="btn btn-xs btn-ghost">View</a>
                </div>
            )
        } catch (error:any) {
            console.log(error)
            toast.custom(
                <div className="alert alert-error max-w-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error.toString()}</span>
                </div>
            )
        }
    }

    const handleChangeTxToUnlock = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTxToUnlock(e.target.value)
    }

    const handleChangeSeed = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSeedPhrase(e.target.value)
    }


    return (
        <form onSubmit={handleSubmit}>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Lock Transaction to Unlock</span>
                </label>
                <input type="text" value={txToUnlock} onChange={handleChangeTxToUnlock} placeholder="Enter a txid to unlock" className="input input-primary input-bordered w-full"/>
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Your Bitcoin wallet's seed phrase</span>
                </label>
                <textarea className="textarea textarea-primary" value={seedPhrase} onChange={handleChangeSeed} placeholder="Enter your Bitcoin wallet seed phrase"/>
            </div>
            <div className="w-full flex justify-center mt-5">
                <button type="submit" className="btn btn-primary">Unlock</button>
            </div>
        </form>
    )
}