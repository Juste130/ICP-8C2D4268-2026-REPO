# Project 2: Simple Smart Contract

## 📋 Overview
A simple bank/savings smart contract deployed on Polygon Mumbai testnet.

## 🔗 Contract Information
- **Network**: Polygon Amoy Testnet
- **Address**: `0xd70946Fb2e7e180904cD5dB34C1CcEFc739bF03D`
- **Deployer**: `0x8d4f7cc817598278326AB17990e9cD8b70714Df5`
- **Polygonscan**: https://amoy.polygonscan.com/address/0xd70946Fb2e7e180904cD5dB34C1CcEFc739bF03D

## 🎯 Functions

### Public Functions
| Function | Parameters | Description |
|----------|------------|-------------|
| `deposit()` | (payable) | Deposit MATIC to your account |
| `withdraw(uint256)` | amount in wei | Withdraw funds |
| `transfer(address, uint256)` | to, amount | Send to other user |

### View Functions
| Function | Returns |
|----------|---------|
| `getBallance()` | Own balance |
| `getAccountBalance()` | Balance of an account |
| `getAllUsers()` | List of all depositors |
| `getTotalUsers()` | Number of users |
| `getContractBalance()` | Contract's total MATIC |

### Admin Functions (only owner)
| Function | Description |
|----------|-------------|
| `getAccountBalance()` | See Balance of an account |
| `getAllUsers()` | See List of all depositors |
| `getTotalUsers()` | Have Number of users |
| `getContractBalance()` | Have Contract's total MATIC |
