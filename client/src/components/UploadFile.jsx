import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class UploadFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadFile: "",
      spinner: false
    }
    //bindings
    this.file = this.file.bind(this);        
    this.addToBlockchain = this.addToBlockchain.bind(this);      
    this.createToastError = this.createToastError.bind(this);
    this.createToastSuccess = this.createToastSuccess.bind(this);
  }
  //functions

  file(e) {
    let reader = new FileReader();
    reader.readAsText(this.fileAdd.files[0]);
    let name = this.fileAdd.files[0].name;
    this.setState({ uploadFile: name });

    reader.onload = (event) => {
      let charArr = new TextEncoder('utf-8').encode(event.target.result);
      let hash = this.props.web3.utils.sha3(charArr);
      console.log(hash);
      this.addToBlockchain(hash);
    };
  }

  addToBlockchain(newHash) { //receiving web3 object and contract as props
    this.props.web3.eth.getAccounts((err, accounts) => {
      let account = accounts[0];
      this.setState({spinner: true});
      this.props.contract.methods.add(newHash).send({ from: account }).catch(error => {
        console.log("catch in addToBC", error);
        this.setState({spinner: false});
        this.createToastError();
      }).then(results => {
        console.log("addResult", results);
        this.setState({spinner: false});
        this.createToastSuccess(results);
      });
    });
  }

  createToastError() {
    toast.error('Transaction denied by user.', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }

  createToastSuccess(results) {
    toast.success(`Block ${results.blockNumber} added to blockchain!`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }


  render() {
    const spinnerDiv = this.state.spinner ? <div className="loader" /> : <div className="no-loader" />;
    return (
      <div className="container mb-6">
        <div className="col-md-10">
          <div className="input-group">
            <span className="input-group-btn">
              <span className="btn btn-primary btn-file fixed-button">
                {this.state.spinner ? "Mining..." : "Upload"}
                <input className="btn btn-primary form-control" 
                type="file" 
                onChange={(e) => { this.file(e) }} 
                ref={el => this.fileAdd = el} />
              </span>
            </span>
            <input type="text" 
                   className="form-control fixed-input"
                   readOnly 
                   value={this.state.uploadFile} 
                   disabled={this.state.spinner}
                   />
          </div>
        </div>
          {spinnerDiv}
          <ToastContainer />
      </div>
    )
  }
}

export default UploadFile;