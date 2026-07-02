# 🗳️ Voting DApp - Decentralized Voting Application

A simple, transparent, and tamper-proof voting application built on the Polygon Mumbai testnet.

---

## 📋 Project Overview

**Project**: Decentralized Voting Application  
**Type**: Blockchain DApp  
**Network**: Polygon Amoy (Testnet)  
**Status**: ✅ Complete

## 🚀 Live Demo
🌐 **Vercel URL**: https://voting-dapp-five-delta.vercel.app/

---

## 🎯 Problem & Solution

**Problem**: Traditional voting systems lack transparency and can be manipulated by central authorities.

**Solution**: A blockchain-based voting system where:
- Each address can vote only once
- All votes are recorded immutably
- Results are publicly verifiable
- No central authority can alter outcomes

---

## ✨ Features

### For Voters
- 🔗 Connect MetaMask wallet
- 📋 View all candidates with their vote counts
- 🗳️ Cast a single vote (one per address)
- 📊 See real-time results
- 🏆 View winner when voting closes

### For Admin (Owner)
- ➕ Add new candidates
- 🔓 Open/Close voting
- 👁️ Full visibility of all votes

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Smart Contract** | Solidity 0.8.0 |
| **Blockchain** | Polygon Amoy Testnet |
| **Frontend** | React 18 + Vite |
| **Web3 Library** | Ethers.js 5.7 |
| **Wallet** | MetaMask |
| **Hosting** | Vercel |

---

## 📜 Smart Contract

### Deployment Details
| Field | Value |
|-------|-------|
| **Network** | Polygon Amoy |
| **Contract Address** | `0xd70946Fb2e7e180904cD5dB34C1CcEFc739bF03D` |
| **View on Polygonscan** | [Link](https://amoy.polygonscan.com/address/0xd70946Fb2e7e180904cD5dB34C1CcEFc739bF03D) |

### Key Functions
```solidity
// Admin functions
function addCandidate(string memory _name) external onlyOwner
function setVotingStatus(bool _status) external onlyOwner

// Public functions
function vote(uint256 _candidateId) external
function getAllCandidates() external view returns (Candidate[] memory)
function getWinner() external view returns (string memory, uint256)