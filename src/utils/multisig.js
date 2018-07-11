import contract from 'truffle-contract'
import MultiSigContract from '../../build/contracts/MultiSig.json'

const MultiSig = {

  contract: null,

  instance: null,

  web3 : null,

  init: function (web3) {
    let self = this
    self.web3 = web3

    return new Promise(function (resolve, reject) {
      self.contract = contract(MultiSigContract)
    //   self.contract.setProvider(window.web3.currentProvider)
    self.contract.setProvider(self.web3.currentProvider)  
      self.contract.deployed().then(instance => {
        self.instance = instance
        resolve(instance)
      }).catch(err => {
        reject(err)
      })
    })
  },

  isSigner: function (address) {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.signersList.call(
         address
       ).then(signer => {
         resolve(signer)
       }).catch(err => {
         reject(err)
       })
    })
  },

  
  getAllSigners: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.signers.call().then(signers => {
        resolve(signers)
      }).catch(err => {
        reject(err)
      })
    })
  },

  getContractAddress: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.owner.call().then(signers => {
        resolve(signers)
      }).catch(err => {
        reject(err)
      })
    })
  },

  getContributers: function () {
    let self = this    
    return new Promise((resolve, reject) => {
      self.instance.listContributors.call().then(contributors => {
        resolve(contributors)
      }).catch(err => {
        reject(err)
      })
    })
  },

  listOpenProposals: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.listOpenBeneficiariesProposals.call().then(signers => {
        resolve(signers)
      }).catch(err => {
        reject(err)
      })
    })
  },

  contractowner: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.owner.call().then(signers => {
        resolve(signers)
      }).catch(err => {
        reject(err)
      })
    })
  },

  contractBalance: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.getBalance.call().then(balance => {
        console.log(self.web3.fromWei(balance, "ether").c[0]);
        resolve(self.web3.fromWei(balance, "ether").c[0])
      }).catch(err => {
        reject(err)
      })
    })
  },


  getContributorAmount: function (address) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.getContributorAmount.call(address).then(contributionAmount => {          
        resolve({address: address, amt: self.web3.fromWei(contributionAmount, "ether").c[0]})
      }).catch(err => {
        reject(err)
      })
    })
  },

  getTotalContributions: function (address) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.getTotalContributions.call().then(balance => {        
        resolve(self.web3.fromWei(balance, "ether").c[0])
      }).catch(err => {
        reject(err)
      })
    })
  },

  contributersBalance: function (address) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.contributers_balance.call(address).then(signers => {
        resolve(signers)
      }).catch(err => {
        reject(err)
      })
    })
  },

  getProposal: function (address) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.getBeneficiaryProposal.call(address).then(proposalValue => {        
        resolve({address: address, value: self.web3.fromWei(proposalValue, "ether").c[0]})
      }).catch(err => {
        reject(err)
      })
    })
  },

  getProposalstruct: function (address) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.proposals.call(address).then(p => {
        resolve(p)
      }).catch(err => {
        reject(err)
      })
    })
  },

  withdraw: function (amt) {
    let self = this
    console.log("Amount to withdraw-"+ amt);
    return new Promise((resolve, reject) => {
      self.instance.withdraw(self.web3.toWei(amt, "ether"), {from: window.web3.eth.accounts[0]}).then(p => {
        console.log("Withdraw Resolved");
        resolve(p)
      }).catch(err => {
        reject(err)
      })
    })
  },

  endContributionPeriod: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.endContributionPeriod({from: window.web3.eth.accounts[0]}).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  listenevents: function (callme) {
    let self = this
    var events = self.instance.allEvents({fromBlock: 0, toBlock: 'latest'})
    events.watch(function (err, ev) {
      callme(err, ev)
    })
  },

  contribute: function (amount) {
    let self = this
    console.log(this.web3.eth.accounts[0]);
    console.log("amount to contribute- "+amount);
    return self.instance.sendTransaction({from: self.web3.eth.accounts[0], value: self.web3.toWei(amount, "ether")})
  },

  approve: function (address) {
    let self = this

    return self.instance.approve(address, {from: window.web3.eth.accounts[0]})
  },

  submitproposal: function (value) {
    let self = this

    return self.instance.submitProposal(self.web3.toWei(value, "ether"), {from: window.web3.eth.accounts[0]})
  },

  reject: function (address) {
    let self = this

    return self.instance.reject(address, {from: window.web3.eth.accounts[0]})
  },

  getContractStatus: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.getContractStatus.call(
        // address || window.web3.eth.defaultAccount,
        //{from: window.web3.eth.accounts[0]}
      ).then(exists => {
        resolve(exists)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default MultiSig
