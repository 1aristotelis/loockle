"use client"

import { useBitcoin } from '@/context/BitcoinContext'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    const { avatar, authenticated, logout } = useBitcoin()
    const handleLogIn = (e:any) => {
        //@ts-ignore
        document.getElementById("wallet_selector")?.showModal()
    }
  return (
    <div className="navbar bg-base-100">
        <div className="flex-1">
            {/* <a className="btn btn-ghost normal-case text-xl">daisyUI</a> */}
        </div>
        <div className="flex-none gap-2">
            {/* <div className="form-control">
                <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
            </div> */}
            {authenticated ? <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                    <img src={avatar} />
                    </div>
                </label>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    {/* <li>
                        <a className="justify-between">
                            Profile
                            <span className="badge">New</span>
                        </a>
                    </li> */}
                    <li><Link href="/unlock">Unlock</Link></li> 
                    <li><button onClick={logout}>Logout</button></li>
                </ul>
            </div> : <button type="button" onClick={handleLogIn} className='btn btn-primary'>Log In</button>}
        </div>
    </div>
  )
}

export default Navbar