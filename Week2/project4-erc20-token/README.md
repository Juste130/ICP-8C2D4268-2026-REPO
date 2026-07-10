# 🪙 ERC-20 Token - Custom Token Smart Contract

A custom ERC-20 token built with Solidity, Hardhat, and OpenZeppelin, deployed on the Polygon Amoy testnet.

---

## 📋 Project Overview

**Project**: Custom ERC-20 Token  
**Type**: Smart Contract / Token  
**Network**: Polygon Amoy (Testnet)  
**Status**: ✅ Complete

---

## 🎯 Problem & Solution

**Problem**: Creating a secure and standard ERC-20 token usually requires writing a lot of boilerplate and handling ownership and minting logic carefully.

**Solution**: This project provides a simple, auditable ERC-20 token contract with:
- an initial supply minted to the deployer
- owner-controlled minting
- token burning by the holder
- automated testing and deployment scripts

---

## ✨ Features

- 🪙 Standard ERC-20 implementation using OpenZeppelin
- 🔐 Owner-only minting function
- 🔥 Burn function for token holders
- 🧪 Automated Hardhat tests
- 🚀 Deployment scripts for local and Amoy networks

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Smart Contract** | Solidity 0.8.28 |
| **Token Standard** | ERC-20 |
| **Library** | OpenZeppelin Contracts |
| **Blockchain** | Polygon Amoy Testnet |
| **Development Tool** | Hardhat |
| **Testing** | Chai + Hardhat |
| **Deployment** | Hardhat scripts |

---

## 📜 Smart Contract

### Deployment Details

| Field | Value |
|-------|-------|
| **Network** | Polygon Amoy |
| **Contract Name** | `ERC20Token` |
| **Explorer** | [Polygonscan Amoy](https://amoy.polygonscan.com/) |
| **Contract Address** | 0x6D5723C1B387C772dA716A17bF5f0d5660a0C0c8 |

### Key Functions

```solidity
constructor()
function mint(address _to, uint256 _amount) external onlyOwner
function burn(uint256 _amount) external
```

---

## ▶️ How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Compile the contract

```bash
npm run compile
```

### 3. Run tests

```bash
npm run test
```

### 4. Deploy on local Hardhat network

```bash
npm run deploy:local
```

### 5. Deploy on Polygon Amoy

```bash
npm run deploy:amoy
```

### 6. Interact with the deployed contract

```bash
npm run interact:amoy -- --address <CONTRACT_ADDRESS>
```

### 7. Verify the contract on Amoy

```bash
npm run verify:amoy -- --address <CONTRACT_ADDRESS>
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with:

```env
PRIVATE_KEY=your_wallet_private_key
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

> Use a test wallet only. Never share your private key.

