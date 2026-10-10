// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {LinkPayr} from "../contracts/LinkPayr.sol";

contract LinkPayrTest is Test {
    LinkPayr internal linkPayr;
    address payable internal recipient = payable(address(0xBEEF));
    address internal payer = address(0xCAFE);
    bytes32 internal id = keccak256("linkpayr-test");

    function setUp() public {
        linkPayr = new LinkPayr();
        vm.deal(payer, 10 ether);
    }

    function testCreateAndPayRequest() public {
        linkPayr.createPaymentLink(id, recipient, 1 ether, "Dinner");

        vm.prank(payer);
        linkPayr.pay{value: 1 ether}(id);

        LinkPayr.PaymentLink memory link = linkPayr.getPaymentLink(id);
        assertEq(uint8(link.status), uint8(LinkPayr.Status.Paid));
        assertEq(link.payer, payer);
        assertEq(recipient.balance, 1 ether);
    }

    function testRejectsWrongAmount() public {
        linkPayr.createPaymentLink(id, recipient, 1 ether, "Dinner");
        vm.prank(payer);
        vm.expectRevert(LinkPayr.IncorrectPayment.selector);
        linkPayr.pay{value: 0.5 ether}(id);
    }

    function testRecipientCanCancel() public {
        linkPayr.createPaymentLink(id, recipient, 1 ether, "Dinner");
        vm.prank(recipient);
        linkPayr.cancel(id);
        assertEq(uint8(linkPayr.getPaymentLink(id).status), uint8(LinkPayr.Status.Cancelled));
    }

    function testCannotPayTwice() public {
        linkPayr.createPaymentLink(id, recipient, 1 ether, "Dinner");
        vm.startPrank(payer);
        linkPayr.pay{value: 1 ether}(id);
        vm.expectRevert(LinkPayr.LinkNotOpen.selector);
        linkPayr.pay{value: 1 ether}(id);
        vm.stopPrank();
    }
}
