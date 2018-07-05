pragma solidity ^0.4.20;
/* import "../homework/Abs" */
contract MultiSig {
  using SafeMath for uint256;

  // Variables
  address private contractOwner;
  bool private isContractActive;
  uint private signerCount;
  uint private contributorCount;
  uint private totalContributions;
  mapping (address => uint) public contributionsMap;
  mapping (address => bool) public signerList;
  mapping (address => uint) proposals;
  address[] submittersList;
  address[] contributorsList;

  struct Proposal {
      uint valueToWithdraw;
      address[] approvedSigners;
      address[] rejectedSigners;

  }

  // Constructor
  constructor () {
    contractOwner = msg.sender;
    isContractActive = false;
    signerList[address(0x008e32781624eaa8344901ef4c013d4b1d8c8da7ce)] = true;
    signerCount = signerCount.add(1);
    signerList[address(0x0052e3c8a97cdd571c6656c96f6348ba8d4a9a0db7)] = true;
    signerCount = signerCount.add(1);
    signerList[address(0x005340c7783b6ec40c4b66f3ce1598051d776a882f)] = true;
    signerCount = signerCount.add(1);
  }

  // Events
  event ReceivedContribution(address indexed _contributor, uint _valueInWei);
  event ProposalSubmitted(address indexed _beneficiary, uint _valueInWei);

  // Modifiers
  modifier onlyifContractStatusActive() {
    require(isContractActive == true);
    _;
  }
  modifier acceptContributions() {
    require(isContractActive == false);
    _;
  }
  modifier onlySigner() {
    require(signerList[msg.sender], "You are not a signer!!");
    _;
  }
  modifier onlyIfProposalApproved() {
    require(proposals[msg.sender].approvedSigners.length > signerCount.div(2), "Your Proposal is not approved By majority of voters");
    _;
  }
  modifier onlyIfProposalRejected() {
    require(proposals[msg.sender].rejectedSigners.length > signerCount.div(2) , "Your Proposal is not rejected By majority of voters");
    _;
  }
  modifier onlyIfWithdrawPending(uint _value) {
    require(proposals[msg.sender].valueToWithdraw >= _value);
    _;
  }
  modifier onlyIfWithdrawCompleted() {
    require(proposals[msg.sender].valueToWithdraw == 0);
  }
  modifier onlyIfSubmissionValueIsAccepted(uint _value) {
    require(_value <= totalContributions.div(10));
    _;
  }
  modifier onlyIfNoExistingProposals() {
    require(proposals[msg.sender].valueToWithdraw == 0 || proposals[msg.sender].rejectedSigners.lenght > signerCount.div(2));
    _;
  }

function owner() external returns(address){
  return contractOwner;
}

function () payable acceptContributions {
  require(msg.value > 0);
   contributionsMap[msg.sender] = contributionsMap[msg.sender].add(msg.value);
   totalContributions = totalContributions.add(msg.value);
  bool alreadyExists = false;
  for(uint i = 0; i< contributorsList.length; i++){
      if(contributorsList[i] == msg.sender){
        alreadyExists = true;
      }
  }
  if(!alreadyExists){
    contributorsList.push(msg.sender);
  }
   emit ReceivedContribution(msg.sender, msg.value);
}

function endContributionPeriod() acceptContributions onlySigner external {
    require(totalContributions > 0);
    isContractActive = true;
}

function listContributors() external view returns (address[]) {
     return contributorsList;
}

function getContributorAmount(address _contributor) external view returns (uint) {
     return contributionsMap[_contributor];
}

function getContractStatus() external view returns (bool) {
     return isContractActive;
}

function getTotalContributions() external view returns (uint) {
     return totalContributions;
}

function submitProposal(uint _valueInWei) onlyIfContractStatusActive onlyIfSubmissionValueIsAccepted(_valueInWei) onlyIfNoExistingProposals external {
     proposals[msg.sender] = Proposal(_valueInWei);
     emit ProposalSubmitted(msg.sender, _valueInWei);
}



   /*
    * Returns a list of beneficiaries for the open proposals. Open
    * proposal is the one in which the majority of voters have not
    * voted yet.
    */
   /* function listOpenBeneficiariesProposals() external view returns (address[]); */

   /*
    * Returns the value requested by the given beneficiary in his proposal.
    */
   function getBeneficiaryProposal(address _beneficiary) external view returns (uint) {
     return proposals[_beneficiary];
   }

}

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}
