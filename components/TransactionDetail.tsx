'use client'
import { isTxid } from '@/utils/string'
import { useRouter } from 'next/navigation'
import React from 'react'
import LockupForm from './LockupForm';
interface TransactionDetailProps {
    txid: string;
    blockHeight: number;
}
const TransactionDetail = ({ txid, blockHeight }: TransactionDetailProps) => {
    const router = useRouter()
    if(!isTxid(txid)){
        router.push('/not-found')
    }
    
  return (
    <div>
        <div className="card lg:card-side bg-base-100 shadow-xl">
            {/* <figure className='max-h-[321px] h-full'><img className='items-contain' src="https://media.ordinalswallet.com/6dd4d3c2698ea3b57ce66208f073b9849cd440c705706aea2972f1494097d8f0.png" alt="Bitmap"/></figure> */}
            <div className="card-body">
                <h2 className="card-title">Transaction Hash:</h2>
                <p className='whitespace-pre-line break-all'>{txid}</p>
                <div className="card-actions">
                    <LockupForm currentHeight={blockHeight} txid={txid}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TransactionDetail