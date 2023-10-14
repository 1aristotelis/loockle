'use client'

import { Lockup } from "@/contracts/lockup"
import { Lockup as LoadedLockup } from "@/utils/lockup"
import LocalWallet from "@/wallets/local"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { MethodCallOptions, PubKey, findSig, hash160, toByteString, toHex } from "scrypt-ts"
import NotifySuccess from "./NotifySuccess"
import NotifyError from "./NotifyError"

export default function UnlockForm(){
    const [txToUnlock, setTxToUnlock] = useState("")
    const [seedPhrase, setSeedPhrase] = useState("")
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const wallet = LocalWallet.fromPhrase({ phrase : seedPhrase })
            await wallet.signer.connect()
            const signingPubkey = await wallet.signer.getDefaultPubKey();
            const tx = await wallet.signer.connectedProvider.getTransaction(txToUnlock)
            const instance = LoadedLockup.fromTx(tx, 0)

            console.log("pkhash to unlock",instance.pkhash)
            console.log("my pkhash", hash160(PubKey(signingPubkey.toString())))

            const lockUntilHeight = Number(instance.lockUntilHeight)

            await instance.connect(wallet.signer)
            
            const { tx: callTx } = await instance.methods.redeem(
                (sigResps:any) => findSig(sigResps, signingPubkey),
                PubKey(signingPubkey.toString()),
                {
                    //pubKeyOrAddrToSign: wallet.publicKey,
                    lockTime:lockUntilHeight
                } as MethodCallOptions<Lockup>
            )

            console.log('contract called: ', callTx.id);
            toast.custom(
                <NotifySuccess message={`You just unlocked 10₿, congrats!`} txid={callTx.id} />
            )
        } catch (error:any) {
            console.log(error)
            toast.custom(
                <NotifyError message={error.toString()}/>
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