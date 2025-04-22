// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721Royalty} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

error CourtneyCrewsNFTContract_MaxSupplyReached();
error CourtneyCrewsNFTContract_ValueNotEqualPrice();
error CourtneyCrewsNFTContract_WrongAvenueForThisTransaction();

// @custom:security-contact courtneymichelle.cc@gmail.com
contract CourtneyCrewsNFTContract is 
    ERC721, 
    ERC721Enumerable, 
    ERC721URIStorage, 
    ERC721Burnable, 
    ERC721Royalty,
    Ownable,
    ReentrancyGuard
{
    // Counter for token IDs starting from 0
    uint256 private _tokenIdCounter;
    uint256 private immutable i_mint_price;
    uint256 private immutable i_max_tokens;
    string private s_base_uri;
    address private immutable i_owner;

    event MintingCompleted(uint256 tokenId, address owner);
    event FundsDistributed(address owner, uint256 amount);

    constructor(
        uint256 _mint_price,
        uint256 _max_tokens,
        string memory _base_uri,
        address _royaltyArtist,
        uint96 _royaltyBasis
    )
        ERC721("CourtneyCrewsNFTContract", "CC")
        Ownable(msg.sender)
        payable
    {
        i_mint_price = _mint_price;
        i_max_tokens = _max_tokens;
        s_base_uri = _base_uri;
        _setDefaultRoyalty(_royaltyArtist, _royaltyBasis);
        i_owner = msg.sender;
    }

    receive() external payable {
        revert CourtneyCrewsNFTContract_WrongAvenueForThisTransaction();
    }

    fallback() external payable {
        revert CourtneyCrewsNFTContract_WrongAvenueForThisTransaction();
    }

    /**
     * @notice Mint a new NFT with specified token URI
     * @param uri The token URI for this specific token, which can contain metadata with hidden messages
     * @return The ID of the newly minted token
     */
    function mintTo(
        string calldata uri
    ) public payable nonReentrant returns (uint256) {
        // Check if we've reached max supply
        if (_tokenIdCounter >= i_max_tokens) {
            revert CourtneyCrewsNFTContract_MaxSupplyReached();
        }
        
        // Verify correct payment
        if (msg.value != i_mint_price) {
            revert CourtneyCrewsNFTContract_ValueNotEqualPrice();
        }
        
        // Get current token ID and increment for next mint
        uint256 newItemId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Mint the token to sender
        _safeMint(msg.sender, newItemId);
        
        // Set the token's URI (containing potential hidden message in metadata)
        _setTokenURI(newItemId, uri);
        
        // Emit event for successful mint
        emit MintingCompleted(newItemId, msg.sender);
        
        // Transfer funds to owner
        payable(i_owner).transfer(address(this).balance);
        emit FundsDistributed(i_owner, msg.value);
        
        return newItemId;
    }

    /**
     * @dev Sets a new base URI for all tokens
     * @param newBaseURI The new base URI
     */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        s_base_uri = newBaseURI;
    }

    function getMaxSupply() public view returns (uint256) {
        return i_max_tokens;
    }

    function getMintPrice() public view returns (uint256) {
        return i_mint_price;
    }

    function getBaseURI() public view returns (string memory) {
        return s_base_uri;
    }

    function getCurrentTokenCount() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function contractURI() public view returns (string memory) {
        return s_base_uri;
    }

    function setRoyalty(
        address _receiver,
        uint96 feeNumerator
    ) public onlyOwner {
        _setDefaultRoyalty(_receiver, feeNumerator);
    }

    function _baseURI() internal view override returns (string memory) {
        return s_base_uri;
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    /**
     * @dev Returns the URI for a given token ID using ERC721URIStorage implementation
     * Each token can have its own URI with unique metadata (including hidden messages)
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}