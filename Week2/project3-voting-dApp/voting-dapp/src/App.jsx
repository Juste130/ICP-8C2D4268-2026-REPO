import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import VotingABI from './contracts/VotingABI.json';
import './App.css';

// À remplacer par l'adresse de ton contrat déployé
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

function App() {
  // ============================================
  // ÉTATS
  // ============================================
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [newCandidate, setNewCandidate] = useState('');
  const [votingOpen, setVotingOpen] = useState(true);

  // ============================================
  // CONNEXION MÉTAMASK
  // ============================================
  const connectWallet = async () => {
    try {
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        alert('Veuillez installer MetaMask !');
        return;
      }

      await provider.request({ method: 'eth_requestAccounts' });
      const chainId = await provider.request({ method: 'eth_chainId' });
      if (chainId !== '0x13882') {
        try {
          // Demande à MetaMask de basculer sur le réseau Amoy
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13882' }],
          });
        } catch (switchError) {
          // L'erreur 4902 indique que le réseau n'est pas ajouté dans MetaMask
          if (switchError.code === 4902) {
            try {
              await provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x13882',
                    chainName: 'Polygon Amoy Testnet',
                    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                    rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                    blockExplorerUrls: ['https://amoy.polygonscan.com/']
                  }
                ],
              });
            } catch (addError) {
              alert('Vous devez ajouter et basculer sur le réseau Amoy (0x13882) pour continuer.');
              return;
            }
          } else {
            alert('Veuillez basculer MetaMask sur le réseau Amoy (0x13882) avant de continuer.');
            return;
          }
        }
      }

      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      
      if (!CONTRACT_ADDRESS) {
        alert('Adresse du contrat introuvable. Vérifiez votre fichier .env.');
        return;
      }

      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        VotingABI,
        signer
      );

      setContract(contractInstance);
      setAccount(address);
      
      // Vérifier si le propriétaire
      const owner = await contractInstance.i_owner();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
      
      // Charger les données
      await loadData(contractInstance, address);
      
    } catch (error) {
      console.error('Error connecting:', error);
      alert('Erreur de connexion à MetaMask : ' + (error.message || 'Erreur inconnue'));
    }
  };

  // ============================================
  // CHARGER LES DONNÉES
  // ============================================
  const loadData = async (contractInstance, accountAddress) => {
    try {
      setLoading(true);
      
      // Récupérer les candidats
      const candidatesList = await contractInstance.getAllCandidates();
      setCandidates(candidatesList);
      
      // Vérifier si l'utilisateur a voté
      if (accountAddress) {
        const hasVoted = await contractInstance.hasVoted(accountAddress);
        setVoted(hasVoted);
      }
      
      // Vérifier si le vote est ouvert
      const isOpen = await contractInstance.votingOpen();
      setVotingOpen(isOpen);
      
      // Récupérer le gagnant (si le vote est fermé)
      if (!isOpen) {
        try {
          const [winnerName, winnerVotes] = await contractInstance.getWinner();
          if (winnerVotes > 0) {
            setWinner({ name: winnerName, votes: winnerVotes });
          }
        } catch (e) {
          // Pas de gagnant encore
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  // ============================================
  // VOTER
  // ============================================
  const handleVote = async (candidateId) => {
    if (!contract || voted || !votingOpen) return;
    
    try {
      const tx = await contract.vote(candidateId);
      await tx.wait();
      
      // Recharger les données
      await loadData(contract);
      alert('✅ Vote cast successfully!');
      
    } catch (error) {
      console.error('Error voting:', error);
      alert('❌ Error casting vote: ' + error.message);
    }
  };

  // ============================================
  // AJOUTER UN CANDIDAT (admin)
  // ============================================
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!contract || !isOwner || !newCandidate.trim()) return;
    
    try {
      const tx = await contract.addCandidate(newCandidate.trim());
      await tx.wait();
      
      setNewCandidate('');
      await loadData(contract);
      alert('✅ Candidate added successfully!');
      
    } catch (error) {
      console.error('Error adding candidate:', error);
      alert('❌ Error adding candidate');
    }
  };

  // ============================================
  // CHANGER STATUT DU VOTE (admin)
  // ============================================
  const toggleVotingStatus = async () => {
    if (!contract || !isOwner) return;
    
    try {
      const tx = await contract.setVotingStatus(!votingOpen);
      await tx.wait();
      
      setVotingOpen(!votingOpen);
      await loadData(contract);
      alert(`✅ Voting ${!votingOpen ? 'opened' : 'closed'}!`);
      
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('❌ Error changing voting status');
    }
  };

  // ============================================
  // RENDU
  // ============================================
  
  if (!account) {
    return (
      <div className="app">
        <header className="header">
          <h1>🗳️ Decentralized Voting</h1>
        </header>
        <div className="connect-container">
          <button onClick={connectWallet} className="btn-connect">
            Connect MetaMask
          </button>
          <p className="info-text">Please connect your wallet to vote</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <h1>🗳️ Decentralized Voting</h1>
        </header>
        <div className="loading">Loading blockchain data...</div>
      </div>
    );
  }

  // Calcul du total des votes
  const totalVotes = candidates.reduce((sum, c) => sum + Number(c.voteCount), 0);

  return (
    <div className="app">
      <header className="header">
        <h1>🗳️ Decentralized Voting</h1>
        <div className="wallet-info">
          <span className="address">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          {isOwner && <span className="badge">👑 Owner</span>}
          <span className={`status-badge ${votingOpen ? 'open' : 'closed'}`}>
            {votingOpen ? '🟢 Open' : '🔴 Closed'}
          </span>
        </div>
      </header>

      <div className="container">
        {/* Admin Panel */}
        {isOwner && (
          <div className="admin-panel">
            <h3>👑 Admin Panel</h3>
            <form onSubmit={handleAddCandidate} className="add-candidate">
              <input
                type="text"
                value={newCandidate}
                onChange={(e) => setNewCandidate(e.target.value)}
                placeholder="Add new candidate..."
                className="input-field"
              />
              <button type="submit" className="btn-admin">
                Add Candidate
              </button>
            </form>
            <button onClick={toggleVotingStatus} className="btn-admin">
              {votingOpen ? '🔒 Close Voting' : '🔓 Open Voting'}
            </button>
          </div>
        )}

        {/* Winner Display */}
        {winner && (
          <div className="winner-card">
            <h2>🏆 Winner</h2>
            <p className="winner-name">{winner.name}</p>
            <p className="winner-votes">{winner.votes.toString()} votes</p>
          </div>
        )}

        {/* Candidates List */}
        <div className="candidates-section">
          <h3>📋 Candidates</h3>
          <div className="candidates-list">
            {candidates.length === 0 ? (
              <p className="no-candidates">No candidates yet. Add some!</p>
            ) : (
              candidates.map((candidate) => (
                <div key={candidate.id} className="candidate-card">
                  <div className="candidate-info">
                    <h4>{candidate.name}</h4>
                    <p className="vote-count">Votes: {candidate.voteCount.toString()}</p>
                  </div>
                  <button
                    onClick={() => handleVote(candidate.id)}
                    disabled={voted || !votingOpen}
                    className="btn-vote"
                  >
                    {voted ? '✅ Voted' : !votingOpen ? '🔒 Closed' : '🗳️ Vote'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total Candidates</span>
            <span className="stat-value">{candidates.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Votes</span>
            <span className="stat-value">{totalVotes}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Your Status</span>
            <span className={`stat-value ${voted ? 'voted' : 'not-voted'}`}>
              {voted ? '✅ Voted' : '⏳ Not voted'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;