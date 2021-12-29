import '../styles/globals.css'
import './app.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import Link from 'next/link'
import Image from 'next/image'
import WalletCardEthers from'./connection.js';
import { nftaddress, nftmarketaddress } from '../config'

function EtherMemorableMarketplace({Component, pageProps}) {
  const etherscan = 'https://rinkeby.etherscan.io/address/' + nftmarketaddress
  return (
    <div>
      <nav className='p-5'>

        <div className=' justify-center text-white'>
        <p className='text-2xl font-bold text-white  float-left title'>EtherMemorable</p>
          <Link href='/'>
            <a className='text-xl mr-16 link'>
            Home
            </a>
          </Link>
          <Link href='/about'>
            <a className='text-xl mr-16 link'>
            About
            </a>
          </Link>
          <Link href='/mint-item'>
            <a className='text-xl mr-16 link'>
              Mint Token
            </a>
          </Link>
          <Link href='/my-nfts'>
            <a className='text-xl mr-16 link'>
              My NFTs
            </a>
          </Link>

          <Link href='https://twitter.com/EtherMemorable'>
          <a className='text-xl mr-16 mt-2 float-right link' target="new">
            <Image src="/../public/twitter.png" title="TwitterHandle" width="25px" height="25px" />
          </a>
          </Link>
          <Link href={etherscan}>
          <a className='text-xl mr-6 mt-2 float-right link' target="new">
            <Image src="/../public/ether.png" title="EtherScan" width="35px" height="25px" />
          </a>
          </Link>

          <WalletCardEthers />
          </div>

      </nav>


      <Component {...pageProps} />
    </div>
  )
}

export default EtherMemorableMarketplace
