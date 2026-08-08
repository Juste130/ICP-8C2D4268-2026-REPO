// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/MultiPartyEscrow.sol";
import "../script/Deploy.s.sol";

contract MultiPartyEscrowTest is Test {
    MultiPartyEscrow public escrow;
    address public owner = address(0x123);
    address public contributor = address(0x456);
    address public other = address(0x789);
    
    function setUp() external {
        // Financer les comptes de test
        vm.deal(owner, 10 ether);
        vm.deal(contributor, 10 ether);
        vm.deal(other, 10 ether);
        DeployScript deployer = new DeployScript();
        escrow = deployer.run();
    }
    
    function testCreateProject() public {
        vm.prank(owner);
        escrow.createProject(1 ether, 1 days);
        assertEq(escrow.projectCount(), 1);
    }
    
    function testContribute() public {
        vm.prank(owner);
        escrow.createProject(1 ether, 1 days);
        
        vm.prank(contributor);
        escrow.contribute{value: 0.5 ether}(1);
        
        assertEq(escrow.contributions(1, contributor), 0.5 ether);
    }
}