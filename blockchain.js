const Blowfish = require('blowfish-security-lib');
const Crypto = require('crypto');

class Block {
    constructor (index, data, previousHash) {
        this.index = index;
        this.timestamp = Math.floor(Date.now() / 1000);
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.getHash();
    };
   
    getHash() {
        let secretKey = Crypto.randomBytes(64).toString('hex');
        let bf = new Blowfish(secretKey);
        let encrypted = bf.encrypt(JSON.stringify(this.data) + this.previousHash + this.index + this.timestamp);
        return encrypted;
    }
}

class Blockchain {
    constructor() {
        this.chain = [];
    }
    addBlock(data) {
        let index = this.chain.length;
        let previousHash = this.chain.length !== 0 ? this.chain[this.chain.length -1].hash : 0;
        let block = new Block(index, data, previousHash);

        this.chain.push(block);
    }
    validChain() {
        for(let i=0; i<this.chain.length;i++) {
            if(this.chain[i].hash !== this.chain[i].getHash())
                return false;
            if(i> 0 && this.chain[i].previousHash !== this.chain[i-1].hash)
                return false;
        }
        return true;
    }
}

const CryMessenger = new Blockchain();

CryMessenger.addBlock({sender:"Arya Stark", recipient: "Ned Stark", message:"Dey gonna cut yo head off"});
CryMessenger.addBlock({sender:"Ned Stark", recipient: "Arya Stark", message:"Nah it cool. Littlefinger is helping lol"});

console.log(JSON.stringify(CryMessenger, null, 4));
// console.log("validity: ", CryMessenger.validChain());
// CryMessenger.chain[0].data.recipient = "Tywin Lannister";
// console.log("validity: ", CryMessenger.validChain());