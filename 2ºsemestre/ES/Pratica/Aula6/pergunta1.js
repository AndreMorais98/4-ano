var moment = require('moment')

const SHA256 = require('crypto-js/sha256');

class Block{
    constructor (index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
    }



class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }
    
    createGenesisBlock(){
        var data = moment(new Date(Date.now())).format('DD/MM/YYYY')
        return new Block(0, data , "Bloco inicial da koreCoin", "0");
    }
    
    getlatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    
    addBlock(newBlock){
        newBlock.previousHash = this.getlatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    } //In reality we cannot add a new block so easily. There are numerous checks in place like 'Proof of work', 'Proof of stake' etc.
    
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            } //check for hash calculations
            
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            } //check whether current block points to the correct previous block
            
        }
        
         return true;
    }
    
}




let koreCoin = new Blockchain();

koreCoin.addBlock(new Block (1, "01/01/2018", {amount: 20}));
koreCoin.addBlock(new Block (2, "02/01/2018", {amount: 40}));
koreCoin.addBlock(new Block (3, "02/01/2018", {amount: 40}));
koreCoin.addBlock(new Block (4, "10/02/2021", {amount: 100}));
koreCoin.addBlock(new Block (5, "26/01/2021", {amount: 10 , rcv: 'Bloco1', snd: 'Bloco2'}));
koreCoin.addBlock(new Block (6, "20/03/2021", {amount: 50 , rcv: 'Bloco3', snd: 'Bloco4'}));

console.log('Is Blockchain valid? ' + koreCoin.isChainValid());

//tampering with blockchain
koreCoin.chain[1].data = { amount: 100 };
console.log("tampering with data...");
koreCoin.chain[1].hash = koreCoin.chain[1].calculateHash();

console.log('Is Blockchain valid? ' + koreCoin.isChainValid());
console.log('-------Pergunta 1.1-------')
console.log(koreCoin.chain[0])
console.log('-------Pergunta 1.2-------')
console.log(koreCoin.chain)

//console.log(JSON.stringify(koreCoin, null, 4));

//blockchain enables adding blocks to it. But never delete a block or make changes to an already created block. 

//What i've missed. Enabling rollback to a previous instance of the blockchain. Proof of work, a peer to peer network
