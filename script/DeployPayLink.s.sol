// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {PayLink} from "../contracts/PayLink.sol";

contract DeployPayLink is Script {
    function run() external returns (PayLink payLink) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);
        payLink = new PayLink();
        vm.stopBroadcast();
    }
}
