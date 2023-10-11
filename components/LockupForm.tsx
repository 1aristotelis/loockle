'use client'

import { getDaysByBlocks } from '@/utils/time';
import React, { useMemo, useState } from 'react'

interface LockupFormProps {
    txid: string;
    currentHeight: number;
}

const LockupForm = ({ txid, currentHeight } : LockupFormProps) => {
    const [amount, setAmount] = useState(0)
    const [blockHeight, setBlockHeight] = useState(0)
    const timeEquivalent = useMemo(() => {
        const days = getDaysByBlocks(blockHeight)
        switch (true){
            case (days === 0): 
                return "1 day = 144 blocks"
            case (days<1):
                return "in less than one day"
            case (days < 7):
                return `in approx. ${days} day(s))`
            case (days > 7 && days < 30):
                return `in approx. ${Math.ceil(days/7)} week(s)`
            case (days > 30 && days < 356):
                return `in approx. ${Math.ceil(days/30)} month(s)`
            case (days > 356):
                return `in approx. ${Math.ceil(days/356)} year(s)`
        }
    },[blockHeight])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!(amount > 0) || !(blockHeight > 0)){
            return
        }
        const satoshis = Math.ceil(amount * 1e8)
        const lockUntilHeight = currentHeight + blockHeight

        console.log("satoshi amount", satoshis, "lock until height", lockUntilHeight)

    }

    const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: number = parseFloat(e.target.value) 
        setAmount(value)

    }

    const handleChangeDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBlockHeight(Math.ceil(parseInt(e.target.value)))
    }
  return (
    <form onSubmit={handleSubmit} className='w-full'>
        <div className='form-control'>
            <label className="label">
                <span className="label-text">Amount to lock</span>
                <span className="label-text-alt">{amount} ₿</span>
            </label>
            <input type="number" value={amount} onChange={handleChangeAmount} min={0} step="any" placeholder="Enter amount" className="input input-primary input-bordered w-full" />
        </div>
        <div className="form-control">
            <label className="label">
                <span className="label-text">Lock Duration</span>
                <span className="label-text-alt">+ {blockHeight} blocks</span>
            </label>
            <input type="number" value={blockHeight} onChange={handleChangeDuration} min={0} placeholder="Enter duration" className="input input-primary input-bordered w-full" />
            <label className="label">
                <span className="label-text-alt">Current height: {currentHeight}</span>
                <span className="label-text-alt">{timeEquivalent}</span>
            </label>
        </div>
        <div className='w-full flex justify-end'>
            <button disabled={!(amount > 0) || !(blockHeight > 0)} type='submit' className="btn btn-primary mt-5">Lock It Up!</button>
        </div>
    </form>
  )
}

export default LockupForm