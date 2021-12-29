import {ethers} from 'ethers'
import {useEffect, useState} from 'react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import EtherMemorable from '../artifacts/contracts/EtherMemorable.sol/EtherMemorable.json'

export default function Home() {
  const [nfts, setNFts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(()=> {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    // what we want to load:
    // ***provider, tokenContract, marketContract, data for our marketItems***
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, EtherMemorable.abi, provider)
    const data = await marketContract.fetchMarketTokens()

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

  // function to buy nfts for market

  async function buyNFT(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, EtherMemorable.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })

    await transaction.wait()
    loadNFTs()
  }
  if(loadingState === 'loaded' && !nfts.length) return (
    <>
    <h1 className='px-20 py-12 text-white text-3xl'>No NFTs in marketplace</h1>
    <h1 className='px-20 py-12 text-white text-2xl'>Connect your wallet to Rinkeby Test Network to test this dapp</h1>
  </>)

  return (

    <div className='flex justify-center mb-6'>


          <Swiper
               // install Swiper modules
               modules={[Navigation, Pagination, Scrollbar, A11y]}
               spaceBetween={50}
               slidesPerView={1}
               navigation
               pagination={{ clickable: true }}
               onSwiper={(swiper) => console.log(swiper)}
               onSlideChange={() => console.log('slide change')}>

             <div className='px-4' style={{maxWidth: '1600px'}}>
                {nfts.map((nft, i)=>(
                  <SwiperSlide key={i} className='p-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-10 '>
                   <div  className=' shadow-xl rounded-3xl overflow-hidden '>
                     <img src={nft.image} style={{width: '-webkit-fill-available'}} />
                     <div className='p-4 bg-gradient-to-r from-gray-700 via-gray-900 to-black'>
                       <p style={{height:'64px'}} className='text-3x1 text-white font-semibold'>{
                         nft.name}</p>
                         <div style={{ overflow:'hidden'}}>
                           <p className='text-white float-left p-4'>{nft.description}</p>
                           </div>
                       </div>
                       <div className='p-4 bg-gradient-to-r from-gray-700 via-gray-900 to-black'style={{height:'100%'}} >
                           <p className='text-2x-1 mt-3 ml-5 font-bold text-white float-left '>{nft.price} ETH</p>
                           <button className='rounded-3xl w-half bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 text-black mb-4 font-bold py-3 px-12 float-right'
                           onClick={()=> buyNFT(nft)} >Buy
                           </button>
                         </div>
                   </div>
                  </SwiperSlide>))}


            </div>


             </Swiper>



    </div>

  )
}
