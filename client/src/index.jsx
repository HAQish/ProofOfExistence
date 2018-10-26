import React from "react";
import ReactDOM from "react-dom";
import Web3 from "web3";
import "@babel/polyfill";
import abiArr from "./abi.json";
import "bootstrap/dist/css/bootstrap.min.css";
import UploadFile from "./components/UploadFile.jsx";
import ProveFile from "./components/ProveFile.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    this.showFileToasts = this.showFileToasts.bind(this);
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

  showFileToasts(results) {
    for (let i = 0; i < results[0].length; i++) {
      let str = `Hash: ${results[0][i].slice(0, 20)}...${results[0][i].slice(-20)}\n
      Uploaded at: ${results[1][i]}`;
      toast.info(str, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        bodyClassName: "toastSmallText"
      });
    }
  }

  logWeb() {
    this.state.contract.methods.logFiles().call().then(results => this.showFileToasts(results));
    // this.state.contract.methods.numberOfFiles().call().then(results => console.log("numberOfFiles", results));
    // this.state.contract.methods.latestFile().call().then(results => console.log("latestFile", results));
  }

  render() {
    return (
      <div className="container">
        <h1>Proof of Existence</h1>
        <div className="col-md-11 jumbotron">
          <div className="row">
            <UploadFile contract={this.state.contract} web3={web3}/>

          </div>
          <div className="row">
            <ProveFile contract={this.state.contract} web3={web3}/>
          </div>
            
          <button onClick={this.logWeb} className="btn btn-primary logger">Log Files</button>
          <ToastContainer />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector("#app"));


//upload proof of existence fix maybe
//add toast notification on successful mine, possibly other confirmation
//error handling on metamask rejection
//instead of log, show stats => total uploaded, last upload time, contract link to etherscan
  //large, blue, different font