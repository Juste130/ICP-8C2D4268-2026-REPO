// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MultiPartyEscrow is ReentrancyGuard {
    
    enum State { Active, Successful, Failed, Refunded }
    
    struct Project {
        address owner;
        uint256 goal;
        uint256 deadline;
        uint256 totalFunded;
        State state;
    }
    
    uint256 public projectCount;
    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    
    event ProjectCreated(uint256 id, address owner, uint256 goal, uint256 deadline);
    event Contributed(uint256 id, address contributor, uint256 amount);
    event FundsReleased(uint256 id, uint256 amount);
    event Refunded(uint256 id, address contributor, uint256 amount);
    
    function createProject(uint256 _goal, uint256 _duration) external {
        require(_goal > 0, "Goal must be > 0");
        projectCount++;
        projects[projectCount] = Project({
            owner: msg.sender,
            goal: _goal,
            deadline: block.timestamp + _duration,
            totalFunded: 0,
            state: State.Active
        });
        emit ProjectCreated(projectCount, msg.sender, _goal, block.timestamp + _duration);
    }
    
    function contribute(uint256 _projectId) external payable nonReentrant {
        Project storage p = projects[_projectId];
        require(p.state == State.Active, "Not active");
        require(block.timestamp < p.deadline, "Deadline passed");
        require(msg.value > 0, "Must send ETH");
        
        contributions[_projectId][msg.sender] += msg.value;
        p.totalFunded += msg.value;
        
        emit Contributed(_projectId, msg.sender, msg.value);
    }
    
    function releaseFunds(uint256 _projectId) external nonReentrant {
        Project storage p = projects[_projectId];
        require(msg.sender == p.owner, "Only owner");
        require(p.totalFunded >= p.goal, "Goal not reached");
        require(p.state == State.Active, "Not active");
        
        p.state = State.Successful;
        (bool success, ) = payable(p.owner).call{value: p.totalFunded}("");
        require(success, "Transfer failed");
        
        emit FundsReleased(_projectId, p.totalFunded);
    }
    
    function refund(uint256 _projectId) external nonReentrant {
        Project storage p = projects[_projectId];
        require(block.timestamp > p.deadline, "Deadline not passed");
        require(p.totalFunded < p.goal, "Goal reached");
        require(p.state == State.Active, "Not active");
        
        uint256 amount = contributions[_projectId][msg.sender];
        require(amount > 0, "No contribution");
        
        contributions[_projectId][msg.sender] = 0;
        p.state = State.Refunded;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund failed");
        
        emit Refunded(_projectId, msg.sender, amount);
    }
    
    function checkProject(uint256 _projectId) external view returns (Project memory) {
        return projects[_projectId];
    }
}