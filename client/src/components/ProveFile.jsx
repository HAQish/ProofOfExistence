import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class ProveFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      proveFile: "",
    }
    //bindings
    this.file = this.file.bind(this);
    this.proveInBlockchain = this.proveInBlockchain.bind(this);
    this.showFileStatusToast = this.showFileStatusToast.bind(this);
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
      this.proveInBlockchain(hash);
    };
  }

  proveInBlockchain(hash) {
    this.props.web3.eth.getAccounts((err, accountsArr) => {
      let account = accountsArr[0];
      this.props.contract.methods.prove(hash).call({ from: account }).then(r => this.showFileStatusToast(r));
    });
  }

  showFileStatusToast(status) {
    if (status === "File exists!") {
      toast.info('File confirmed!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } else {
      toast.error('File not in collection.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  }


  render() {
    return (
      <div className="container">
        <div className="col-md-10">
          <div className="input-group">
            <span className="input-group-btn">
              <span className="btn btn-primary btn-file fixed-button">
                Prove existence
                  <input className="btn btn-primary form-control"
                  type="file"
                  onChange={(e) => { this.file(e) }}
                  ref={el => this.fileAdd = el} /> 
              </span>
            </span>
            <input type="text" className="form-control fixed-input" readOnly value={this.state.uploadFile} />
          </div>
        </div>
        <ToastContainer />
      </div>
    )
  }
}

export default ProveFile;