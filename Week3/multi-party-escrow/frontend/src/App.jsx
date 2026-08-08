import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';

// Deployed contract address on Sepolia
const CONTRACT_ADDRESS = '0xd70946Fb2e7e180904cD5dB34C1CcEFc739bF03D';

// 3D Animated Ethereum Coin Component
function EthereumCoin3D({ size = 380, isSecondary = false }) {
  return (
    <div className="perspective-container pointer-events-none select-none">
      <div className={`${isSecondary ? 'coin-3d-secondary' : 'coin-3d-main'} relative flex items-center justify-center`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 256 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`coinBg_${isSecondary ? 'sec' : 'main'}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#0f172a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
            </radialGradient>
            
            <linearGradient id={`rimGrad_${isSecondary ? 'sec' : 'main'}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            <linearGradient id={`ethTopLeft_${isSecondary ? 'sec' : 'main'}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>

            <linearGradient id={`ethTopRight_${isSecondary ? 'sec' : 'main'}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            <linearGradient id={`ethBottomLeft_${isSecondary ? 'sec' : 'main'}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            <linearGradient id={`ethBottomRight_${isSecondary ? 'sec' : 'main'}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {/* Outer Metallic Coin Edge & Body */}
          <circle cx="128" cy="128" r="118" fill={`url(#coinBg_${isSecondary ? 'sec' : 'main'})`} stroke={`url(#rimGrad_${isSecondary ? 'sec' : 'main'})`} strokeWidth="5" />
          <circle cx="128" cy="128" r="108" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
          <circle cx="128" cy="128" r="98" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.4" />

          {/* Ethereum Diamond Emblem */}
          <g transform="translate(128, 128) scale(0.85) translate(-128, -128)">
            {/* Top Pyramid Left */}
            <polygon points="128,32 128,128 64,104" fill={`url(#ethTopLeft_${isSecondary ? 'sec' : 'main'})`} />
            {/* Top Pyramid Right */}
            <polygon points="128,32 192,104 128,128" fill={`url(#ethTopRight_${isSecondary ? 'sec' : 'main'})`} opacity="0.9" />
            {/* Bottom Pyramid Left */}
            <polygon points="128,128 64,104 128,156" fill={`url(#ethBottomLeft_${isSecondary ? 'sec' : 'main'})`} opacity="0.8" />
            {/* Bottom Pyramid Right */}
            <polygon points="128,128 128,156 192,104" fill={`url(#ethBottomRight_${isSecondary ? 'sec' : 'main'})`} opacity="0.75" />
            {/* Lower Tip Left */}
            <polygon points="128,168 64,116 128,224" fill={`url(#ethTopLeft_${isSecondary ? 'sec' : 'main'})`} opacity="0.9" />
            {/* Lower Tip Right */}
            <polygon points="128,168 128,224 192,116" fill={`url(#ethTopRight_${isSecondary ? 'sec' : 'main'})`} opacity="0.75" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { text, type: 'success' | 'error' | 'warning' | 'info' }
  const [projectId, setProjectId] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [amount, setAmount] = useState('');
  const [project, setProject] = useState(null);
  const [projectCount, setProjectCount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [copied, setCopied] = useState(false);

  // Helper notification handler
  const notify = (text, type = 'info') => {
    setMessage({ text, type });
  };

  // Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      notify('Please install the MetaMask extension in your browser', 'warning');
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Verify Network (Sepolia chainId = 11155111)
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      if (chainId !== 11155111 && chainId !== 31337) { // Sepolia or Anvil
        notify(`Warning: You are connected to ${network.name} (${chainId}). Make sure to select Sepolia (11155111).`, 'warning');
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const escContract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
      
      setAccount(address);
      setContract(escContract);
      notify(`Connected: ${address.slice(0,6)}...${address.slice(-4)}`, 'success');
      
      // Fetch total project count
      try {
        const count = await escContract.projectCount();
        setProjectCount(Number(count));
      } catch (err) {
        console.error("Contract call error:", err);
        notify(`Wallet connected, but contract not found at ${CONTRACT_ADDRESS.slice(0,6)}... Please check your network.`, 'warning');
      }
      
    } catch (error) {
      if (error.code === 4001) {
        notify('Connection request cancelled by user', 'info');
      } else {
        notify(`Connection error: ${error.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setProject(null);
    notify('Wallet disconnected successfully', 'info');
  };

  // Copy address helper
  const copyAddress = (addr) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Create Project
  const createProject = async (e) => {
    e.preventDefault();
    if (!contract) {
      notify('Please connect your wallet first', 'warning');
      return;
    }
    if (!goal || !duration) {
      notify('Please fill in all form fields', 'warning');
      return;
    }

    try {
      setLoading(true);
      notify('Transaction pending... Please confirm in MetaMask', 'info');
      const tx = await contract.createProject(
        ethers.parseEther(goal),
        parseInt(duration) * 86400
      );
      notify('Transaction submitted. Awaiting block confirmation...', 'info');
      await tx.wait();
      
      const count = await contract.projectCount();
      setProjectCount(Number(count));
      notify('🚀 Escrow project created successfully!', 'success');
      setGoal('');
      setDuration('');
      
    } catch (error) {
      notify(`Creation error: ${error.reason || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Contribute to a project
  const contribute = async (e) => {
    e.preventDefault();
    if (!contract) {
      notify('Please connect your wallet first', 'warning');
      return;
    }
    if (!projectId || !amount) {
      notify('Please specify a project ID and contribution amount', 'warning');
      return;
    }

    try {
      setLoading(true);
      notify('Sending contribution...', 'info');
      const tx = await contract.contribute(parseInt(projectId), {
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      
      notify(`✅ Contribution of ${amount} ETH successful!`, 'success');
      setAmount('');
      if (project) checkProject(projectId);
      
    } catch (error) {
      notify(`Contribution error: ${error.reason || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Release Funds
  const releaseFunds = async () => {
    if (!contract || !projectId) return;

    try {
      setLoading(true);
      notify('Releasing funds...', 'info');
      const tx = await contract.releaseFunds(parseInt(projectId));
      await tx.wait();
      
      notify('🎉 Funds successfully released to the project owner!', 'success');
      if (project) checkProject(projectId);
      
    } catch (error) {
      notify(`Release error: ${error.reason || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Refund
  const refund = async () => {
    if (!contract || !projectId) return;

    try {
      setLoading(true);
      notify('Processing refund request...', 'info');
      const tx = await contract.refund(parseInt(projectId));
      await tx.wait();
      
      notify('💸 Refund executed successfully!', 'success');
      if (project) checkProject(projectId);
      
    } catch (error) {
      notify(`Refund error: ${error.reason || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Inspect Project
  const checkProject = async (id = projectId) => {
    if (!contract) {
      notify('Please connect your wallet first', 'warning');
      return;
    }
    if (!id) {
      notify('Please enter a valid project ID', 'warning');
      return;
    }

    try {
      setLoading(true);
      const p = await contract.checkProject(parseInt(id));
      
      if (p.owner === ethers.ZeroAddress) {
        notify(`Project #${id} not found`, 'warning');
        setProject(null);
        return;
      }

      const stateLabels = [
        { label: 'Active', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
        { label: 'Success (Funds Released)', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
        { label: 'Failed', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
        { label: 'Refunded', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' }
      ];
      
      const currentState = stateLabels[Number(p.state)] || stateLabels[0];
      
      setProject({
        id: parseInt(id),
        owner: p.owner,
        goal: ethers.formatEther(p.goal),
        deadlineDate: new Date(Number(p.deadline) * 1000),
        deadlineFormatted: new Date(Number(p.deadline) * 1000).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }),
        totalFunded: ethers.formatEther(p.totalFunded),
        stateLabel: currentState.label,
        stateColor: currentState.color,
        stateIndex: Number(p.state),
        isExpired: Date.now() > Number(p.deadline) * 1000
      });
      
      setIsOwner(account && p.owner.toLowerCase() === account.toLowerCase());
      notify(`Project #${id} loaded successfully`, 'info');
      
    } catch (error) {
      notify(`Error loading project: ${error.reason || error.message}`, 'error');
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  // MetaMask Event Handling (Fix accountsChanged bug)
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* 3D Spinning Ethereum Coins Background Layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glowing Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"></div>

        {/* Primary Central 3D Spinning Ethereum Coin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 sm:opacity-25 transition-opacity">
          <EthereumCoin3D size={460} isSecondary={false} />
        </div>

        {/* Secondary Top Right 3D Spinning Ethereum Coin */}
        <div className="absolute -top-10 right-10 opacity-15 hidden md:block">
          <EthereumCoin3D size={240} isSecondary={true} />
        </div>

        {/* Secondary Bottom Left 3D Spinning Ethereum Coin */}
        <div className="absolute -bottom-10 left-10 opacity-15 hidden md:block">
          <EthereumCoin3D size={220} isSecondary={true} />
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🛡️</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-200 to-indigo-400 bg-clip-text text-transparent">
                  Multi-Party Escrow
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Sepolia
                </span>
              </div>
              <p className="text-xs text-slate-400">Smart Contract Escrow Security Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {!account ? (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <div className="flex items-center space-x-2">
                  <span>{loading ? '⏳ Connecting...' : '🦊 Connect MetaMask'}</span>
                </div>
              </button>
            ) : (
              <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 pl-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs font-mono font-medium text-slate-300">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <button
                  onClick={() => copyAddress(account)}
                  title="Copy address"
                  className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition"
                >
                  {copied ? '✓' : '📋'}
                </button>
                <button
                  onClick={disconnectWallet}
                  className="px-2.5 py-1 text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 rounded-lg transition"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Banner Alert Toast */}
        {message && (
          <div className={`p-4 rounded-2xl border backdrop-blur-md flex items-center justify-between transition-all duration-300 ${
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
            message.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' :
            message.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
            'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
          }`}>
            <div className="flex items-center space-x-3">
              <span className="text-lg">
                {message.type === 'success' ? '✅' :
                 message.type === 'error' ? '❌' :
                 message.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
            <button 
              onClick={() => setMessage(null)}
              className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded-md hover:bg-slate-800/50"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dashboard Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Projects</p>
                <h3 className="text-2xl font-black text-white mt-1">{projectCount}</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                📂
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Escrow projects created on smart contract</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sepolia Contract</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-mono text-sm font-bold text-cyan-300">
                    {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
                  </span>
                  <button 
                    onClick={() => copyAddress(CONTRACT_ADDRESS)}
                    className="text-xs text-slate-400 hover:text-cyan-400"
                    title="Copy contract address"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                🔗
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">MultiPartyEscrow.sol verified</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Wallet Status</p>
                <div className="mt-1 flex items-center space-x-2">
                  {account ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ● Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                      ○ Disconnected
                    </span>
                  )}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                🔑
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Ready for Web3 transactions</p>
          </div>
        </div>

        {/* Core Interactive Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Form Card: Create Project */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                🚀
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Create New Escrow Project</h2>
                <p className="text-xs text-slate-400">Set the target funding goal and campaign duration</p>
              </div>
            </div>

            <form onSubmit={createProject} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Funding Goal (ETH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-slate-600 transition text-sm font-medium"
                    placeholder="e.g. 1.5"
                    required
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">ETH</span>
                </div>
                {/* Presets */}
                <div className="flex space-x-2 mt-2">
                  {['0.1', '0.5', '1.0', '5.0'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setGoal(val)}
                      className="px-2.5 py-1 text-xs bg-slate-800/70 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                    >
                      {val} ETH
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Campaign Duration (Days)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-slate-600 transition text-sm font-medium"
                    placeholder="e.g. 7"
                    required
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">Days</span>
                </div>
                {/* Duration Presets */}
                <div className="flex space-x-2 mt-2">
                  {['1', '3', '7', '14', '30'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDuration(val)}
                      className="px-2.5 py-1 text-xs bg-slate-800/70 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                    >
                      {val}d
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !account}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Creating Escrow...' : '✨ Launch Escrow Project'}
              </button>

              {!account && (
                <p className="text-xs text-amber-400/90 text-center font-medium bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                  🔒 Connect your MetaMask wallet to create an escrow project
                </p>
              )}
            </form>
          </div>

          {/* Interactive Card: Inspect & Contribute */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  💎
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Interact with a Project</h2>
                  <p className="text-xs text-slate-400">Inspect details, contribute ETH, or manage project funds</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* ID Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Project ID
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="1"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-slate-600 transition text-sm font-medium"
                      placeholder="e.g. 1"
                    />
                    <button
                      type="button"
                      onClick={() => checkProject()}
                      disabled={loading || !account}
                      className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition text-sm disabled:opacity-50"
                    >
                      🔍 Inspect
                    </button>
                  </div>
                </div>

                {/* Contribution Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Contribution Amount (ETH)
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step="0.001"
                        min="0.001"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 transition text-sm font-medium"
                        placeholder="e.g. 0.25"
                      />
                      <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">ETH</span>
                    </div>
                    <button
                      type="button"
                      onClick={contribute}
                      disabled={loading || !account || !projectId}
                      className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition text-sm disabled:opacity-50"
                    >
                      💰 Contribute
                    </button>
                  </div>
                  {/* Preset Buttons */}
                  <div className="flex space-x-2 mt-2">
                    {['0.01', '0.05', '0.1', '0.5'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className="px-2.5 py-1 text-xs bg-slate-800/70 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                      >
                        +{val} ETH
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: Release / Refund */}
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-3">
                  <button
                    onClick={releaseFunds}
                    disabled={loading || !account || !projectId || !isOwner}
                    title={!isOwner ? "Only the project owner can release funds" : ""}
                    className="py-3 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl font-semibold text-xs transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5"
                  >
                    <span>📤 Release Funds</span>
                  </button>

                  <button
                    onClick={refund}
                    disabled={loading || !account || !projectId}
                    className="py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl font-semibold text-xs transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5"
                  >
                    <span>↩️ Claim Refund</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details Modal / Card */}
        {project && (
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl">
                  📊
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-black text-white">Project #{project.id}</h3>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${project.stateColor}`}>
                      {project.stateLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time status and details on Sepolia</p>
                </div>
              </div>

              {isOwner && (
                <div className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-300 text-xs font-semibold flex items-center space-x-1.5">
                  <span>⭐ You are the Owner</span>
                </div>
              )}
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Creator / Owner</p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="font-mono text-sm font-bold text-slate-200 truncate">{project.owner}</p>
                  <button onClick={() => copyAddress(project.owner)} className="text-xs text-slate-400 hover:text-cyan-400" title="Copy owner address">📋</button>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Funding Target</p>
                <p className="text-lg font-black text-cyan-400 mt-1">{project.goal} ETH</p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Raised</p>
                <p className="text-lg font-black text-emerald-400 mt-1">{project.totalFunded} ETH</p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deadline</p>
                <p className="text-sm font-bold text-slate-200 mt-1">{project.deadlineFormatted}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Funding Progress</span>
                <span className="text-cyan-400">
                  {Math.min(100, (parseFloat(project.totalFunded) / parseFloat(project.goal)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-700 shadow-lg shadow-cyan-500/50"
                  style={{
                    width: `${Math.min(100, (parseFloat(project.totalFunded) / parseFloat(project.goal)) * 100)}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Context Helper Note */}
            {isOwner && project.stateIndex === 0 && (
              <div className="mt-5 p-3.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-300 flex items-center space-x-2">
                <span>💡</span>
                <span>As the project owner, you can click <strong>Release Funds</strong> once the target goal is met.</span>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>Multi-Party Escrow DApp • Powered by Ethereum & Sepolia Testnet</p>
      </footer>
    </div>
  );
}

export default App;