//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract Wallet {
  address[] public approvers;
  uint256 public quorum;
  struct Transfer {
    uint256 id;
    uint256 amount;
    address payable to;
    uint256 approvals;
    bool sent;
  }
  Transfer[] public transfers;
  mapping(address => mapping(uint256 => bool)) public approvals;

  constructor(address[] memory _approvers, uint256 _quorum) {
    approvers = _approvers;
    quorum = _quorum;
  }

  function getApprovers() external view returns (address[] memory) {
    return approvers;
  }

  function getTransfers() external view returns (Transfer[] memory) {
    return transfers;
  }

  function createTransfer(uint256 _amount, address payable _to) external onlyApprover {
    transfers.push(Transfer(transfers.length, _amount, _to, 0, false));
  }

  function approveTransfer(uint256 _id) external onlyApprover {
    require(transfers[_id].sent == false, "transfer already sent");
    require(approvals[msg.sender][_id] == false, "already signed");

    approvals[msg.sender][_id] = true;
    transfers[_id].approvals++;

    if (transfers[_id].approvals >= quorum) {
      transfers[_id].sent = true;

      transfers[_id].to.transfer(transfers[_id].amount);
    }
  }

  receive() external payable {}

  modifier onlyApprover() {
    bool allowed = false;
    for(uint i = 0; i < approvers.length; i++) {
      if(approvers[i] == msg.sender) {
        allowed = true;
      }
    }
    require(allowed == true, "only approver allowed");
    _;
  }
}
