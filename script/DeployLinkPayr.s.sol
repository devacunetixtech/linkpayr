// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {LinkPayr} from "../contracts/LinkPayr.sol";

contract DeployLinkPayr is Script {
    function run() external returns (LinkPayr linkPayr) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);
        linkPayr = new LinkPayr();
        vm.stopBroadcast();
    }
}
