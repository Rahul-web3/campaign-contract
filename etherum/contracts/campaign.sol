// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaign;
    
    function createCampaign(uint minimum) public {
        address newCamp = new Campaign(minimum, msg.sender);
        deployedCampaign.push(newCamp);
    }

    function getDeployedCampaign() public view returns(address[]) {
        return deployedCampaign;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    Request[] public requests;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string descp, uint value, address recp) public restricted{
        Request memory newRequest = Request({
            description : descp,
            value : value,
            recipient : recp,
            complete : false,
            approvalCount : 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummery() public view returns (
        uint, uint, uint, uint, address
    ) {
        return(
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return( requests.length );
    }
}
