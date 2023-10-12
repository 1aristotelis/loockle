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
    <form onSubmit={handleSubmit} className='flex justify-center w-full max-w-3xl mx-auto'>
        <div className='flex flex-col sm:flex-row w-full sm:join'>
            <div className="tooltip w-full" data-tip="Paste any Bitcoin transaction hash here">
                <input onChange={handleChange} value={searchInput} type="text" placeholder="Search Bitcoin" className={`input input-bordered sm:join-item ${error ? "input-error" : "input-primary"} w-full sm:rounded-l-full`} />
            </div>
            <button disabled={error} type="submit" className="mt-5 sm:mt-0 mx-auto sm:mx-0 btn btn-primary sm:join-item sm:rounded-r-full">Search</button>
        </div>
        {error && <span className='text-error'>Invalid txid!</span>}
    </form>
  )
}
  
  
export default  SearchTxid 