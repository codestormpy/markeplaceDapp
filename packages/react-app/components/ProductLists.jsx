import React, {useState} from 'react'
import { useContractToCall } from "../hooks/useContractRead"
import Product from './Product'


const ProductLists = () => {
    const { data } = useContractToCall("getProductsLength", [], true)

    const productlenght = data ? Number(data.toString()) : 0;

    // Error state
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState("")

    // clear all the errors
    const clear = () => {
        setError("");
        setSuccess("");
        setLoading("");
      }
    // function to return all the products
    const getAllproduct = () => {
        // if there is no product return null 
        if(!productlenght) return null;
        const products = [];
        // we loop through to display all the products
        for(let i =0; i < productlenght; i++) {
            products.push(
                <Product 
                key={i}
                id={i}
                />);                
        }
        return products
    }

  return (
    <div>
      {/* If there is an alert, display it */}
      {/* {error && <ErrorAlert message={error} clear={clear} />}
      {success && <SuccessAlert message={success} />}
      {loading && <LoadingAlert message={loading} />} */}
      {/* Display the products */}
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {/* Loop through the products and return the Product component */}
          {getAllproduct()}
        </div>
      </div>
    </div>
  )
}

export default ProductLists