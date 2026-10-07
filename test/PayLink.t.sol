// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {PayLink} from "../contracts/PayLink.sol";

contract PayLinkTest is Test {
    PayLink internal payLink;
    address payable internal recipient = payable(address(0xBEEF));
    address internal payer = address(0xCAFE);
    bytes32 internal id = keccak256("paylink-test");

    function setUp() public {
        payLink = new PayLink();
        vm.deal(payer, 10 ether);
    }

    function testCreateAndPayLink() public {
        payLink.createPaymentLink(id, recipient, 1 ether, "Dinner");

        vm.prank(payer);
        payLink.pay{value: 1 ether}(id);

        PayLink.PaymentLink memory link = payLink.getPaymentLink(id);
        assertEq(uint8(link.status), uint8(PayLink.Status.Paid));
        assertEq(link.payer, payer);
        assertEq(recipient.balance, 1 ether);
    }

    function testRejectsWrongAmount() public {
        payLink.createPaymentLink(id, recipient, 1 ether, "Dinner");
        vm.prank(payer);
        vm.expectRevert(PayLink.IncorrectPayment.selector);
        payLink.pay{value: 0.5 ether}(id);
    }

    function testRecipientCanCancel() public {
        payLink.createPaymentLink(id, recipient, 1 ether, "Dinner");
        vm.prank(recipient);
        payLink.cancel(id);
        assertEq(uint8(payLink.getPaymentLink(id).status), uint8(PayLink.Status.Cancelled));
    }

    function testCannotPayTwice() public {
        payLink.createPaymentLink(id, recipient, 1 ether, "Dinner");
        vm.startPrank(payer);
        payLink.pay{value: 1 ether}(id);
        vm.expectRevert(PayLink.LinkNotOpen.selector);
        payLink.pay{value: 1 ether}(id);
        vm.stopPrank();
    }
}
