import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers'



const WalletCardEthers = () => {

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	const [provider, setProvider] = useState(null);


	async function connectWalletHandler() {



		if (window.ethereum && defaultAccount == null) {
			// set ethers provider
			setProvider(new ethers.providers.Web3Provider(window.ethereum));

			// connect to metamask
			await window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				setConnButtonText('Wallet Connected');
				//setDefaultAccount(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			});

		} else if (!window.ethereum){
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

useEffect(() => {

  if(defaultAccount){
	provider.getBalance(defaultAccount)
	.then(balanceResult => {
		setUserBalance(ethers.utils.formatEther(balanceResult));
	})
	};
}, [defaultAccount]);

	return (

    <button className="Walletconnect rounded-3xl  bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 text-black font-bold py-3 px-8 "
     onClick={connectWalletHandler}>{connButtonText}</button>

		// <div className='walletCard'>
		// <h4> Connection to MetaMask using ethers.js </h4>
    //
		// 	<div className='accountDisplay'>
		// 		<h3>Address: {defaultAccount}</h3>
		// 	</div>
		// 	<div className='balanceDisplay'>
		// 		<h3>Balance: {userBalance}</h3>
		// 	</div>
		// 	{errorMessage}
		// </div>
	);
}

export default WalletCardEthers;
