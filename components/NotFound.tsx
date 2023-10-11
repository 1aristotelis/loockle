'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const NotFound = () => {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    router.push("/")
  }
  return (
    <div className="max-w-md">
        <h1 className="text-5xl font-bold text-error">Not found</h1>
        <p className="py-6 text-error-content">The content you are looking for is not on Bitcoin.</p>
        <button onClick={handleClick} className="btn btn-neutral">Search Again</button>
    </div>
  )
}

export default NotFound