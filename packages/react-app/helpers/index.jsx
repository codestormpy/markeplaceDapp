import Blockies from 'react-blockies'

export const identicontemplates = (address) => {
    return <Blockies sizes={14} scale={4} className='identicon border-2 border-white rounded-full' seed={address} />
}