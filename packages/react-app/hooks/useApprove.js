import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import ERC20 from '../abi/erc20InstacnceAbi.json'
import MarkplaceAddress from "../abi/Marketplace-address.json"

import { BigNumber } from 'ethers'

export const useContractToApprove = (price) => {
    const gasLimit = BigNumber.from(1000000);

    // contract prepare
    const { config } = usePrepareContractWrite({
        address: ERC20.address,
        abi: ERC20.abi,
        functionName: "approve",
        args: [MarkplaceAddress.Address, price],
        overrides: {
            gasLimit
        },
        onError: (err) => {
            console.log({ err })
        }
    })

    const { data, isSuccess, write, writeAsync, error, isLoading} = useContractWrite(config)
    return {data, isSuccess, write,  writeAsync, isLoading}
 }