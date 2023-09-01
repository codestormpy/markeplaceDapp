import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount, useBalance } from "wagmi";
// to display the notification
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { useContractSend } from "../../hooks/useContractWrite";
import ERC20 from "../../abi/erc20InstacnceAbi.json";

const AddProducts = () => {
  // to open the add product page
  const [toggele, setToggele] = useState(false);

  // items to add for creat a product on the page
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  // debounce the value of the form to be added
  const [debounceName] = useDebounce(productName, 500);
  const [debounceImage] = useDebounce(productImage, 500);
  const [debouncedDescription] = useDebounce(description, 500);
  const [debouncedLocation] = useDebounce(location, 500);
  const [debouncedPrice] = useDebounce(price, 500);
  const [debouncedQuantity] = useDebounce(quantity, 500);

  // message response state
  const [loading, setLoading] = useState("");
  const [displayBalance, setDisplayBalance] = useState(false);

  // check if the form is filled complete
  const iscomplete =
    productName && productImage && description && location && price && quantity;

  const clearFormInput = () => {
    setProductName("");
    setProductImage("");
    setDescription("");
    setLocation("");
    setPrice("");
    setQuantity("");
  };

  // convert product input price to wei
  const priceToWei = ethers.utils.parseEther(debouncedPrice.toString() || "0");

  const { writeAsync: uploadProduct } = useContractSend("writeProduct", [
    debounceName,
    debounceImage,
    debouncedDescription,
    debouncedLocation,
    priceToWei,
    debouncedQuantity,
  ]);

  // funtion that will save the product to the marketplace
  const handleCreateProduct = async () => {
    if (!uploadProduct) {
      throw "Failed to upload th product";
    }
    setLoading("Uploading.......");
    if (!iscomplete) throw new Error("Please fill the required inputs");

    // to make the upload transaction
    const uploadTx = await uploadProduct();
    setLoading("Waiting for confirmation....");
    await uploadTx;

    setToggele(false);
    clearFormInput();
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      await toast.promise(handleCreateProduct(), {
        pending: "Uploading product ......",
        success: "Product uploaded successfully",
        error: "Something went wrong. Try again.",
      });
      // if it catch any error
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading("");
    }
  };

  // get user's address and balance
  const { address, isConnected } = useAccount();
  const { data: cUSDBalance } = useBalance({
    address,
    token: ERC20.address,
  });

  // if the user is connected and has a balance, display the balance
  useEffect(() => {
    if (isConnected && cUSDBalance) {
      setDisplayBalance(true);
      return;
    }
    setDisplayBalance(false);
    return;
  }, [cUSDBalance, isConnected]);

  return (
    <div className={"flex flex-row w-full justify-between"}>
      <div>
        {/* Add Product Button that opens the modal */}
        <button
          type="button"
          onClick={() => setToggele(true)}
          className="inline-block ml-4 px-6 py-2.5 bg-black text-white font-medium text-md leading-tight rounded-2xl shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter"
        >
          Add Product
        </button>

        {/* Modal */}
        {toggele && (
          <div
            className="fixed z-40 overflow-y-auto top-0 w-full left-0"
            id="modal"
          >
            {/* Form with input fields for the product, that triggers the addProduct function on submit */}
            <form onSubmit={addProduct}>
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
                    <label>Product Name</label>
                    <input
                      onChange={(e) => {
                        setProductName(e.target.value);
                      }}
                      required
                      type="text"
                      className="w-full bg-gray-100 p-2 mt-2 mb-3"
                    />

                    <label>Product Image (URL)</label>
                    <input
                      onChange={(e) => {
                        setProductImage(e.target.value);
                      }}
                      required
                      type="text"
                      className="w-full bg-gray-100 p-2 mt-2 mb-3"
                    />

                    <label>Product Description</label>
                    <input
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      required
                      type="text"
                      className="w-full bg-gray-100 p-2 mt-2 mb-3"
                    />

                    <label>Product Location</label>
                    <input
                      onChange={(e) => {
                        setLocation(e.target.value);
                      }}
                      required
                      type="text"
                      className="w-full bg-gray-100 p-2 mt-2 mb-3"
                    />

                    <label>Product Price (cUSD)</label>
                    <input
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                      required
                      type="number"
                      className="w-full bg-gray-100 p-2 mt-2 mb-3"
                    />
                    <label>Product Quantity (units)</label>
                    <input
                      onChange={(e) => {
                        setQuantity(e.target.value);
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
                      disabled={!!loading || !iscomplete || !uploadProduct}
                      className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
                    >
                      {loading ? loading : "Upload"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Display the user's cUSD balance */}
      {displayBalance && (
        <span
          className="inline-block text-dark ml-4 px-6 py-2.5 font-medium text-md leading-tight rounded-2xl shadow-none "
          data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter"
        >
          Balance: {Number(cUSDBalance?.formatted || 0).toFixed(2)} cUSD
        </span>
      )}
    </div>
  );
};

export default AddProducts;
