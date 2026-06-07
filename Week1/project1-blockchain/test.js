const { Blockchain, Block } = require('./blockchain');
//Test the Blockchain
let myBlockchain = new Blockchain();
console.log("Mining block 1...");
myBlockchain.addBlock({ from: "Paul", to: "Bob", amount: 4 });
console.log("Mining block 2...");
myBlockchain.addBlock({ from: "Bob", to: "Jean", amount: 8 });
console.log("Mining block 3...");
myBlockchain.addBlock({ from: "Jean", to: "Jason", amount: 12 });
myBlockchain.printChain();

//Attack scenario: Tampering with the blockchain
console.log("\nTampering with the blockchain...");
myBlockchain.chain[1].data = { from: "Paul", to: "Bob", amount: 12 };
myBlockchain.chain[1].hash = myBlockchain.chain[1].calculateHash(); //Recalculate the hash after tampering
console.log("Is blockchain valid? " + myBlockchain.isChainValid());

//Mining demonstration duration with different difficulty levels
console.log("\nMining demonstration with different difficulty levels:");
const testBlockchain = new Blockchain();
const difficulties = [2, 4, 6];
difficulties.forEach(difficulty => {
    testBlockchain.difficulty = difficulty;
    console.log(`\nMining block with difficulty ${difficulty}...`);
    const startTime = Date.now();
    testBlockchain.addBlock({ from: "Jason", to: "Bob", amount: 10 });
    const endTime = Date.now();
    console.log(`Time taken to mine block with difficulty ${difficulty}: ${(endTime - startTime) / 1000} seconds`);
}
);