const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("CourtneyCrewsNFTContract", async function () {
  let CourtneyCrewsNFTContractFactory;
  let CourtneyCrewsNFTContract;
  let args = {
    mint_price: "2000000000000000000",
    max_tokens: 3,
    base_uri:
      "https://ipfs.io/ipfs/bafkreidr5a7hvyiilxfug2yqpbkdowcahpbsw4jszstz6iur5ae5dx7b54",
    royaltyArtist: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    royaltyBasis: 500,
  };

  this.beforeEach(async function () {
    CourtneyCrewsNFTContractFactory = await ethers.getContractFactory(
      "CourtneyCrewsNFTContract"
    );
    CourtneyCrewsNFTContract = await CourtneyCrewsNFTContractFactory.deploy(
      args.mint_price,
      args.max_tokens,
      args.base_uri,
      args.royaltyArtist,
      args.royaltyBasis
    );
    await CourtneyCrewsNFTContract.waitForDeployment();
  });

  describe("construction and initialization", async function () {
    this.beforeEach(async function () {
      CourtneyCrewsNFTContractFactory = await ethers.getContractFactory(
        "CourtneyCrewsNFTContract"
      );
      CourtneyCrewsNFTContract = await CourtneyCrewsNFTContractFactory.deploy(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
      await CourtneyCrewsNFTContract.waitForDeployment();
    });

    it("should be named CourtneyCrewsNFTContract", async function () {
      const expectedValue = "CourtneyCrewsNFTContract";
      const currentValue = await CourtneyCrewsNFTContract.name();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should be have symbol CC", async function () {
      const expectedValue = "CC";
      const currentValue = await CourtneyCrewsNFTContract.symbol();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should have a mint price set when constructed", async function () {
      const expectedValue = args.mint_price;
      const currentValue = await CourtneyCrewsNFTContract.getMintPrice();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should have a max token supply set when constructed", async function () {
      const expectedValue = args.max_tokens;
      const currentValue = await CourtneyCrewsNFTContract.getMaxSupply();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should have a base URI set when constructed", async function () {
      const expectedValue = args.base_uri;
      const currentValue = await CourtneyCrewsNFTContract.getBaseURI();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should set roylaty artist when constructed", async function () {
      let tokenId = 0;
      const expectedValue = args.royaltyArtist;
      const currentValue = await CourtneyCrewsNFTContract.royaltyInfo(
        1,
        ethers.parseUnits("2.0", "ether")
      );
      assert.equal(currentValue[0].toString(), expectedValue);
    });

    it("should set roylaty share when constructed", async function () {
      const expectedValue = (args.royaltyBasis * args.mint_price) / 10000;
      const currentValue = await CourtneyCrewsNFTContract.royaltyInfo(
        1,
        ethers.parseUnits("2.0", "ether")
      );
      assert.equal(currentValue[1].toString(), expectedValue);
    });

    it("should set owner to the deployer's address when constucted", async function () {
      const expectedValue = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      const currentValue = await CourtneyCrewsNFTContract.owner();
      assert.equal(currentValue.toString(), expectedValue);
    });
  });

  describe("receive function", async function () {
    this.beforeEach(async function () {
      CourtneyCrewsNFTContractFactory = await ethers.getContractFactory(
        "CourtneyCrewsNFTContract"
      );
      CourtneyCrewsNFTContract = await CourtneyCrewsNFTContractFactory.deploy(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
      await CourtneyCrewsNFTContract.waitForDeployment();
    });

    it("should be called and revert if called from low-level transaction", async function () {
      let contractAddress = await CourtneyCrewsNFTContract.getAddress();
      const [owner, artist, buyer] = await ethers.getSigners();
      await expect(
        buyer.sendTransaction({
          to: contractAddress,
          value: ethers.parseUnits("2.0", "ether"),
        })
      ).to.be.revertedWithCustomError;
    });
  });

  describe("fallback function", async function () {
    this.beforeEach(async function () {
      CourtneyCrewsNFTContractFactory = await ethers.getContractFactory(
        "CourtneyCrewsNFTContract"
      );
      CourtneyCrewsNFTContract = await CourtneyCrewsNFTContractFactory.deploy(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
      await CourtneyCrewsNFTContract.waitForDeployment();
    });

    it("should be called and revert if called from low-level transaction with no data", async function () {
      let contractAddress = await CourtneyCrewsNFTContract.getAddress();
      const [owner, artist, buyer] = await ethers.getSigners();
      expect(buyer.sendTransaction({ to: contractAddress })).to.be
        .revertedWithCustomError;
    });
  });

  describe("mintTo function", async function () {
    this.beforeEach(async function () {
      CourtneyCrewsNFTContractFactory = await ethers.getContractFactory(
        "CourtneyCrewsNFTContract"
      );
      CourtneyCrewsNFTContract = await CourtneyCrewsNFTContractFactory.deploy(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
      await CourtneyCrewsNFTContract.waitForDeployment();
    });

    it("should revert if called with no ether", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      expect(
        CourtneyCrewsNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: ethers.parseUnits("0.0", "ether"),
        })
      ).to.be.revertedWithCustomError;
    });

    it("should revert if called with too low amount of ether", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      expect(
        CourtneyCrewsNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: args.mint_price - 1,
        })
      ).to.be.revertedWithCustomError;
    });

    it("should revert if called with too high amount of ether", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      expect(
        CourtneyCrewsNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: args.mint_price + 1,
        })
      ).to.be.revertedWithCustomError;
    });

    it("should not revert if called with the correct amount of ether", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      expect(
        CourtneyCrewsNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: args.mint_price,
        })
      ).not.to.be.reverted;
    });

    it("should revert if called after all tokens are minted", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      for (let i = 0; i < args.max_tokens; i++) {
        CourtneyCrewsNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: args.mint_price,
        });
      }
      expect(
        CourtneyCrewsNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: args.mint_price,
        })
      ).to.be.revertedWithCustomError;
    });

    it("should have a totalSupply = 1 with after first mint", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      const expectedValue = 1;
      const mint1 = await CourtneyCrewsNFTContract.connect(buyer).mintTo(
        args.base_uri,
        { value: args.mint_price }
      );
      mint1.wait(1);
      const currentValue = await CourtneyCrewsNFTContract.totalSupply();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should increase the totalSupply by 1 with with each mint", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      const expectedValue = 2;
      const mint1 = await CourtneyCrewsNFTContract.connect(buyer).mintTo(
        args.base_uri,
        { value: args.mint_price }
      );
      mint1.wait(1);
      const mint2 = await CourtneyCrewsNFTContract.connect(buyer).mintTo(
        args.base_uri,
        { value: args.mint_price }
      );
      mint2.wait(1);
      const currentValue = await CourtneyCrewsNFTContract.totalSupply();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should emit an event when minting is completed", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      await expect(
        CourtneyCrewsNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: args.mint_price,
        })
      )
        .to.emit(CourtneyCrewsNFTContract, "MintingCompleted")
        .withArgs(0, buyer.address); // 0 is the first token ID, buyer is the recipient
    });

    it("should store different token URIs for different tokens", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      const uri1 = "uri-for-token-1";
      const uri2 = "uri-for-token-2";
      
      await CourtneyCrewsNFTContract.connect(buyer).mintTo(uri1, { value: args.mint_price });
      await CourtneyCrewsNFTContract.connect(buyer).mintTo(uri2, { value: args.mint_price });
      
      const tokenURI1 = await CourtneyCrewsNFTContract.tokenURI(0);
      const tokenURI2 = await CourtneyCrewsNFTContract.tokenURI(1);
      
      // Just check that they're different, not the exact content
      expect(tokenURI1).to.not.equal(tokenURI2);
    });

    it("should correctly track the token count", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      
      // Initially should be 0
      expect(await CourtneyCrewsNFTContract.getCurrentTokenCount()).to.equal(0);
      
      // Mint first token
      await CourtneyCrewsNFTContract.connect(buyer).mintTo("uri1", { value: args.mint_price });
      expect(await CourtneyCrewsNFTContract.getCurrentTokenCount()).to.equal(1);
      
      // Mint second token
      await CourtneyCrewsNFTContract.connect(buyer).mintTo("uri2", { value: args.mint_price });
      expect(await CourtneyCrewsNFTContract.getCurrentTokenCount()).to.equal(2);
    });

    it("should have paid the owner the value that was sent", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      await CourtneyCrewsNFTContract.connect(buyer).mintTo("uri", { value: args.mint_price });
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance - initialBalance).to.equal(BigInt(args.mint_price));
    });

    it("should have a balance of zero after minting", async function () {
      const expectedValue = 0;
      const [owner, artist, buyer] = await ethers.getSigners();
      const uriString = "someString";
      const mint1 = await CourtneyCrewsNFTContract.connect(buyer).mintTo(
        uriString,
        { value: args.mint_price }
      );
      mint1.wait(1);
      const currentValue = await ethers.provider.getBalance(
        CourtneyCrewsNFTContract
      );
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should emit an event after funds are distributed during mint", async function () {
      //      const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      const [owner, artist, buyer] = await ethers.getSigners();
      const uriString = "someString";
      expect(
        CourtneyCrewsNFTContract.connect(buyer).mintTo(uriString, {
          value: args.mint_price,
        })
      )
        .to.emit(CourtneyCrewsNFTContract, "FundsDistributed")
        .withArgs(owner, args.mint_price);
    });
  });

  describe("getter functions", async function () {
    this.beforeEach(async function () {
      CourtneyCrewsNFTContractFactory = await ethers.getContractFactory(
        "CourtneyCrewsNFTContract"
      );
     CourtneyCrewsNFTContract = await CourtneyCrewsNFTContractFactory.deploy(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
      await CourtneyCrewsNFTContract.waitForDeployment();
    });

    it("getMaxSupply() should return the max number of tokens for this NFT", async function () {
      const expectedValue = args.max_tokens;
      const currentValue = await CourtneyCrewsNFTContract.getMaxSupply();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("getMintPrice() should return the purchase price of the NFT", async function () {
      const expectedValue = args.mint_price;
      const currentValue = await CourtneyCrewsNFTContract.getMintPrice();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("getBaseURI() should return the project URI string", async function () {
      const expectedValue = args.base_uri;
      const currentValue = await CourtneyCrewsNFTContract.getBaseURI();
      assert.equal(currentValue.toString(), expectedValue);
    });
  });
});
