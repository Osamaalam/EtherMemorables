
// we want to load the users nfts and display

import {ethers} from 'ethers'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from '../config'


import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import EtherMemorable from '../artifacts/contracts/EtherMemorable.sol/EtherMemorable.json'

export default function MyAssets() {
    // array of nfts
  const [nfts, setNFts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [showModal, setShowModal] = useState(false);
  const [tId, setTId] = useState();
  const [tOwner, setTowner] = useState();
  const [recipient, setRecipient] = useState();

  useEffect(()=> {
    loadNFTs()
  }, [])

async function setState(owner, id){
  setTowner(owner)
  setTId(id)
  setShowModal(true)
}
const handleInput = event => {
    setRecipient(event.target.value);
  };
  async function TransferItem() {
  //Tranfering item to another address
  if(ethers.utils.isAddress(recipient) && tId != null){
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  const tokenContrack = new ethers.Contract(nftmarketaddress, EtherMemorable.abi, signer)
  const transaction = await tokenContrack.TransferItem(nftaddress, recipient, tId)
}
else{
  console.log("Wrong Address");
}
  //const transaction = await tokenContrac.OwnerTokenId(nftaddress, id)
  //const transaction = await tokenContrac.massageSender
  //console.log(tId)
  loadNFTs()
  setShowModal(false)
  }

  async function loadNFTs() {
    // what we want to load:
    // we want to get the msg.sender hook up to the signer to display the owner nfts

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, EtherMemorable.abi, signer)
    const data = await marketContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      // we want get the token metadata - json
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }
      return item
    }))

    setNFts(items)
    setLoadingState('loaded')
  }

  if(loadingState === 'loaded' && !nfts.length) return (<h1
  className='px-20 py-12 text-white text-3xl'>You do not own any NFTs currently :(</h1>)

  return (
    <>
    <div className='flex justify-center '>
          <div className='px-4' style={{maxWidth: '1600px'}}>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-4'>
            {
              nfts.map((nft, i)=>(
                <div key={i} className=' shadow-xl rounded-3xl overflow-hidden '>
                  <img src={nft.image} style={{width: '-webkit-fill-available', maxHeight: "300px"}} />
                  <div className='p-4 bg-gradient-to-r from-gray-700 via-gray-900 to-black'>
                    <p style={{height:'64px'}} className='text-3x1 text-white font-semibold'>{
                      nft.name}</p>
                      <div style={{ overflow:'hidden'}}>
                        <p className='text-white float-left p-4'>{nft.description}</p>
                        </div>
                    </div>
                    <div className='p-4 bg-gradient-to-r from-gray-700 via-gray-900 to-black'style={{height:'100%'}} >
                        <p className='text-2xl font-bold text-white justify-center'>{nft.price} ETH</p>
                        <button
                        className='rounded-3xl mt-4 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 text-black mb-4 font-bold py-3 px-12'
                        onClick={() => setState(nft.owner, nft.tokenId)}
                        >
                            Transfer NFT
                        </button>
                      </div>

                </div>

              ))
            }

          </div>
          </div>
    </div>
    {showModal ? (
              <>
                <div
                  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                  <div className="relative w-auto my-6 mx-auto max-w-3xl popup">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                        <h3 className="text-3xl font-semibold">
                          Add and confirm recipient address
                        </h3>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setShowModal(false)}
                        >
                          <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                            ×
                          </span>
                        </button>
                      </div>
                      {/*body*/}
                      <div className="relative p-6 flex-auto">
                        <input
                        name="RecipientAddress"
                        placeholder='Recipient Address'
                        className='mt-10 border rounded-3xl p-4 w-full'
                        onChange={handleInput}
                        //onChange={ e => updateFormInput({...formInput, name: e.target.value})}
                        />
                      </div>
                      {/*footer*/}
                      <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                          className="rounded-3xl mt-4 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 text-black mb-4 font-bold py-3 px-12"
                          type="button"
                          onClick={() => TransferItem()}
                        >
                          Confirm Tranfer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </>
            ) : null}


</>
)
}
