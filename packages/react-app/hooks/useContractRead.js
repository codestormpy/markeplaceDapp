import { useContractRead } from 'wagmi'
import MarkplaceAbi from "../abi/Marketplace.json"
import MarkplaceAddress from "../abi/Marketplace-address.json"

export const useContractToCall = (functionName, args, watch) => {
    const resp = useContractRead({
        address: MarkplaceAddress.Address,
        abi: MarkplaceAbi.abi,
        functionName: functionName,
        args,
        watch,
        onError: (err) => {
            console.log({ err })
        }

    })

    return resp
}