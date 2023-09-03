import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import Link from "next/link"
import { identicontemplates } from "../helpers/index"
import {ethers } from "ethers"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi";
import { toast } from "react-toastify"
import { useContractToApprove } from "../hooks/useApprove"
import { useContractToCall } from "../hooks/useContractRead"
import { useContractSend } from "../hooks/useContractWrite";
import UpdateProduct from "../components/modals/UpdateProduct"



const Product = ({ id, setError, setLoading, clear}) => {
    const { address } = useAccount()
    // get data of product from the contract 
    const {data: readProduct } = useContractToCall("readProduct", [id], true)

    // buy function that will allow buyer to buy the product
    const { writeAsync: buyproduct } = useContractSend("buyproduct", [Number(id)]);

    // we need the product useState to manage the state of the product
    const [product, setProduct] = useState(null)
    const {writeAsync: approve} = useContractToApprove(
        product?.price?.toString() || "1"
    )
    // useConnectModal to trigger the wallet app for payment of tthe product 
    const { openConnectModal } = useConnectModal()

    // format the product data get from the database contract
    const getFormatedProduct = useCallback(() => {
        if(!readProduct) return null;
        setProduct({
            owner: readProduct[0],
            name: readProduct[1],
            image: readProduct[2],
            description: readProduct[3],
            location: readProduct[4],
            price: Number(readProduct[5]),
            sold: Number(readProduct[6]),
            quantity: Number(readProduct[7]),
            available: Boolean(readProduct[8]),
        });
    }, [readProduct])

    // make a call with useEffect when the getFormatedProduct get called 
    useEffect(() => {
      getFormatedProduct()
    }, [getFormatedProduct])

    // handle the payment purchase if the buyer wants to get a product
    const handlePayment = async () => {
        if(!approve || !buyproduct) {
            throw "Failed to purchase this product. Try a again in few minutes"
        }
        // approving the buyer of spending of the product prics for ERC20 cUSD contract
        const approveTx = await approve()
        await approveTx.wait(1);
        setLoading("Purchasing....")

        // once the spending is approved, paymentt will be made through wallet,
        const res = await buyproduct();
        // wait for the transaction to be mined
        await res.wait();
    }

    const productPayment = async () => {
        setLoading("Approving.....")
        clear();
        try {
            // if user is not connect the wallet
            if(!address && openConnectModal) {
                openConnectModal();
                return;
            }
            // if the user is connect the wallet handle the payment
            await toast.promise(
                handlePayment(), {
                    pending: "Purchasing product",
                    success: "Product Purchase Succesfully",
                    error: "Failed to make payment for the product"
                }
            )
            // if error occur 
        } catch (e) {
            console.log({ e });
            setError(e?.reason || e?.message || "Something went wrong. Try again")
        } finally {
           setLoading(null)
        }
    }
    if(!product) return null;
     // Format the price of the product from wei to cUSD otherwise the price will be way too high
  const formatPriceWei = ethers.utils.formatEther(
    product.price.toString()
  );
    
  return (
    <div className={"shadow-lg relative rounded-b-lg"}>
      <p className="group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-white xl:aspect-w-7 xl:aspect-h-8 ">
          {/* Show the number of products sold */}
          <span
            className={
              "absolute z-10 right-0 mt-4 bg-amber-400 text-black p-1 rounded-l-lg px-4"
            }
          >
            {product.sold} sold
          </span>
          {/* Show the product image */}
          <img
            src={product.image}
            alt={"image"}
            className="w-full h-80 rounded-t-md  object-cover object-center group-hover:opacity-75"
          />
          {/* Show the address of the product owner as an identicon and link to the address on the Celo Explorer */}
          <Link
            href={`https://explorer.celo.org/alfajores/address/${product.owner}`}
            className={"absolute -mt-7 ml-6 h-16 w-16 rounded-full"}
          >
            {identicontemplates(product.owner)}
          </Link>
        </div>

        <div className={"m-5"}>
          <div className={"pt-1"}>
            {/* Show the product name */}
            <p className="mt-4 text-2xl font-bold">{product.name}</p>
            <div className={"h-40 overflow-y-hidden scrollbar-hide"}>
              {/* Show the product description */}
              <h3 className="mt-4 text-sm text-gray-700">
                {product.description}
              </h3>
            </div>
          </div>

          <div>
            <div className={"flex flex-row justify-between"}>
              {/* Show the product location */}
              {/* <img src={"/location.svg"} alt="Location" className={"w-6"} /> */}
              <h3 className="pt-1 text-sm text-gray-700">{product.location}</h3>
              <h3 className="pt-1 text-sm text-gray-700">{product.quantity} Units</h3>
            </div>

            {/* Buy button that calls the purchaseProduct function on click */}
            {
              product.owner == address ? (
                <UpdateProduct id={id} />
              ) : ( product.available == true ?
                <button
                onClick={productPayment}
                className="mt-4 h-14 w-full border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-black hover:text-white"
              >
                {/* Show the product price in cUSD */}
                Buy for {formatPriceWei} cUSD
              </button> : <button
                className="mt-4 h-14 w-full border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-black hover:text-white"
              >
                {/* Show the product price in cUSD */}
                Not Available
              </button>
              )
            }
          </div>
        </div>
      </p>
    </div>
  )
}

export default Product
