import TransactionDetail from '@/components/TransactionDetail'
import { getCurrentBlock } from '@/utils/whatsonchain'
import React from 'react'

const TransactionDetailPage = async ({ params }: { params: { txid: string } }) => {
    const currentBlockHeight = await getCurrentBlock()
  return (
    <div className='min-h-screen bg-base-200 flex justify-center items-center'>
        <TransactionDetail blockHeight={currentBlockHeight} txid={params.txid}/>
    </div>
  )
}

export default TransactionDetailPage