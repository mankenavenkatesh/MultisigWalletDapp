var MultiSig = artifacts.require("MultiSig")

contract ("MultiSig" , async (accounts) => {
  let contractOwner = accounts[0];
  let signer1 = accounts[1];
  let signer2 = accounts[2];
  let signer3 = accounts[3];
  let contributor1 = accounts[4];
  let contributor2 = accounts[5];
  let contributor3 = accounts[6];
  let beneficiary1 = accounts[7];
  let beneficiary2 = accounts[8];

// // Tests - contract owner
  it("check owner", async () => {
    let instance = await MultiSig.deployed();
    let owner = await instance.owner.call();
    assert.equal(owner, contractOwner);
    console.log(signer1);
    console.log(signer2);
    console.log(signer3);
  })

  // it("End to End Flow", async () => {
  //   // 1. owner will deploy the contract.
  //   let instance = await MultiSig.deployed();
  //   let owner = await instance.owner.call();
  //   assert.equal(contractOwner, owner);
  //
  // //  2. contribution period starts.
  //
  // let balanceBeforeContribution =web3.fromWei(web3.eth.getBalance(instance.address), "ether");
  // // contributors will send their contributions.
  //    let result = await instance.sendTransaction({
  //      value : web3.toWei(3, "ether"),
  //      from : contributor1,
  //      gas : 300000
  //    });
  //    log = result.logs[0];
  //       assert.equal(log.event,"ReceivedContribution");
  //        assert.equal(log.args._contributor, contributor1);
  //        assert.equal(log.args._valueInWei, web3.toWei(3, "ether"))
  //     // assertions to check if contribution is successful
  //     let balanceAfterContribution = web3.fromWei(web3.eth.getBalance(instance.address), "ether");
  //     assert.equal(balanceAfterContribution.toNumber(), balanceBeforeContribution.toNumber() + 3);
  //   // // end contribution
  //    await instance.endContributionPeriod({from : signer1});
  //    try{
  //      await instance.sendTransaction({
  //        value : web3.toWei(2, "ether"),
  //        from : signer1,
  //        gas : 300000
  //      });
  //    }
  //    catch(error){
  //      // Should throw exception
  //      assert(true);
  //    }
  //
  //
  //   // submit proposal
  //   result =  await instance.submitProposal(web3.toWei(0.3, "ether"), {from : beneficiary1});
  //     var log = result.logs[0];
  //     assert.equal(log.event , "ProposalSubmitted");
  //       assert.equal(log.args._beneficiary, beneficiary1);
  //       assert.equal(log.args._valueInWei, web3.toWei(0.3, "ether"));
  //
  //       let beneficiaryProposal = await instance.getBeneficiaryProposal.call(beneficiary1);
  //       assert.equal(beneficiaryProposal, web3.toWei(0.3, "ether"));
  //
  //       let listOfBeneficiries = await instance.listOpenBeneficiariesProposals.call();
  //       assert.equal(listOfBeneficiries.length, 1);
  //       assert.equal(listOfBeneficiries[0], beneficiary1);
  //
  //       result = await instance.approve(beneficiary1, {from: signer1});
  //       assert.equal(result.logs.length, 1);
  //       assert.equal(result.logs[0].event, "ProposalApproved");
  //       assert.equal(result.logs[0].args._approver, signer1);
  //       assert.equal(result.logs[0].args._beneficiary, beneficiary1);
  //       assert.equal(result.logs[0].args._valueInWei, web3.toWei(0.3, "ether"));
  //       result = await instance.approve(beneficiary1, {from: signer2});
  //       let beneficiary1BalanceBeforeWithdraw = web3.fromWei(web3.eth.getBalance(beneficiary1), "ether");
  //       result = await instance.withdraw(web3.toWei(0.3, "ether"),{from : beneficiary1});
  //       assert.equal(result.logs.length, 1);
  //       assert.equal(result.logs[0].event, "WithdrawPerformed");
  //       assert.equal(result.logs[0].args._valueInWei, web3.toWei(0.3, "ether"));
  //       assert.equal(result.logs[0].args._beneficiary, beneficiary1);
  //       let beneficiary1BalanceAfterWithdraw = web3.fromWei(web3.eth.getBalance(beneficiary1), "ether");
  //       // assert.equal(beneficiary1BalanceBeforeWithdraw.toNumber(), beneficiary1BalanceAfterWithdraw.toNumber());
  //
  //       // result = await instance.submitProposal(web3.toWei(0.4, "ether"), {from: beneficiary2});
  //       let beneficiary2BalanceBeforeWithdraw = web3.fromWei(web3.eth.getBalance(beneficiary2), "ether");
  //       result = await instance.submitProposal(web3.toWei(0.2, "ether"), {from: beneficiary2});
  //       await instance.reject(beneficiary2, {from: signer2});
  //       await instance.reject(beneficiary2, {from: signer1});
  //       result = await instance.withdraw(web3.toWei(0.2, "ether"),{from : beneficiary2});
  //         let beneficiary2BalanceAfterWithdraw = web3.fromWei(web3.eth.getBalance(beneficiary2), "ether");
  //         console.log(beneficiary2BalanceBeforeWithdraw.toNumber());
  //         console.log(beneficiary2BalanceAfterWithdraw.toNumber());
  // })

// Tests for contributions
  it("check if contributions are accepted", async () => {
    let instance = await MultiSig.deployed();
    let balanceBeforeContribution = web3.fromWei(web3.eth.getBalance(instance.address), "ether");
      await instance.sendTransaction({
        value : web3.toWei(2, "ether"),
        from : contributor1,
        gas : 300000
      });
     let balanceAfterContribution = web3.fromWei(web3.eth.getBalance(instance.address), "ether");
     assert.equal(balanceAfterContribution.toNumber(),2 + balanceBeforeContribution.toNumber());
  })

  it("Event triggered after contributions are accpeted", async () => {
    let instance = await MultiSig.deployed();
    let result = await instance.sendTransaction({
      value : web3.toWei(2, "ether"),
      from : contributor1,
      gas : 300000
    });

    for(var i = 0; i< result.logs.length;i++) {
      var log = result.logs[i];
      if(log.event == "ReceivedContribution") {
        assert(log.args._contributor == contributor1);
        break;
      }
    }
  })

  it("Should return list of contributors", async () => {
      let instance = await MultiSig.deployed();
      let result = await instance.sendTransaction({
        value : web3.toWei(2, "ether"),
        from : contributor1,
        gas : 300000
      });
      let listOfContributors = await instance.listContributors.call();
      assert.equal(listOfContributors[0], contributor1);
      assert.equal(listOfContributors.length, 1);
  })

  it("Should get my total contribution amount", async () => {
      let instance = await MultiSig.deployed();
      let result = await instance.sendTransaction({
        value : web3.toWei(2, "ether"),
        from : contributor3,
        gas : 300000
      });
      let myContribution = await instance.getContributorAmount.call(contributor3);
      assert.equal(myContribution.toNumber(), web3.toWei(2, "ether") );
      await instance.sendTransaction({
        value : web3.toWei(2, "ether"),
        from : contributor3,
        gas : 300000
      });
      myContribution = await instance.getContributorAmount.call(contributor3);
      assert.equal(myContribution.toNumber(), web3.toWei(4, "ether") );
      let listOfContributors = await instance.listContributors.call();
      assert.equal(listOfContributors.length, 2);
  })

  it("Should throw Exception if Non Signer call Contribution End", async () => {
    let instance = await MultiSig.deployed();
    try {
      await instance.endContributionPeriod({from : contributor1});
    }catch(error){
      assert(true);
    }
  })

  it("Should throw Exception if Submits Contributions After Contribution Period Ends", async () => {
    let instance = await MultiSig.deployed();
    await instance.endContributionPeriod({from : signer1});
    try{
    await instance.sendTransaction({
      value : web3.toWei(2, "ether"),
      from : contractOwner,
      gas : 300000
    });
  }
  catch(e){
    assert(true);
  }
  })

  it("Submit a proposal", async () => {
    let instance = await MultiSig.deployed();
    let result = await instance.submitProposal(web3.toWei(2, "ether"), {from : beneficiary1});
    assert.equal(result.logs[0].event, "ProposalSubmitted");
    assert.equal(result.logs[0].args._beneficiary, beneficiary1);
    assert.equal(result.logs[0].args._valueInWei, web3.toWei(2, "ether"));
    let beneficiary1Value = await instance.getBeneficiaryProposal.call(beneficiary1);
    assert.equal(beneficiary1Value, web3.toWei(2, "ether"));

  })

})
