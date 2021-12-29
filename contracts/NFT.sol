//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// bringing openzeppelin ERC721 NFT functionality
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';


// This contract give the NFT market the ability to transact with tokens or change ownership
contract NFT is ERC721URIStorage {

    // counters keep track of tokenIds
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // address of marketplace for NFTs
    address contractAddress;

    // constructor set up our address
    constructor(address marketplaceAddress) ERC721('EtherMemorable', 'ETM') {
        contractAddress = marketplaceAddress;
    }

    function mintToken(string memory tokenURI) public returns(uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        // set the token URI: id and url
        _setTokenURI(newItemId, tokenURI);
        // give the marketplace the approval to transact between users
        setApprovalForAll(contractAddress, true);
        // mint the token and set it for sale - return the id to do so
        return newItemId;
    }
    function fetchTokenIds() public view returns(uint256){
      return _tokenIds.current();
    }
}
