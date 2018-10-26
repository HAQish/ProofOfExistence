import React from "react";
import ReactDOM from "react-dom";

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
      this.props.contract.methods.add(newHash).send({ from: account }).then(results => {
        console.log("addResult", results);
        this.setState({spinner: false});
      });
    });
  }


  render() {
    const spinnerDiv = this.state.spinner ? <div className="loader" /> : <div className="no-loader" />;
    return (
      <div className="container mb-6">
        <div className="col-md-9">
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
      </div>
    )
  }
}

export default UploadFile;