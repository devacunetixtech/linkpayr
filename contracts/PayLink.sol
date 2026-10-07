// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title PayLink
/// @notice Create and settle fixed-value BOT payment links on-chain.
contract PayLink {
    enum Status { Open, Paid, Cancelled }

    struct PaymentLink {
        bytes32 id;
        address payable recipient;
        uint256 amount;
        string description;
        Status status;
        address payer;
        uint64 createdAt;
        uint64 paidAt;
    }

    error LinkAlreadyExists();
    error LinkNotFound();
    error InvalidAmount();
    error InvalidRecipient();
    error LinkNotOpen();
    error IncorrectPayment();
    error Unauthorized();
    error TransferFailed();

    mapping(bytes32 => PaymentLink) private links;
    mapping(address => bytes32[]) private createdBy;
    mapping(address => bytes32[]) private paidBy;

    event PaymentLinkCreated(
        bytes32 indexed id,
        address indexed recipient,
        uint256 amount,
        string description
    );
    event PaymentCompleted(bytes32 indexed id, address indexed payer, address indexed recipient, uint256 amount);
    event PaymentLinkCancelled(bytes32 indexed id, address indexed recipient);

    function createPaymentLink(
        bytes32 id,
        address payable recipient,
        uint256 amount,
        string calldata description
    ) external {
        if (recipient == address(0)) revert InvalidRecipient();
        if (amount == 0) revert InvalidAmount();
        if (links[id].recipient != address(0)) revert LinkAlreadyExists();

        links[id] = PaymentLink({
            id: id,
            recipient: recipient,
            amount: amount,
            description: description,
            status: Status.Open,
            payer: address(0),
            createdAt: uint64(block.timestamp),
            paidAt: 0
        });
        createdBy[recipient].push(id);
        emit PaymentLinkCreated(id, recipient, amount, description);
    }

    function pay(bytes32 id) external payable {
        PaymentLink storage paymentLink = links[id];
        if (paymentLink.recipient == address(0)) revert LinkNotFound();
        if (paymentLink.status != Status.Open) revert LinkNotOpen();
        if (msg.value != paymentLink.amount) revert IncorrectPayment();

        paymentLink.status = Status.Paid;
        paymentLink.payer = msg.sender;
        paymentLink.paidAt = uint64(block.timestamp);
        paidBy[msg.sender].push(id);

        (bool sent,) = paymentLink.recipient.call{value: msg.value}("");
        if (!sent) revert TransferFailed();

        emit PaymentCompleted(id, msg.sender, paymentLink.recipient, msg.value);
    }

    function cancel(bytes32 id) external {
        PaymentLink storage paymentLink = links[id];
        if (paymentLink.recipient == address(0)) revert LinkNotFound();
        if (msg.sender != paymentLink.recipient) revert Unauthorized();
        if (paymentLink.status != Status.Open) revert LinkNotOpen();
        paymentLink.status = Status.Cancelled;
        emit PaymentLinkCancelled(id, msg.sender);
    }

    function getPaymentLink(bytes32 id) external view returns (PaymentLink memory) {
        if (links[id].recipient == address(0)) revert LinkNotFound();
        return links[id];
    }

    function getCreatedLinks(address account) external view returns (bytes32[] memory) {
        return createdBy[account];
    }

    function getPaidLinks(address account) external view returns (bytes32[] memory) {
        return paidBy[account];
    }
}
