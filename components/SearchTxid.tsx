'use client'
import { isTxid } from '@/utils/string'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const SearchTxid = () => {
    const router = useRouter()
    const [searchInput, setSearchInput] = useState("")
    const [error, setError] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(false)
        setSearchInput(e.target.value)

    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if(!isTxid(searchInput)){
            setError(true)
            return
        }
        router.push(`/t/${searchInput}`)
    }
  return (
    <div className='flex flex-col items-start'>
    <form onSubmit={handleSubmit} className='join'>
        <div className="tooltip join-item" data-tip="Paste any Bitcoin transaction hash here">
            <input onChange={handleChange} value={searchInput} type="text" placeholder="Search Bitcoin" className={`input input-bordered ${error ? "input-error" : "input-primary"} w-full rounded-l-full max-w-xs`} />
        </div>
        <button disabled={error} type="submit" className="btn btn-primary join-item rounded-r-full">Search</button>
    </form>
    {error && <span className='text-error'>Invalid txid!</span>}
    </div>
  )
}
  
  
export default  SearchTxid 