import React from "react";
import ReactDOM from "react-dom";
import Web3 from "web3";
import "@babel/polyfill";
import abiArr from "./abi.json";
import "bootstrap/dist/css/bootstrap.min.css";
import UploadFile from "./components/UploadFile.jsx";
import ProveFile from "./components/ProveFile.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hashArr: [],
      uploadFile: "",
      proveFile: "",
    }
    //bindings go here
    this.logWeb = this.logWeb.bind(this);
    this.setupContract();
  }

  setupContract(newAddress) {
    //web3 object initialization
    if (typeof web3 !== 'undefined') {
      //using metamask
      web3 = new Web3(web3.currentProvider);
      console.log("now using metamask");
    } else {
      // set the provider you want from Web3.providers
      console.log("not using metamask");
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    const proofContract = new web3.eth.Contract(abiArr, "0xa850def67ac08ade9ed9609599ecbaa0a3021d2b");
    this.state.contract = proofContract;
  }

  logWeb() {
    this.state.contract.methods.logFiles().call().then(results => console.log("logFiles", results));
    this.state.contract.methods.numberOfFiles().call().then(results => console.log("numberOfFiles", results));
    this.state.contract.methods.latestFile().call().then(results => console.log("latestFile", results));
  }

  render() {
    return (
      <div className="container">
        <h1>Proof of Existence</h1>
        <div className="col-md-9 jumbotron">
          <div className="row">
            <UploadFile contract={this.state.contract} web3={web3}/>

          </div>
          <div className="row">
            <ProveFile contract={this.state.contract} web3={web3}/>
            
          </div>
          <button onClick={this.logWeb} className="btn btn-primary">Log</button>
        </div>
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