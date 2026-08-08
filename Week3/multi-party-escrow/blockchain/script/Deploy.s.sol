// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/MultiPartyEscrow.sol";

contract DeployScript is Script {
    function run() external returns (MultiPartyEscrow) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        MultiPartyEscrow escrow = new MultiPartyEscrow();
        console.log("MultiPartyEscrow deployed at:", address(escrow));
        
        vm.stopBroadcast();
        return escrow;
    }
}