'use client'

import React, { useState } from "react"

export default function UnlockForm(){
    const [txToUnlock, setTxToUnlock] = useState("")
    const [seedPhrase, setSeedPhrase] = useState("")
    
    const handleSubmit = (e: React.FormEvent) => {

    }

    const handleChangeTxToUnlock = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTxToUnlock(e.target.value)
    }


    return (
        <form>
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
                <textarea className="textarea textarea-primary" placeholder="Enter your Bitcoin wallet seed phrase"/>
            </div>
            <div className="w-full flex justify-center mt-5">
                <button className="btn btn-primary">Unlock</button>
            </div>
        </form>
    )
}