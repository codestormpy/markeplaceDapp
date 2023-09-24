import SetSeller from "../components/modals/SetSeller"
import Addproducts from "../components/modals/AddProducts"
import ProductLists from "../components/ProductLists"

export default function Home() {
  return (
    <div>
      <h1 className=" text-2xl font-bold mb-4">You must become a seller before you can sell on this marketplace</h1>
      <div className="flex justify-between">
      <Addproducts />
      <SetSeller />
      </div>
      <ProductLists />
    </div>
  )
}
