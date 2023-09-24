import React, {useState, useEffect } from 'react'
import { IoCloseCircle } from "react-icons/io5";
import {useContractSend } from '../../hooks/useContractWrite'
import { toast } from'react-toastify'
import { useDebounce } from 'use-debounce'
import ERC20 from '../../abi/erc20InstacnceAbi.json' 

import { useAccount, useBalance} from 'wagmi'

const SetSeller = () => {
    const [toggle, setToggle] = useState(false)
    const [seller, setSeller] = useState('')
    const [loading, setLoading] = useState('')
    const [displayBalnce, setDisplayBalnce] = useState(false)

    // check if the form is fill
    const isFormFilled = seller

    // to clear the form after
    const clearForm = () => {
      setSeller('')
    }

    const [ deBounceseller ] = useDebounce(seller, 500)
    
    // write to the contract
    const { writeAsync: assignSeller } = useContractSend('assignSeller', [
      deBounceseller
    ])

    const handleAssignSeller = async () => {
      if(!assignSeller) {
        throw "Failed To Assign seller"
      }
      setLoading('Assigning......')
      if(!isFormFilled) throw new Error("Please enter the correct seller wallet address");

      const transTx = await assignSeller();
      setLoading("Waiting for confirmation....")
      await transTx

      setToggle(false)
      clearForm()
      
    }

    const addseller = async (e) => {
      e.preventDefault();
      try {
        await toast.promise(handleAssignSeller(), {
          pending: "Assigning seller",
          success: "Successfully, You are now a seller",
          error:"Try again."
        })
      } catch (e) {
        console.log({e});
        toast.error(e?.message || "Something went wrong. Try Again later. Contact for help")
      }
    }
    
    const { address, isConnected} = useAccount();
    const { data: cUSDBalance} = useBalance({
        address,
        token: ERC20.address
    });
    
    useEffect(() => {
        if(isConnected && cUSDBalance) {
            setDisplayBalnce(true)
            return;
        }
        setDisplayBalnce(false)
    }, [cUSDBalance, isConnected])
    
  return (
    <div className=' flex rounded-xl'>
            <button
          type="button"
          onClick={() => setToggle(true)}
          className="inline-block  w-[150px] ml-4 px-6 py-2.5 bg-black text-white font-medium text-md leading-tight rounded-2xl shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter"
        >
          Become a seller
        </button>
        {toggle && (
            <div className='flex justify-center fixed left-0 top-0 z-20 items-center w-full h-full mt-6'>
               <div className=' w-[600px] rounded-2xl bg-slate-100 p-5'>
                  <h1 className=' text-[#131825] mt-5 font-bold max-md:text-white max-sm:text-white' >Your Must Be Seller Before You Can sell</h1>
                <form onSubmit={addseller}>
                  <input type="text" onChange={(e) => setSeller(e.target.value)} name="Wasteseller" id="wasteseller"  className=' mt-5 py-4 px-6 w-full rounded-full text-black border-2 border-[#EFAE07]' placeholder='Enter seller Address'/>
                  <div className=' flex justify-between mt-5'>
                  <button type='submit' className=' border-4 text-white border-[#EFAE07] bg-[#06102b] px-4 py-2 rounded-full' disabled={!!loading || !isFormFilled || !assignSeller } >
                      {loading ? loading : "Assigning seller"}
                  </button>
                  <button type='button' className='' onClick={() => setToggle(false)}><IoCloseCircle  size={30} color="#efae07"/></button>
                  </div>
                </form>
               </div>
            </div>
        )}        
    </div>
  )
}

export default SetSeller
