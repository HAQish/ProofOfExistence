import React from "react";
import ReactDOM from "react-dom";
import Web3 from "web3";
import "@babel/polyfill";
import abiArr from "./abi.json";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hashArr: [],
      badAccount: false
    }
    //bindings go here
    this.file = this.file.bind(this);
    this.hash = this.hash.bind(this);
    this.logWeb = this.logWeb.bind(this);
    this.addToBC = this.addToBC.bind(this);    
    this.proveInBC = this.proveInBC.bind(this);      
    this.strToHex = this.strToHex.bind(this);
    this.setupContract = this.setupContract.bind(this);
    this.changeAccount = this.changeAccount.bind(this);
    this.closeAccountError = this.closeAccountError.bind(this);
  }

  //functions go here

  componentWillMount() {
    this.setupContract();
  }

  setupContract(newAddress) {
    //web3 object initialization
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    const proofContract = new web3.eth.Contract(abiArr, "0xa850def67ac08ade9ed9609599ecbaa0a3021d2b");

    this.setState({ contract: proofContract });

    web3.eth.getAccounts((err, accounts) => console.log("web3 account", accounts[0]))
  }

  file(type, e) {
    console.log(arguments, e);
    let reader = new FileReader();
    reader.readAsText(type === "add" ? this.fileAdd.files[0] : this.fileProof.files[0]);
    reader.onload = (event) => {
      // console.log("inside", event.target.result);
      // console.log("inside2", this.fileAdd.files[0]);
      this.hash(event.target.result, type);
    };
  }

  hash(text, type) {
    //hashing text inside of files
    let charArr = new TextEncoder('utf-8').encode(text);
    crypto.subtle.digest('SHA-256', charArr).then(results => {
      let newHash = Array.from(new Uint8Array(results)).map(b => ('00' + b.toString(16)).slice(-2)).join('');
      console.log("newHash", newHash, "charArr", charArr);

      if (type === "add") {
        this.addToBC(newHash);
      }

      if (type === "prove") {
        this.proveInBC(newHash);
      }

      // let currentArr = this.state.hashArr;
      // if (currentArr.includes(newHash)) {
      //   console.log("not adding, already have file");
      // } else {
      //   this.setState({hashArr: currentArr.concat(newHash)});
      //   // console.log("adding, new file", this.state);
      // }
    });

    return;

  }

  addToBC(newHash) {
    console.log("in addToBC, hash is", arguments);
    let hexStr = this.strToHex(newHash);
    this.state.contract.methods.add(hexStr).call().then(results => console.log(results));
  }

  proveInBC(hash) {
    console.log("in proveInBC, hash is", arguments);
    let hexStr = this.strToHex(hash);
    this.state.contract.methods.prove(hexStr).call().then(results => console.log(results));
  }

  strToHex(hash) {
    let newStr = '';
    for (let char of hash) {
      newStr += char.charCodeAt(0).toString(16);
    }
    console.log("strToHex", newStr);
    return "0x" + newStr.slice(0, 64);
  }

  async logWeb() {
    console.log("web3 object", web3);
    console.log("Eth account", web3.eth.defaultAccount);
    console.log("Contract", this.state.contract);
    // let files = await this.state.contract.methods.logFiles().call();
    // let number = await this.state.contract.methods.numberOfFiles().call();
    // let latest = await this.state.contract.methods.latestFile().call();
    // console.log("state of files in contract", files);
    // console.log("number of files in contract", number);
    // console.log("latest file hash", latest);
    this.state.contract.methods.logFiles().call().then(results => console.log("logFiles", results));
    this.state.contract.methods.numberOfFiles().call().then(results => console.log("numberOfFiles", results));
    this.state.contract.methods.latestFile().call().then(results => console.log("latestFile", results));
  }

  changeAccount() {
    console.log("new account address", this.accountField.value);
    try {
      this.setupContract(this.accountField.value);
    } catch {
      this.setState({badAccount: true});
    }
  }

  closeAccountError() {
    this.setState({badAccount: false});
  }

  render() {
    let account;
    if (this.state.badAccount) {
      account = <div className="accountErrorMsg">
          <span className="accountErrorTxt">Invalid account address.</span>
          <span className="accountErrorClose" onClick={this.closeAccountError}>X</span>
        </div>
    } else {
      //account is no html data
    }

    return (
      <div className="macroDiv">
        <div className="addDiv">
          Add new file to blockchain
          <br />
          <input type="file" onChange={(e) => { this.file("add", e) }} ref={el => this.fileAdd = el}/>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="proveDiv">
          Is this file in the blockchain?
          <br />
          <input type="file" onChange={(e) => { this.file("prove", e) }} ref={el => this.fileProof = el} />
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="accountDiv">
          <input type="text" placeholder="New Account Address" ref={el => this.accountField = el} 
          className="accountField"/>
          <button onClick={this.changeAccount}>Change Account</button>
        </div> 
        <button onClick={this.logWeb} className="logBtn">Log</button>
        {account}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector("#app"));

//bytes32 means hex, but not necessarily regular string

/*

pragma solidity ^0.4.25;
contract ProofOfExistence {
    //no constructor

    struct Filestruct {
        bytes32 hash;
        uint timestamp;
    }

    Filestruct[] files;

    //var files = [{File structure}]

    //add and prove

    function add(bytes32 _hash) public returns (bool) {

        for (uint i = 0; i < files.length; i++) {
            if (files[i].hash == _hash) return false;
        }

        files.push(Filestruct(_hash, now));

        return true;
    }

    function prove(bytes32 _hash) public view returns (uint) {
        for (uint i = 0; i < files.length; i++) {
            if (files[i].hash == _hash) return files[i].timestamp;
        }
        revert();
    }
}
*/