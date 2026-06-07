const SHA256 = require('crypto-js/sha256');

//Block Structure
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    //Calculate the hash of the block(Signature of the block)

    calculateHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).toString();
    }
    //Proof of Work(Mining)
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block ${this.index} mined:`  + this.hash);
        console.log("Nonce: " + this.nonce);
        return this;
    }
}

//Blockchain Structure
class Blockchain {
    constructor() {
        this.difficulty = 4; //Difficulty level for mining
        this.chain = [this.createGenesisBlock()];
    }
    //Create the first block of the blockchain
    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0").mineBlock(this.difficulty);
    }
    //Get the latest block in the blockchain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    //Add a new block to the blockchain
    addBlock(newData) {
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(previousBlock.index + 1, Date.now(), newData, previousBlock.hash);
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    //Validate the integrity of the blockchain
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(`Block ${currentBlock.index} has invalid hash.`);
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(`Block ${currentBlock.index} has invalid previous hash.`);
                return false;
            }
            if (currentBlock.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
                console.log(`Block ${currentBlock.index} has not been mined.`);
                return false;
            }
        }
        console.log("Blockchain is valid.");
        return true;
    }

    //Formated show of the blockchain
    printChain() {
        console.log(JSON.stringify(this.chain, null, 4));
        console.log(`Total Blocks: ${this.chain.length}`);
        console.log(`Difficulty Level: ${this.difficulty}`);
        console.log(`Total Mining Time: ${this.chain.reduce((total, block) => total + block.nonce, 0)} seconds`);
        console.log(`Average Mining Time per Block: ${this.chain.reduce((total, block) => total + block.nonce, 0) / this.chain.length} seconds`);
    }
}

module.exports = {Blockchain, Block};