import React, { Component } from 'react'
import getMultiSig from './utils/getMultiSig'
import MultiSig from './utils/multisig'
import { Button, Nav,NavItem } from 'react-bootstrap';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractOwner: 0,
      contractStatus: "In Active",
      isSigner: false,
      amount: 0,
      proposalAmount: 0,
      signers: [],
      rejectaddress: '',
      acceptaddress: '',
      contractbalance: 0,
      contractEthBalance : 0,
      lastTransaction : '',
      contributors: [{"address" : "temp", "amt" : 0}],
      contractaddress: 'address',
      proposals: [{"address" : "temp", "value" : 0}],
      events: [],
      withdrawamount: [],
      amountToWithdraw : 0,
      amountToContribute:0,
      dummy : '',
    }
    this.handleContributeChange = this.handleContributeChange.bind(this);
    this.handleProposalAmountChange = this.handleProposalAmountChange.bind(this);    
    this.endContributionPeriod  = this.endContributionPeriod.bind(this);
    this.contribute = this.contribute.bind(this);
    this.submitProposal = this.submitProposal.bind(this);
    this.handleApprovalAddress = this.handleApprovalAddress.bind(this);
    this.handleRejectAddress = this.handleRejectAddress.bind(this);
    this.approveProposal = this.approveProposal.bind(this);
    this.rejectProposal = this.rejectProposal.bind(this);
    this.withdrawProposalAmount = this.withdrawProposalAmount.bind(this);
    this.withdrawProposal = this.withdrawProposal.bind(this);
  }
  
  componentWillMount() {
    getMultiSig.then(instance => {
      self = this;      
      var events = instance.allEvents({fromBlock: 0, toBlock: 'latest'})
      events.watch(function (err, ev) {
        self.walletevents(err, ev)
      })
        this.initializeContract();
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  initializeContract() {
    this.fetchcontractowner()
    this.fetchContractStatus()
    this.fetchContractBalance()
    this.fetchContractEthBalance()
    this.getContributors()
    this.getProposals()
  }

  fetchContractStatus() {    
    MultiSig.getContractStatus().then((result) => {          
        if(result){
          this.setState({ contractStatus: "Active" })
        }else{
          this.setState({ contractStatus: "In Active" })
        }
        
    })
}

  fetchcontractowner() {    
      MultiSig.contractowner().then((result) => {        
          this.setState({ contractOwner: result })
      })
  }

  endContributionPeriod() {    
    self = this;
    MultiSig.endContributionPeriod().then((result) => {                
        self.initializeContract();
    })
}

  fetchContractBalance() {    
    MultiSig.getTotalContributions().then((result) => {  
        
      console.log(result);                 
          this.setState({contractbalance: result})     
    })
}


fetchContractEthBalance() {   
  console.log("balance in eth");  
  MultiSig.contractBalance().then((result) => {                   
        this.setState({contractEthBalance: result})     
  })
}


  
  handleContributeChange(event) {
    this.setState({amountToContribute: event.target.value});
  }

  contribute(e) {
    e.preventDefault()
    console.log('amount to contribute', this.state.amountToContribute)
    MultiSig.contribute(this.state.amountToContribute).then((response) => {
      this.setState({lastTransaction : response.tx});
    })
  }

  getContributors () {
    MultiSig.getContributers().then((cont) => {
      var self = this;
      self.setState({contributors: []});      
      for (var i = 0; i <= cont.length - 1; i++) {
        MultiSig.getContributorAmount(cont[i]).then((contributor) => {                                
        self.state.contributors.push({'address': contributor.address, 'contribution': contributor.amt});
        self.setState({contributors: this.state.contributors});
        })
      }      
    })
  }

  getProposals() {
    MultiSig.listOpenProposals().then((cont) => {
      var self = this;
      self.setState({proposals: []});  
      console.log('listOpenProposals', cont)
      for (var i = 0; i <= cont.length - 1; i++) {
        console.log('this.cont proposals', cont)
        MultiSig.getProposal(cont[i]).then((proposal) => {
        self.state.proposals.push({'address': proposal.address, 'value': proposal.value});
        self.setState({proposals: this.state.proposals});          
        })
      }
    })
  }

  handleProposalAmountChange(event) {
    this.setState({proposalAmount: event.target.value});
  }

  submitProposal(e) {
    e.preventDefault()
    console.log('Proposal Amount', this.state.proposalAmount)
    MultiSig.submitproposal(this.state.proposalAmount).then((response) => {
      console.log(response);
      this.setState({lastTransaction : response.tx});
      this.initializeContract();
    });
  }

  handleApprovalAddress(event) {
    this.setState({acceptaddress: event.target.value});
  }

  handleRejectAddress(event) {
    this.setState({rejectaddress: event.target.value});
  }

  approveProposal(e) {
    e.preventDefault()
    console.log('Proposal Address', this.state.acceptaddress)
    MultiSig.approve(this.state.acceptaddress).then((response) => {
      this.setState({lastTransaction : response.tx});
      console.log(response);
    });
  }

  rejectProposal(e) {
    e.preventDefault()
    console.log('Proposal Address', this.state.rejectaddress)
    MultiSig.reject(this.state.rejectaddress).then((response) => {
      this.setState({lastTransaction : response.tx});
      console.log(response);      
    });
  }

  withdrawProposalAmount(event) {
    this.setState({amountToWithdraw: event.target.value});
  }
  
  withdrawProposal(e) {
    e.preventDefault()
    console.log('Withdraw Proposal Amount', this.state.amountToWithdraw)
    MultiSig.withdraw(this.state.amountToWithdraw).then((response) => {
      console.log("Withdraw Response-"+ response);
      this.setState({lastTransaction : response.tx});
      console.log(response);      
    });
  }

  walletevents(err,ev) {
    console.log(ev);
    this.state.events.push(ev);
    this.setState({events : this.state.events});
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">MULTISIG WALLET CROWD FUND</a>
        </nav>

        <main className="container">
            <p>Contract Owner -  {this.state.contractOwner}</p>   
               
            <p> Contract Status - {this.state.contractStatus} </p>         
            <p> Contract Total Contribution - {this.state.contractbalance} </p>
            {/* <p> Contract Eth Balance - {this.state.contractEthBalance} </p>         */}
            <p> Last Transacton hash - {this.state.lastTransaction} </p>
            <p>All values are in ETHER</p>
        </main>
        
          { this.state.contractStatus!="Active" ? <div ><form onSubmit={this.contribute}>
            <label>
            Contribution Amount:
              <input type="text" value={this.state.value} onChange={this.handleContributeChange} />
            </label>      
            <input type="submit" value="Contribute" />
            </form> <Button bsStyle="primary" onClick={this.endContributionPeriod}>End Contribution</Button> </div> : 
            
            <div >
              <form onSubmit={this.submitProposal}>
                <label>
                  Proposal Amount:
                <input type="text" value={this.state.value} onChange={this.handleProposalAmountChange} />
                </label>      
                <input type="submit" value="Submit Proposal" />
              </form>   
              <ul>
                <h1>Open Proposals</h1>
                {this.state.proposals.map(proposal => <li key={proposal.address}>{proposal.address} - {proposal.value}</li> )}
              </ul>                
              <form onSubmit={this.approveProposal}>
                <h2>Approve or Reject</h2>
                <label>
                  Approve Proposal:
                <input type="text" value={this.state.value} onChange={this.handleApprovalAddress} />
                </label>      
                <input type="submit" value="Approve Proposal" />
              </form>   
              <form onSubmit={this.rejectProposal}>
                <label>
                  Reject Proposal:
                <input type="text" value={this.state.value} onChange={this.handleRejectAddress} />
                </label>      
                <input type="submit" value="Reject Proposal" />
              </form>   
              <form onSubmit={this.withdrawProposal}>
                <label>
                  Withdraw Proposal:
                <input type="text" value={this.state.value} onChange={this.withdrawProposalAmount} />
                </label>      
                <input type="submit" value="Withdraw Proposal" />
              </form>  
            </div> 
  
  }            
      
      <ul>
      <h1>Contributions</h1>
      {this.state.contributors.map(contributor => <li key={contributor.address}>{contributor.address} - {contributor.contribution}</li> )}
    </ul>   
    <h1>Events Emitted</h1>
    <ul>{this.state.events.map(event => <li key={event.transactionHash}>{event.event}</li>)}</ul>    
      </div>
    )
  }
}

export default App
