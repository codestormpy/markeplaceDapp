import React, {useState, useEffect} from 'react'
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useAccount, useBalance } from "wagmi"
import { useDebounce } from "use-debounce"
// import ERC20 from "../../abi/erc20InstacnceAbi.json"
import { useContractSend } from "../../hooks/useContractWrite"



const UpdateProduct = ({ id }) => {
    // to open the add product page
    const [toggele, setToggele] = useState(false);
    const [loading, setLoading] = useState("");

  
    // update items
    const [updateQuantity, setUpdateQuantity] = useState("")
    const [updatePrice, setUpdatePrice] = useState("")

    // debounce the value of the form to be added
    const [debouncedQuantity] = useDebounce(updateQuantity, 500);
    const [debouncedPrice] = useDebounce(updatePrice, 500);

    const isFormFilled = updateQuantity && updatePrice

    // clear inout when the input is filled
    const clearInPut = () => {
        setUpdateQuantity("");
        setUpdatePrice("");
    }

    // convert product input price to wei
  const priceToWei = ethers.utils.parseEther(debouncedPrice.toString() || "0");
  const {writeAsync: updateProduct} = useContractSend("updateProduct", [id, debouncedQuantity, priceToWei])

  // funtion that will save the product to the marketplace
  const handleUpdateProduct = async () => {
    if(!updateProduct) {
        throw "Failed to update the product"
    }
    setLoading("Updating the product......")
    if(!isFormFilled) throw new Error("Plaese fill the updated form");
    // to make the update transaction
    const updateTx = await updateProduct();
    setLoading("Waiting for confirmation.....")
    await updateTx;

    setToggele(false);
    clearInPut();
  };
  const updateItem = async (e) => {
    e.preventDefault();

    try {
      await toast.promise(handleUpdateProduct(), {
        pending: "Updating product ......",
        success: "Product updated successfully",
        error: "Something went wrong. Try again.",
      });
      // if it catch any error
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading("");
    }
  }

  return (
    <div className={"flex flex-row w-full justify-between"}>
      <div>
        {/* Add Product Button that opens the modal */}
        <button
          type="button"
          onClick={() => setToggele(true)}
          className="inline-block ml-12 mt-6 px-6 py-2.5 bg-black text-white font-medium text-md leading-tight rounded-2xl shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter"
        >
          Update Product
        </button>

        {/* Modal */}
        {toggele && (
          <div
            className="fixed z-40 overflow-y-auto top-0 w-full left-0"
            id="modal"
          >
            {/* Form with input fields for the product, that triggers the addProduct function on submit */}
            <form onSubmit={updateItem}>
              <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-900 opacity-75" />
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                  &#8203;
                </span>
                <div
                  className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  {/* Input fields for the product */}
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <label>Update Product Price (cUSD)</label>
                    <input
                      onChange={(e) => {
                        setUpdatePrice(e.target.value);
                      }}
                      required
                      type="number"
                      className="w-full bg-gray-100 p-2 mt-2 mb-3"
                    />
                    <label>Update Product Quantity (units)</label>
                    <input
                      onChange={(e) => {
                        setUpdateQuantity(e.target.value);
                      }}
                      required
                      type="number"
                      className="w-full bg-gray-100 p-2 mt-2 mb-3"
                    />
                  </div>
                  {/* Button to close the modal */}
                  <div className="bg-gray-200 px-4 py-3 text-right">
                    <button
                      type="button"
                      className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
                      onClick={() => setToggele(false)}
                    >
                      <i className="fas fa-times"></i> Cancel
                    </button>
                    {/* Button to add the product to the marketplace */}
                    <button
                      type="submit"
                      disabled={!!loading || !isFormFilled || !updateProduct}
                      className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
                    >
                      {loading ? loading : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default UpdateProduct
