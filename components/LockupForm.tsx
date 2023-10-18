'use client'

import { useBitcoin } from '@/context/BitcoinContext';
import { useRelayX } from '@/context/RelayXContext';
import { buildLockTransaction, buildLockupScript } from '@/utils/lockup';
import { getDaysByBlocks } from '@/utils/time';
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast';
import NotifySuccess from './NotifySuccess';
import NotifyError from './NotifyError';

interface LockupFormProps {
    txid: string;
    currentHeight: number;
}

const LockupForm = ({ txid, currentHeight } : LockupFormProps) => {
    const { authenticated } = useBitcoin()
    const { relayXAddress, relayXSendTransaction } = useRelayX()
    const [inputAmount, setInputAmount] = useState("")
    const amount = useMemo(() =>  parseFloat(inputAmount) || 0,[inputAmount])
    const [blockHeight, setBlockHeight] = useState(0)
    const [lockToAddress, setLockToAddress] = useState(relayXAddress || "")

    useEffect(() => {
        relayXAddress && relayXAddress.length > 0 && setLockToAddress(relayXAddress)
    },[relayXAddress])
    
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!authenticated){
            //@ts-ignore
            document.getElementById('wallet_selector')!.showModal()
        }
        if (!(amount > 0) || !(blockHeight > 0)){
            return
        }
        const satoshis = Math.ceil(amount * 1e8)
        const lockUntilHeight = currentHeight + blockHeight

        
        try {
            console.log("lock.tx.params", { likeTxid: txid, amount: satoshis, blockHeight: lockUntilHeight, address: lockToAddress })
            const tx = buildLockTransaction({ likeTxid: txid, amount: satoshis, blockHeight: lockUntilHeight, address: lockToAddress })
            console.log("lock.tx", tx)
            /* //@ts-ignore
            const relayXResponse: RelayBroadcastResponse = await window.relayone.send({
    
                outputs: outputs.map((output: bsv.Transaction.Output) => ({
                    to: output.script.toASM(),
                    amount: Number(output.satoshis) * 1e-8,
                    currency: 'BSV',
                })),
            })
            console.log(relayXResponse) */

            const relayXResponse = await relayXSendTransaction(tx)
            console.log(relayXResponse)
            toast.custom(<NotifySuccess message={`You just locked ${amount}₿ until block #${lockUntilHeight}!`} txid={relayXResponse!.txid}/>)
        } catch (error:any) {
            console.error(error)
            toast.custom(<NotifyError message={error.toString()} />)
        }

    }

    const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value
        const regex = /^\d+(\.\d*)?$/
        if(regex.test(value) || value.length < 1){

            setInputAmount(value)
        }

    }

    const handleChangeDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBlockHeight(Math.ceil(parseInt(e.target.value)))
    }

    const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLockToAddress(e.target.value)
    }
  return (
    <form onSubmit={handleSubmit} className='w-full'>
        <div className='form-control'>
            <label className="label">
                <span className="label-text">Amount to lock</span>
                <span className="label-text-alt">{amount} ₿</span>
            </label>
            <input type="text" inputMode='decimal' value={inputAmount} onChange={handleChangeAmount} placeholder="Enter amount" className="input input-primary input-bordered w-full" />
        </div>
        <div className="form-control">
            <label className="label">
                <span className="label-text">Lock Duration</span>
                <span className="label-text-alt">+ {blockHeight} blocks</span>
            </label>
            <input type="number" value={blockHeight} onChange={handleChangeDuration} min={0} step={1} placeholder="Enter duration" className="input input-primary input-bordered w-full" />
            <label className="label">
                <span className="label-text-alt">Current height: {currentHeight}</span>
                <span className="label-text-alt">{timeEquivalent}</span>
            </label>
        </div>
        <div className='form-control'>
            <label className="label">
                <span className="label-text">Unlock Address</span>
            </label>
            <input type="text" value={lockToAddress} onChange={handleChangeAddress} placeholder="Enter Bitcoin address" className="input input-primary input-bordered w-full" />
        </div>
        <div className="alert alert-warning mt-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>This website is experimental, Lock at your own risk</span>
        </div>
        <div className='w-full flex justify-end mt-5'>
            <button disabled={!(amount > 0) || !(blockHeight > 0)} type='submit' className="btn btn-primary">Lock It Up!</button>
            {/* <button disabled={true} type='submit' className="btn btn-primary">Lock It Up!</button> */}
        </div>
    </form>
  )
}

export default LockupForm

