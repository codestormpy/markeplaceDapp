import { useContractWrite, usePrepareContractWrite, } from 'wagmi';
import MarkplaceAbi from "../abi/Marketplace.json"
import MarkplaceAddress from "../abi/Marketplace-address.json"

import { BigNumber } from 'ethers'
// import BigNumber from 'bignumber.js';


export const useContractSend = (functionName, args) => {
    // gass limit to use when sending a transaction
    const gasLimit = BigNumber.from(1000000)
    // prepare to write to the blockage
    const { config } = usePrepareContractWrite({
        address: MarkplaceAddress.Address,
        abi: MarkplaceAbi.abi,
        functionName,
        args,
        overrides: {
            gasLimit
        },
        onError: (err) => {
            console.log(err)
        } 
    })

    const { data, isSuccess, write, writeAsync, error, isLoading } = useContractWrite(config)
    return { data, isSuccess, write, writeAsync, error, isLoading}
}


