import React, { useState, useEffect } from 'react';
import { Glasses, Tablet, Tv, Monitor, ShoppingBag, Image, Music, Video, X, FileText, Wallet, MessageSquare, Activity, Lock, Download, Eye, ChevronRight, Play, Pause, CreditCard, Package, TrendingUp, CheckCircle, Zap, ShoppingCart, Send, Pencil, History, ArrowUpRight } from 'lucide-react';

function Portal() {
  // ==================== CONSTANTS ====================
  
  // Pricing & Fees
  const PROTOCOL_FEE_PERCENTAGE = 0.02; // 2% protocol fee
  const NETWORK_FEE_ETH = 0.002; // Network fee in ETH
  const GUESTBOOK_COST_Y8T = 10; // Cost to post in guestbook
  
  // Exchange Rates (mock)
  const ETH_TO_USD = 3900; // 1 ETH = $3900
  const Y8T_TO_USD = 2.50; // 1 Y8T = $2.50
  
  // Starting Balances
  const INITIAL_Y8T_BALANCE = 1247.00;
  const INITIAL_ETH_BALANCE = 2.5;
  
  // Access Pass Duration
  const ACCESS_PASS_DURATION_DAYS = 365; // 1 year in days
  
  // Audio Player
  const WAVEFORM_BARS = 32; // Number of bars in audio visualization
  const PLAYBACK_UPDATE_INTERVAL = 100; // Update playback every 100ms
  
  // Storage
  const STORAGE_KEY = 'y8t_portal_data';
  
  const [activeDevice, setActiveDevice] = useState('tv');
  const [activeSection, setActiveSection] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(false);
  const [time, setTime] = useState(new Date());
  const [recording, setRecording] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [showCardForm, setShowCardForm] = useState(false);
  const [y8tBalance, setY8tBalance] = useState(INITIAL_Y8T_BALANCE);
  const [ethBalance, setEthBalance] = useState(INITIAL_ETH_BALANCE);
  const [ownedTracks, setOwnedTracks] = useState([]);
  const [ownedVideos, setOwnedVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [checkoutTrack, setCheckoutTrack] = useState(null);
  const [checkoutVideo, setCheckoutVideo] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  const [obsConnected, setObsConnected] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [obsWebSocket, setObsWebSocket] = useState(null);
  const [guestbookMessage, setGuestbookMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [notification, setNotification] = useState(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [purchasedItems, setPurchasedItems] = useState([
    { id: 1, name: 'GENESIS NFT #0742', type: 'NFT', date: '2026.01.28', value: '0.08 ETH', image: '1', status: 'OWNED', storeItemId: 1 },
    { id: 2, name: 'VISION PASS', type: 'ACCESS', date: '2026.01.15', value: '0.12 ETH', image: '2', status: 'ACTIVE', expires: '2027.01.15', storeItemId: 2 },
    { id: 3, name: 'ARCHIVE ACCESS', type: 'ACCESS', date: '2026.01.10', value: '0.10 ETH', image: '3', status: 'ACTIVE', expires: '2027.01.10', storeItemId: 6 },
    { id: 4, name: 'VAULT NFT #1247', type: 'NFT', date: '2025.12.20', value: '0.20 ETH', image: '4', status: 'OWNED', storeItemId: 9 },
    { id: 5, name: 'CREATOR KEY #089', type: 'NFT', date: '2025.12.01', value: '0.15 ETH', image: '5', status: 'OWNED', storeItemId: 4 },
  ]);
  
  const [guestbookEntries, setGuestbookEntries] = useState([
    { id: 1, address: '0x742d...bEb', message: 'First entry in the Y8T guestbook. Welcome to the future.', timestamp: '2026.02.01 14:23', verified: true },
    { id: 2, address: '0x89ab...4Fc', message: 'Amazing work. The protocol is revolutionary.', timestamp: '2026.02.01 16:45', verified: true },
    { id: 3, address: '0xdef1...8Ad', message: 'Been following since day one. This is it.', timestamp: '2026.02.02 09:12', verified: false },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isPlaying && currentTrack) {
      const track = audioTracks.find(t => t.id === currentTrack);
      if (!track) return;
      
      const totalSeconds = durationToSeconds(track.duration);
      const updateInterval = 100; // Update every 100ms
      const incrementPerUpdate = (100 / (totalSeconds * 1000)) * updateInterval;
      
      const interval = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + incrementPerUpdate;
        });
      }, updateInterval);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (isVideoPlaying && currentVideo) {
      const video = videoContent.find(v => v.id === currentVideo);
      if (!video) return;
      
      const totalSeconds = durationToSeconds(video.duration);
      const updateInterval = 100;
      const incrementPerUpdate = (100 / (totalSeconds * 1000)) * updateInterval;
      
      const interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsVideoPlaying(false);
            return 0;
          }
          return prev + incrementPerUpdate;
        });
      }, updateInterval);
      return () => clearInterval(interval);
    }
  }, [isVideoPlaying, currentVideo]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      if (savedData.y8tBalance !== undefined) setY8tBalance(savedData.y8tBalance);
      if (savedData.ethBalance !== undefined) setEthBalance(savedData.ethBalance);
      if (savedData.ownedTracks) setOwnedTracks(savedData.ownedTracks);
      if (savedData.ownedVideos) setOwnedVideos(savedData.ownedVideos);
      if (savedData.purchasedItems) setPurchasedItems(savedData.purchasedItems);
      if (savedData.transactions) setTransactions(savedData.transactions);
      if (savedData.cart) setCart(savedData.cart);
      if (savedData.guestbookEntries) setGuestbookEntries(savedData.guestbookEntries);
    }
  }, []);

  // Save data to localStorage whenever key state changes
  useEffect(() => {
    const dataToSave = {
      y8tBalance,
      ethBalance,
      ownedTracks,
      ownedVideos,
      purchasedItems,
      transactions,
      cart,
      guestbookEntries,
      savedAt: new Date().toISOString()
    };
    saveToLocalStorage(dataToSave);
  }, [y8tBalance, ethBalance, ownedTracks, ownedVideos, purchasedItems, transactions, cart, guestbookEntries]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const addTransaction = (type, description, amount) => {
    const newTransaction = {
      id: Date.now(),
      type,
      description,
      amount,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Convert duration string (e.g., "3:42") to seconds
  const durationToSeconds = (duration) => {
    const [minutes, seconds] = duration.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Convert seconds to MM:SS format
  const secondsToTime = (seconds) => {
    const mins = Math.floor(seconds);
    const secs = Math.floor((seconds - mins) * 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  // ==================== LOCALSTORAGE PERSISTENCE ====================
  
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  };

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  };

  const storeItems = [
    { id: 1, name: 'GENESIS NFT', price: '0.08', type: 'NFT', description: 'Original Y8T genesis collection piece. Grants lifetime access to exclusive content and events.', inventory: 47 },
    { id: 2, name: 'VISION PASS', price: '0.12', type: 'ACCESS', description: 'Annual membership pass. Unlock all premium content, early releases, and member-only features.', inventory: 156 },
    { id: 3, name: 'BASE HOODIE', price: '0.05', type: 'MERCH', description: 'Premium heavyweight hoodie with embroidered Y8T logo. 100% organic cotton. Limited run.', inventory: 23 },
    { id: 4, name: 'CREATOR KEY', price: '0.15', type: 'NFT', description: 'Exclusive creator key NFT. Participate in governance and receive revenue share from protocol.', inventory: 12 },
    { id: 5, name: 'Y8T TEE', price: '0.03', type: 'MERCH', description: 'Classic fit tee with screen-printed Y8T wordmark. Available in black only.', inventory: 89 },
    { id: 6, name: 'ARCHIVE ACCESS', price: '0.10', type: 'ACCESS', description: 'Full access to Y8T archive including unreleased tracks, sketches, and behind-the-scenes content.', inventory: 234 },
    { id: 7, name: 'STUDIO POSTER', price: '0.02', type: 'MERCH', description: '24x36" museum-quality print. Signed and numbered. Edition of 100.', inventory: 8 },
    { id: 8, name: 'GOLD PASS', price: '0.25', type: 'ACCESS', description: 'Lifetime membership. All access forever. First priority for new releases and collaborations.', inventory: 5 },
    { id: 9, name: 'VAULT NFT', price: '0.20', type: 'NFT', description: 'Access to the vault. Exclusive unreleased content added monthly. Tradeable.', inventory: 31 },
    { id: 10, name: 'BASE CAP', price: '0.04', type: 'MERCH', description: 'Structured 6-panel cap with 3D embroidered logo. Adjustable snapback.', inventory: 45 },
  ];

  const audioTracks = [
    { id: 1, title: 'VOID STATE', duration: '3:42', bpm: '140', genre: 'EXPERIMENTAL', priceY8T: 50 },
    { id: 2, title: 'BASE FREQUENCY', duration: '4:15', bpm: '128', genre: 'TECHNO', priceY8T: 50 },
    { id: 3, title: 'COLD WORLD', duration: '3:58', bpm: '135', genre: 'AMBIENT', priceY8T: 50 },
    { id: 4, title: 'MINIMAL', duration: '5:22', bpm: '120', genre: 'MINIMAL', priceY8T: 75 },
    { id: 5, title: 'TRANSMISSION', duration: '4:03', bpm: '145', genre: 'INDUSTRIAL', priceY8T: 75 },
    { id: 6, title: 'ARCHIVE LOOP', duration: '6:11', bpm: '110', genre: 'DRONE', priceY8T: 100 },
    { id: 7, title: 'SIGNAL LOST', duration: '4:28', bpm: '133', genre: 'TECHNO', priceY8T: 50 },
    { id: 8, title: 'ECHO CHAMBER', duration: '5:45', bpm: '118', genre: 'AMBIENT', priceY8T: 100 },
  ];

  const videoContent = [
    { id: 1, title: 'GENESIS: THE VISION', duration: '12:34', category: 'DOCUMENTARY', priceY8T: 150, resolution: '4K', year: '2026', description: 'An in-depth exploration of the Y8T protocol genesis and founding principles.' },
    { id: 2, title: 'STUDIO SESSION 001', duration: '8:45', category: 'STUDIO', priceY8T: 100, resolution: '1080p', year: '2026', description: 'Behind the scenes of creating VOID STATE. Raw footage from the studio.' },
    { id: 3, title: 'BASE BROADCAST', duration: '15:20', category: 'LIVE', priceY8T: 200, resolution: '4K', year: '2026', description: 'Live performance streamed from BASE headquarters. Full set.' },
    { id: 4, title: 'PROCESS: MINIMAL', duration: '6:12', category: 'PROCESS', priceY8T: 75, resolution: '1080p', year: '2025', description: 'Creative process breakdown. From concept to final production.' },
    { id: 5, title: 'ARCHIVE VAULT 01', duration: '22:18', category: 'ARCHIVE', priceY8T: 250, resolution: '4K', year: '2025', description: 'Exclusive unreleased footage and early experiments. Vault access only.' },
    { id: 6, title: 'INTERVIEW: PROTOCOL', duration: '18:56', category: 'INTERVIEW', priceY8T: 125, resolution: '1080p', year: '2026', description: 'In conversation about the future of creator economy and Web3.' },
    { id: 7, title: 'LIVE: TRANSMISSION', duration: '45:32', category: 'LIVE', priceY8T: 300, resolution: '4K', year: '2026', description: 'Full live performance. Multi-camera production with enhanced audio.' },
    { id: 8, title: 'TUTORIAL: PRODUCTION', duration: '28:14', category: 'TUTORIAL', priceY8T: 175, resolution: '1080p', year: '2026', description: 'Complete walkthrough of production techniques and tools used.' },
  ];

  // Gallery items with stable data (no random generation)
  const galleryItems = [
    { id: 1, title: 'WORK 01', medium: 'DIGITAL', year: '2026' },
    { id: 2, title: 'WORK 02', medium: 'SCULPTURE', year: '2025' },
    { id: 3, title: 'WORK 03', medium: 'PAINTING', year: '2026' },
    { id: 4, title: 'WORK 04', medium: 'DIGITAL', year: '2025' },
    { id: 5, title: 'WORK 05', medium: 'DRAWING', year: '2026' },
    { id: 6, title: 'WORK 06', medium: 'DIGITAL', year: '2026' },
    { id: 7, title: 'WORK 07', medium: 'SCULPTURE', year: '2025' },
    { id: 8, title: 'WORK 08', medium: 'PAINTING', year: '2026' },
    { id: 9, title: 'WORK 09', medium: 'DIGITAL', year: '2025' },
    { id: 10, title: 'WORK 10', medium: 'DRAWING', year: '2026' },
    { id: 11, title: 'WORK 11', medium: 'DIGITAL', year: '2026' },
    { id: 12, title: 'WORK 12', medium: 'SCULPTURE', year: '2025' },
    { id: 13, title: 'WORK 13', medium: 'PAINTING', year: '2026' },
    { id: 14, title: 'WORK 14', medium: 'DIGITAL', year: '2025' },
    { id: 15, title: 'WORK 15', medium: 'DRAWING', year: '2026' },
    { id: 16, title: 'WORK 16', medium: 'DIGITAL', year: '2026' },
    { id: 17, title: 'WORK 17', medium: 'SCULPTURE', year: '2025' },
    { id: 18, title: 'WORK 18', medium: 'PAINTING', year: '2026' },
    { id: 19, title: 'WORK 19', medium: 'DIGITAL', year: '2025' },
    { id: 20, title: 'WORK 20', medium: 'DRAWING', year: '2026' },
    { id: 21, title: 'WORK 21', medium: 'DIGITAL', year: '2026' },
    { id: 22, title: 'WORK 22', medium: 'SCULPTURE', year: '2025' },
    { id: 23, title: 'WORK 23', medium: 'PAINTING', year: '2026' },
    { id: 24, title: 'WORK 24', medium: 'DIGITAL', year: '2025' },
    { id: 25, title: 'WORK 25', medium: 'DRAWING', year: '2026' },
    { id: 26, title: 'WORK 26', medium: 'DIGITAL', year: '2026' },
    { id: 27, title: 'WORK 27', medium: 'SCULPTURE', year: '2025' },
    { id: 28, title: 'WORK 28', medium: 'PAINTING', year: '2026' },
    { id: 29, title: 'WORK 29', medium: 'DIGITAL', year: '2025' },
    { id: 30, title: 'WORK 30', medium: 'DRAWING', year: '2026' },
    { id: 31, title: 'WORK 31', medium: 'DIGITAL', year: '2026' },
    { id: 32, title: 'WORK 32', medium: 'SCULPTURE', year: '2025' },
    { id: 33, title: 'WORK 33', medium: 'PAINTING', year: '2026' },
    { id: 34, title: 'WORK 34', medium: 'DIGITAL', year: '2025' },
    { id: 35, title: 'WORK 35', medium: 'DRAWING', year: '2026' },
    { id: 36, title: 'WORK 36', medium: 'DIGITAL', year: '2026' },
    { id: 37, title: 'WORK 37', medium: 'SCULPTURE', year: '2025' },
    { id: 38, title: 'WORK 38', medium: 'PAINTING', year: '2026' },
    { id: 39, title: 'WORK 39', medium: 'DIGITAL', year: '2025' },
    { id: 40, title: 'WORK 40', medium: 'DRAWING', year: '2026' },
    { id: 41, title: 'WORK 41', medium: 'DIGITAL', year: '2026' },
    { id: 42, title: 'WORK 42', medium: 'SCULPTURE', year: '2025' },
    { id: 43, title: 'WORK 43', medium: 'PAINTING', year: '2026' },
    { id: 44, title: 'WORK 44', medium: 'DIGITAL', year: '2025' },
    { id: 45, title: 'WORK 45', medium: 'DRAWING', year: '2026' },
    { id: 46, title: 'WORK 46', medium: 'DIGITAL', year: '2026' },
    { id: 47, title: 'WORK 47', medium: 'SCULPTURE', year: '2025' },
    { id: 48, title: 'WORK 48', medium: 'PAINTING', year: '2026' },
    { id: 49, title: 'WORK 49', medium: 'DIGITAL', year: '2025' },
  ];

  const documents = [
    {
      id: 1,
      category: 'WHITEPAPER',
      items: [
        { 
          id: 'wp1', 
          title: 'Y8T Protocol Overview', 
          date: '2026.01.15', 
          size: '2.4 MB', 
          status: 'PUBLIC',
          content: `Y8T PROTOCOL OVERVIEW\n\nEXECUTIVE SUMMARY\n\nThe Y8T protocol represents a new paradigm in creator economy infrastructure, built on BASE. This document outlines the technical architecture, tokenomics, and governance framework.\n\nVISION\n\nCreate a decentralized ecosystem where creators maintain full ownership and control of their work while enabling direct-to-fan monetization without intermediaries.\n\nKEY FEATURES\n\n- Token-gated content access\n- Fractional ownership of creative works\n- On-chain royalty distribution\n- Community governance mechanisms\n- Cross-platform interoperability\n\nTECHNICAL ARCHITECTURE\n\nThe protocol leverages smart contracts deployed on BASE for:\n• Asset tokenization (ERC-721/ERC-1155)\n• Payment processing (ERC-20)\n• Governance voting (DAO structure)\n• Content verification (IPFS integration)\n\nTOKENOMICS\n\nTotal Supply: 100,000,000 Y8T\nDistribution: 40% Community, 30% Team (4yr vest), 20% Treasury, 10% Liquidity\n\nROADMAP\n\nQ1 2026: Protocol launch, initial creator onboarding\nQ2 2026: Mobile app release, expanded features\nQ3 2026: Cross-chain bridges, partnership integrations\nQ4 2026: Governance transition to full DAO\n\nFor detailed technical specifications, see our Technical Architecture document.`
        },
        { 
          id: 'wp2', 
          title: 'Tokenomics & Distribution', 
          date: '2026.01.20', 
          size: '1.8 MB', 
          status: 'PUBLIC',
          content: `Y8T TOKENOMICS & DISTRIBUTION\n\nTOKEN UTILITY\n\nThe Y8T token serves multiple functions within the ecosystem:\n\n1. ACCESS CONTROL\nToken holders unlock exclusive content, early releases, and member-only features. Tiered access based on holdings.\n\n2. GOVERNANCE\nVote on protocol upgrades, treasury allocation, and community proposals. 1 token = 1 vote for base decisions.\n\n3. REWARDS\nEarn tokens through content creation, curation, and community participation. Dynamic reward pools adjust based on activity.\n\n4. TRANSACTION MEDIUM\nPrimary currency for purchasing NFTs, accessing premium content, and tipping creators.`
        },
      ]
    },
    {
      id: 2,
      category: 'BRAND',
      items: [
        { 
          id: 'b1', 
          title: 'Brand Guidelines v2.0', 
          date: '2026.01.10', 
          size: '8.2 MB', 
          status: 'PUBLIC',
          content: `Y8T BRAND GUIDELINES v2.0\n\nBRAND ESSENCE\n\nMinimal. Architectural. Future-forward.\n\nY8T represents the convergence of art, technology, and decentralized ownership. Our brand communicates trust, innovation, and creative empowerment.`
        },
      ]
    }
  ];

  const handleDownload = (doc) => {
    const blob = new Blob([doc.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showNotification('Document downloaded');
  };

  const handlePlayPause = (trackId) => {
    if (!ownedTracks.includes(trackId)) return;
    
    if (currentTrack === trackId && isPlaying) {
      // Pause current track
      setIsPlaying(false);
    } else if (currentTrack === trackId && !isPlaying) {
      // Resume paused track or restart if finished
      if (playbackProgress >= 100) {
        setPlaybackProgress(0);
      }
      setIsPlaying(true);
    } else {
      // Start new track
      setCurrentTrack(trackId);
      setIsPlaying(true);
      setPlaybackProgress(0);
    }
  };

  const handleBuyTrack = (trackId) => {
    const track = audioTracks.find(t => t.id === trackId);
    if (y8tBalance >= track.priceY8T) {
      setCheckoutTrack(trackId);
    }
  };

  const completeTrackPurchase = async () => {
    const track = audioTracks.find(t => t.id === checkoutTrack);
    const totalCost = track.priceY8T * (1 + PROTOCOL_FEE_PERCENTAGE);
    
    // Show loading state
    setIsProcessing(true);
    setProcessingMessage('PURCHASING TRACK...');

    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setY8tBalance(prev => prev - totalCost);
    setOwnedTracks(prev => [...prev, checkoutTrack]);
    addTransaction('purchase', `${track.title}`, -totalCost);
    setCheckoutTrack(null);
    setCurrentTrack(checkoutTrack);
    setIsPlaying(true);
    setPlaybackProgress(0);
    
    // Hide loading state
    setIsProcessing(false);
    setProcessingMessage('');
    
    showNotification(`${track.title} purchased successfully`);
  };

  const handleSubmitGuestbook = () => {
    if (guestbookMessage.trim() && y8tBalance >= GUESTBOOK_COST_Y8T) {
      const newEntry = {
        id: guestbookEntries.length + 1,
        address: '0x742d...bEb',
        message: guestbookMessage.trim(),
        timestamp: new Date().toISOString().split('T')[0].replace(/-/g, '.') + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5),
        verified: true
      };
      setGuestbookEntries([newEntry, ...guestbookEntries]);
      setGuestbookMessage('');
      setY8tBalance(prev => prev - GUESTBOOK_COST_Y8T);
      addTransaction('guestbook', 'Guestbook entry', -GUESTBOOK_COST_Y8T);
      showNotification('Message minted to guestbook');
    }
  };

  const completeStorePurchase = async () => {
    const item = storeItems.find(i => i.id === checkoutItem);
    if (!item) return;

    const totalCostETH = parseFloat(item.price) * (1 + PROTOCOL_FEE_PERCENTAGE) + NETWORK_FEE_ETH;

    // Check if user has enough ETH
    if (ethBalance < totalCostETH) {
      showNotification('Insufficient ETH balance', 'error');
      return;
    }

    // Check if item is already purchased
    const alreadyOwned = purchasedItems.some(p => p.storeItemId === item.id);
    if (alreadyOwned) {
      showNotification('You already own this item', 'error');
      return;
    }

    // Show loading state
    setIsProcessing(true);
    setProcessingMessage('PROCESSING PURCHASE...');

    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Determine status based on item type
    const status = item.type === 'ACCESS' ? 'ACTIVE' : 'OWNED';
    const expires = item.type === 'ACCESS' ? 
      new Date(Date.now() + ACCESS_PASS_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, '.') : 
      undefined;

    // Create purchased item
    const newPurchasedItem = {
      id: purchasedItems.length + 1,
      name: item.name,
      type: item.type,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      value: `${item.price} ETH`,
      image: String(item.id),
      status: status,
      expires: expires,
      storeItemId: item.id
    };

    // Update state
    setEthBalance(prev => prev - totalCostETH);
    setPurchasedItems(prev => [newPurchasedItem, ...prev]);
    addTransaction('store-purchase', item.name, -totalCostETH);
    
    // Update store inventory
    const updatedStoreItems = storeItems.map(si => 
      si.id === item.id ? { ...si, inventory: si.inventory - 1 } : si
    );
    
    // Hide loading state
    setIsProcessing(false);
    setProcessingMessage('');
    
    // Close checkout and show success
    setCheckoutItem(null);
    setSelectedItem(null);
    showNotification(`${item.name} purchased successfully!`);
  };

  const addToCart = (itemId) => {
    const item = storeItems.find(i => i.id === itemId);
    if (!item) return;

    // Check if already owned
    const alreadyOwned = purchasedItems.some(p => p.storeItemId === itemId);
    if (alreadyOwned) {
      showNotification('You already own this item', 'error');
      return;
    }

    // Check if already in cart
    const alreadyInCart = cart.some(c => c.id === itemId);
    if (alreadyInCart) {
      showNotification('Item already in cart', 'error');
      return;
    }

    setCart(prev => [...prev, { ...item, quantity: 1 }]);
    showNotification(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showNotification('Item removed from cart');
  };

  const updateCartQuantity = (itemId, change) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, Math.min(item.inventory, item.quantity + change));
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    showNotification('Cart cleared');
  };

  const checkoutCart = async () => {
    if (cart.length === 0) return;

    // Calculate total cost
    let totalCostETH = 0;
    cart.forEach(item => {
      const itemCost = parseFloat(item.price) * item.quantity;
      const fees = itemCost * PROTOCOL_FEE_PERCENTAGE + NETWORK_FEE_ETH;
      totalCostETH += itemCost + fees;
    });

    // Check if user has enough ETH
    if (ethBalance < totalCostETH) {
      showNotification('Insufficient ETH balance for cart purchase', 'error');
      return;
    }

    // Show loading state
    setIsProcessing(true);
    setProcessingMessage(`PROCESSING ${cart.length} ITEMS...`);

    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Process all purchases
    const newPurchases = [];
    cart.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        const status = item.type === 'ACCESS' ? 'ACTIVE' : 'OWNED';
        const expires = item.type === 'ACCESS' ? 
          new Date(Date.now() + ACCESS_PASS_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, '.') : 
          undefined;

        newPurchases.push({
          id: purchasedItems.length + newPurchases.length + 1,
          name: item.quantity > 1 ? `${item.name} (${i + 1}/${item.quantity})` : item.name,
          type: item.type,
          date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
          value: `${item.price} ETH`,
          image: String(item.id),
          status: status,
          expires: expires,
          storeItemId: item.id
        });
      }
    });

    // Update state
    setEthBalance(prev => prev - totalCostETH);
    setPurchasedItems(prev => [...newPurchases, ...prev]);
    addTransaction('cart-purchase', `${cart.length} items`, -totalCostETH);
    
    // Hide loading state
    setIsProcessing(false);
    setProcessingMessage('');
    
    // Clear cart and close
    setCart([]);
    setShowCart(false);
    showNotification(`Successfully purchased ${cart.length} items!`);
  };

  const handleBuyVideo = (videoId) => {
    const video = videoContent.find(v => v.id === videoId);
    if (y8tBalance >= video.priceY8T) {
      setCheckoutVideo(videoId);
    }
  };

  const completeVideoPurchase = async () => {
    const video = videoContent.find(v => v.id === checkoutVideo);
    const totalCost = video.priceY8T * (1 + PROTOCOL_FEE_PERCENTAGE);
    
    // Show loading state
    setIsProcessing(true);
    setProcessingMessage('PURCHASING VIDEO...');

    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setY8tBalance(prev => prev - totalCost);
    setOwnedVideos(prev => [...prev, checkoutVideo]);
    addTransaction('video-purchase', `${video.title}`, -totalCost);
    setCheckoutVideo(null);
    setCurrentVideo(checkoutVideo);
    setIsVideoPlaying(true);
    setVideoProgress(0);
    
    // Hide loading state
    setIsProcessing(false);
    setProcessingMessage('');
    
    showNotification(`${video.title} purchased successfully`);
  };

  const handleVideoPlayPause = (videoId) => {
    if (!ownedVideos.includes(videoId)) return;
    
    if (currentVideo === videoId && isVideoPlaying) {
      setIsVideoPlaying(false);
    } else if (currentVideo === videoId && !isVideoPlaying) {
      if (videoProgress >= 100) {
        setVideoProgress(0);
      }
      setIsVideoPlaying(true);
    } else {
      setCurrentVideo(videoId);
      setIsVideoPlaying(true);
      setVideoProgress(0);
    }
  };

  // ==================== ADD FUNDS FUNCTIONS ====================
  
  const addETHFunds = async (amount) => {
    setIsProcessing(true);
    setProcessingMessage(`ADDING ${amount} ETH...`);
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setEthBalance(prev => prev + amount);
    addTransaction('deposit', `Add ${amount} ETH`, amount);
    
    setIsProcessing(false);
    setProcessingMessage('');
    
    showNotification(`Successfully added ${amount} ETH`);
  };

  const addY8TFunds = async (amount) => {
    setIsProcessing(true);
    setProcessingMessage(`ADDING ${amount} Y8T...`);
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setY8tBalance(prev => prev + amount);
    addTransaction('deposit', `Add ${amount} Y8T`, amount);
    
    setIsProcessing(false);
    setProcessingMessage('');
    
    showNotification(`Successfully added ${amount} Y8T`);
  };

  // ==================== STREAMING FUNCTIONS ====================
  
  // Connect to OBS WebSocket
  const connectToOBS = async () => {
    try {
      // OBS WebSocket typically runs on ws://localhost:4455
      // User needs to install obs-websocket plugin and configure it
      const ws = new WebSocket('ws://localhost:4455');
      
      ws.onopen = () => {
        console.log('Connected to OBS');
        setObsConnected(true);
        setObsWebSocket(ws);
        showNotification('Connected to OBS');
      };
      
      ws.onerror = () => {
        setObsConnected(false);
        showNotification('Could not connect to OBS', 'error');
      };
      
      ws.onclose = () => {
        setObsConnected(false);
        setObsWebSocket(null);
        showNotification('Disconnected from OBS');
      };
    } catch (error) {
      showNotification('OBS connection failed', 'error');
    }
  };

  // Switch OBS scene based on device selection
  const switchOBSScene = (device) => {
    if (!obsWebSocket || !obsConnected) return;
    
    const sceneMap = {
      'tv': 'Broadcast',
      'desktop': 'Desktop',
      'tablet': 'iPad',
      'vision': 'VisionPro'
    };
    
    const sceneName = sceneMap[device];
    if (!sceneName) return;
    
    // OBS WebSocket 5.x protocol
    const message = {
      op: 6, // Request
      d: {
        requestType: 'SetCurrentProgramScene',
        requestId: Date.now().toString(),
        requestData: {
          sceneName: sceneName
        }
      }
    };
    
    obsWebSocket.send(JSON.stringify(message));
  };

  // Start streaming
  const goLive = async () => {
    if (!obsConnected) {
      showNotification('Connect to OBS first', 'error');
      return;
    }
    
    // Start OBS streaming
    const startStreamMessage = {
      op: 6,
      d: {
        requestType: 'StartStream',
        requestId: Date.now().toString()
      }
    };
    
    obsWebSocket.send(JSON.stringify(startStreamMessage));
    
    // Generate stream URL (this would come from your streaming provider)
    const liveStreamUrl = `https://y8t.live/broadcast/${Date.now()}`;
    setStreamUrl(liveStreamUrl);
    setIsLive(true);
    
    // Post to Farcaster
    await postToFarcaster(liveStreamUrl);
    
    showNotification('🔴 You are now LIVE!');
  };

  // Stop streaming
  const stopLive = () => {
    if (!obsWebSocket) return;
    
    const stopStreamMessage = {
      op: 6,
      d: {
        requestType: 'StopStream',
        requestId: Date.now().toString()
      }
    };
    
    obsWebSocket.send(JSON.stringify(stopStreamMessage));
    
    setIsLive(false);
    setStreamUrl('');
    setViewerCount(0);
    
    showNotification('Stream ended');
  };

  // Post to Farcaster when going live
  const postToFarcaster = async (streamUrl) => {
    // This would integrate with Farcaster API (via Neynar or direct)
    // For now, this is a placeholder showing the structure
    
    const castText = `🔴 LIVE NOW on Y8T Portal\n\nMulti-device creative session\n📺 Broadcast | 🖥️ Desktop | 📱 iPad | 👓 Vision Pro\n\nWatch live: ${streamUrl}`;
    
    try {
      // Example Neynar API call (requires API key)
      /*
      const response = await fetch('https://api.neynar.com/v2/farcaster/cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_key': 'YOUR_NEYNAR_API_KEY'
        },
        body: JSON.stringify({
          signer_uuid: 'YOUR_SIGNER_UUID',
          text: castText,
          embeds: [{ url: streamUrl }]
        })
      });
      */
      
      // For demo purposes, just log it
      console.log('Would post to Farcaster:', castText);
      showNotification('Posted to Farcaster! 📢');
      
      // Copy to clipboard as fallback
      navigator.clipboard.writeText(castText);
      
    } catch (error) {
      console.error('Farcaster post failed:', error);
      showNotification('Could not post to Farcaster', 'error');
    }
  };

  // Update device selection to switch OBS scenes
  const handleDeviceChange = (deviceId) => {
    setActiveDevice(deviceId);
    if (isLive && obsConnected) {
      switchOBSScene(deviceId);
    }
  };

  const renderNotification = () => {
    if (!notification) return null;
    
    return (
      <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className={`border-2 ${notification.type === 'success' ? 'border-emerald-500 bg-emerald-950' : 'border-red-500 bg-red-950'} p-4 min-w-64`}>
          <div className="flex items-center gap-3">
            <CheckCircle className={`w-5 h-5 ${notification.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`} />
            <span className="text-white text-sm">{notification.message}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderLoadingOverlay = () => {
    if (!isProcessing) return null;
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center">
        <div className="bg-black border-2 border-zinc-900 p-8 max-w-sm mx-4">
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-zinc-900 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-white text-sm font-medium tracking-wider">
                {processingMessage || 'PROCESSING...'}
              </div>
              <div className="text-zinc-600 text-xs">
                Please wait
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTransactions = () => {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="min-h-screen">
          <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
            <div className="flex items-center justify-between">
              <div className="text-xl tracking-widest text-white font-medium">TRANSACTIONS</div>
              <button onClick={() => setShowTransactions(false)} className="text-zinc-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-px">
            {transactions.length === 0 ? (
              <div className="border-2 border-zinc-900 p-12 text-center">
                <History className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <div className="text-zinc-600 text-sm">No transactions yet</div>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="bg-black border-2 border-zinc-900 p-6 hover:bg-zinc-950 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-white text-sm tracking-wider mb-2">{tx.description}</div>
                      <div className="flex items-center gap-3 text-xs text-zinc-600">
                        <span>{tx.type.toUpperCase()}</span>
                        <span>·</span>
                        <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                        <span>·</span>
                        <span className="text-emerald-500">{tx.status.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className={`text-lg font-medium ${tx.amount < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} Y8T
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCart = () => {
    const cartTotal = cart.reduce((sum, item) => {
      const itemCost = parseFloat(item.price) * item.quantity;
      return sum + itemCost * 1.02 + 0.002;
    }, 0);

    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="min-h-screen">
          <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
            <div className="flex items-center justify-between">
              <div className="text-xl tracking-widest text-white font-medium">CART</div>
              <button onClick={() => setShowCart(false)} className="text-zinc-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="border-2 border-zinc-900 p-12 text-center">
                <ShoppingCart className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <div className="text-zinc-600 text-sm mb-4">Your cart is empty</div>
                <button 
                  onClick={() => setShowCart(false)}
                  className="text-white text-sm hover:text-zinc-400 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="border-2 border-zinc-900 p-4 space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-zinc-950 border border-zinc-900 flex items-center justify-center flex-shrink-0">
                          <div className="text-2xl text-zinc-800 font-light">{item.id}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm tracking-wider mb-1">{item.name}</div>
                          <div className="text-zinc-600 text-xs mb-2">{item.type}</div>
                          <div className="text-white text-sm">{item.price} ETH each</div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-600 hover:text-red-500 transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-t border-zinc-900 pt-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 border border-zinc-800 flex items-center justify-center hover:border-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="text-white text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            disabled={item.quantity >= item.inventory}
                            className="w-8 h-8 border border-zinc-800 flex items-center justify-center hover:border-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-white text-sm font-medium">
                          {(parseFloat(item.price) * item.quantity).toFixed(3)} ETH
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-2 border-zinc-900 p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">ITEMS ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span className="text-white">
                      {cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(3)} ETH
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">PROTOCOL FEES (2%)</span>
                    <span className="text-white">
                      {(cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0) * 0.02).toFixed(3)} ETH
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">NETWORK FEES</span>
                    <span className="text-white">{(cart.length * 0.002).toFixed(3)} ETH</span>
                  </div>
                  <div className="border-t-2 border-zinc-900 pt-4 flex items-center justify-between">
                    <span className="text-white font-medium text-lg">TOTAL</span>
                    <span className="text-white text-2xl font-medium">
                      {cartTotal.toFixed(4)} ETH
                    </span>
                  </div>
                  <div className="text-xs text-zinc-600">
                    Balance after purchase: {(ethBalance - cartTotal).toFixed(4)} ETH
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="flex-1 border-2 border-zinc-900 text-white py-4 text-sm tracking-widest font-bold hover:border-zinc-800 transition-all"
                  >
                    CLEAR CART
                  </button>
                  <button
                    onClick={checkoutCart}
                    disabled={ethBalance < cartTotal}
                    className="flex-1 bg-white text-black py-4 text-sm tracking-widest font-bold hover:bg-zinc-200 transition-all disabled:bg-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed"
                  >
                    {ethBalance < cartTotal ? 'INSUFFICIENT ETH' : 'CHECKOUT'}
                  </button>
                </div>

                <div className="border-2 border-zinc-900 p-6 space-y-3">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs tracking-wider">SECURE CHECKOUT</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    All cart transactions are processed securely on BASE blockchain. Items are instantly added to your wallet.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGuestbook = () => {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="min-h-screen">
          <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
            <div className="flex items-center justify-between">
              <div className="text-xl tracking-widest text-white font-medium">GUESTBOOK</div>
              <button onClick={() => setActiveSection(null)} className="text-zinc-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="border-2 border-zinc-900 p-6 space-y-4">
              <div className="text-sm text-zinc-600 tracking-wider">WRITE ENTRY</div>
              
              <textarea
                value={guestbookMessage}
                onChange={(e) => setGuestbookMessage(e.target.value)}
                placeholder="Leave your message..."
                className="w-full bg-black border-2 border-zinc-900 p-4 text-white focus:border-white outline-none transition-all resize-none h-32 text-sm"
                maxLength={280}
              />

              <div className="flex items-center justify-between text-xs">
                <div className="text-zinc-600">
                  {guestbookMessage.length}/280
                </div>
                <div className="text-zinc-600">
                  COST: 10 Y8T
                </div>
              </div>

              <button
                onClick={handleSubmitGuestbook}
                disabled={!guestbookMessage.trim() || y8tBalance < 10}
                className="w-full bg-white text-black py-4 text-sm tracking-widest font-bold hover:bg-zinc-200 transition-all disabled:bg-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {y8tBalance < 10 ? 'INSUFFICIENT BALANCE' : 'MINT TO GUESTBOOK'}
              </button>

              <div className="text-xs text-zinc-600 text-center">
                Messages are permanently stored on-chain
              </div>
            </div>

            <div className="border-t-2 border-zinc-900 pt-6 space-y-px">
              <div className="text-xs text-zinc-600 tracking-wider mb-4 font-medium">
                ENTRIES ({guestbookEntries.length})
              </div>
              
              {guestbookEntries.map((entry) => (
                <div key={entry.id} className="bg-black border-2 border-zinc-900 p-6 space-y-3 hover:border-zinc-800 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="text-white text-sm font-mono">{entry.address}</div>
                      {entry.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="text-xs text-zinc-600 whitespace-nowrap">{entry.timestamp}</div>
                  </div>
                  
                  <div className="text-white text-sm leading-relaxed">
                    {entry.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-2 border-zinc-900 p-6 space-y-3">
              <div className="flex items-center gap-2 text-zinc-600">
                <Lock className="w-4 h-4" />
                <span className="text-xs tracking-wider">ON-CHAIN GUESTBOOK</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All guestbook entries are minted as permanent on-chain messages. 10 Y8T per entry.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTrackCheckout = () => {
    const track = audioTracks.find(t => t.id === checkoutTrack);
    
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="min-h-screen">
          <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
            <button onClick={() => setCheckoutTrack(null)} className="text-zinc-500 hover:text-white text-sm">
              ← BACK
            </button>
          </div>
          
          <div className="p-6 space-y-6 max-w-2xl mx-auto">
            <div className="border-2 border-zinc-900 p-6 space-y-6">
              <div className="text-2xl text-white tracking-wider font-medium">PURCHASE TRACK</div>
              
              <div className="border-t-2 border-zinc-900 pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white text-lg tracking-wider mb-1">{track.title}</div>
                    <div className="text-zinc-600 text-xs">{track.genre} · {track.duration} · {track.bpm} BPM</div>
                  </div>
                  <div className="text-white text-xl">{track.priceY8T} Y8T</div>
                </div>
                
                <div className="text-sm text-zinc-400 leading-relaxed">
                  Purchase this track for lifetime ownership and unlimited streaming. Once purchased, you can play this track anytime.
                </div>
              </div>

              <div className="border-t-2 border-zinc-900 pt-6 space-y-4">
                <div className="text-xs text-zinc-600 tracking-wider mb-3">PAYMENT</div>
                
                <div className="border-2 border-white bg-zinc-950 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-zinc-600" />
                      <div>
                        <div className="text-white text-sm">Y8T WALLET</div>
                        <div className="text-zinc-600 text-xs">0x742d...bEb</div>
                      </div>
                    </div>
                    <div className="text-white text-sm">{y8tBalance.toFixed(2)} Y8T</div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-zinc-900 pt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">TRACK PRICE</span>
                  <span className="text-white">{track.priceY8T} Y8T</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">PROTOCOL FEE (2%)</span>
                  <span className="text-white">{(track.priceY8T * 0.02).toFixed(2)} Y8T</span>
                </div>
                <div className="border-t-2 border-zinc-900 pt-3 flex items-center justify-between">
                  <span className="text-white font-medium">TOTAL</span>
                  <span className="text-white text-xl font-medium">
                    {(track.priceY8T * 1.02).toFixed(2)} Y8T
                  </span>
                </div>
                <div className="text-xs text-zinc-600">
                  New balance: {(y8tBalance - track.priceY8T * 1.02).toFixed(2)} Y8T
                </div>
              </div>

              <button 
                onClick={completeTrackPurchase}
                disabled={y8tBalance < track.priceY8T * 1.02}
                className="w-full bg-white text-black py-4 text-sm tracking-widest font-bold hover:bg-zinc-200 transition-all disabled:bg-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed"
              >
                {y8tBalance < track.priceY8T * 1.02 ? 'INSUFFICIENT BALANCE' : 'COMPLETE PURCHASE'}
              </button>

              <div className="text-xs text-zinc-600 text-center">
                Track will be instantly available after purchase
              </div>
            </div>

            <div className="border-2 border-zinc-900 p-6 space-y-3">
              <div className="flex items-center gap-2 text-zinc-600">
                <Lock className="w-4 h-4" />
                <span className="text-xs tracking-wider">SECURE TRANSACTION</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All transactions are processed on-chain via Y8T smart contracts. Your purchase is permanent and transferable.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCheckout = () => {
    const item = storeItems.find(i => i.id === checkoutItem);
    
    if (showCardForm) {
      return (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="min-h-screen">
            <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
              <button onClick={() => setShowCardForm(false)} className="text-zinc-500 hover:text-white text-sm">
                ← BACK
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-w-2xl mx-auto">
              <div className="border-2 border-zinc-900 p-6 space-y-6">
                <div className="text-2xl text-white tracking-wider font-medium">CARD PAYMENT</div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-600 tracking-wider mb-2 block">CARD NUMBER</label>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-black border-2 border-zinc-900 p-4 text-white focus:border-white outline-none transition-all"
                      maxLength="19"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-600 tracking-wider mb-2 block">EXPIRY</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        className="w-full bg-black border-2 border-zinc-900 p-4 text-white focus:border-white outline-none transition-all"
                        maxLength="5"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-600 tracking-wider mb-2 block">CVC</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        className="w-full bg-black border-2 border-zinc-900 p-4 text-white focus:border-white outline-none transition-all"
                        maxLength="3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-600 tracking-wider mb-2 block">CARDHOLDER NAME</label>
                    <input 
                      type="text" 
                      placeholder="FULL NAME"
                      className="w-full bg-black border-2 border-zinc-900 p-4 text-white focus:border-white outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-600 tracking-wider mb-2 block">BILLING ZIP</label>
                    <input 
                      type="text" 
                      placeholder="12345"
                      className="w-full bg-black border-2 border-zinc-900 p-4 text-white focus:border-white outline-none transition-all"
                      maxLength="5"
                    />
                  </div>
                </div>

                <div className="border-t-2 border-zinc-900 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-medium">TOTAL</span>
                    <span className="text-white text-xl font-medium">
                      ${(parseFloat(item.price) * ETH_TO_USD * (1 + PROTOCOL_FEE_PERCENTAGE) + 7.82).toFixed(2)}
                    </span>
                  </div>
                  <button className="w-full bg-white text-black py-4 text-sm tracking-widest font-bold hover:bg-zinc-200 transition-all">
                    PAY NOW
                  </button>
                </div>
              </div>

              <div className="border-2 border-zinc-900 p-6 space-y-3">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs tracking-wider">SECURE PAYMENT</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Your payment information is encrypted and processed securely via Square.
                  We never store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="min-h-screen">
          <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
            <button onClick={() => setCheckoutItem(null)} className="text-zinc-500 hover:text-white text-sm">
              ← BACK
            </button>
          </div>
          
          <div className="p-6 space-y-6 max-w-2xl mx-auto">
            <div className="border-2 border-zinc-900 p-6 space-y-6">
              <div className="text-2xl text-white tracking-wider font-medium">CHECKOUT</div>
              
              <div className="border-t-2 border-zinc-900 pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white text-lg tracking-wider mb-1">{item.name}</div>
                    <div className="text-zinc-600 text-xs">{item.type}</div>
                  </div>
                  <div className="text-white text-xl">{item.price} ETH</div>
                </div>
                
                <div className="text-sm text-zinc-400 leading-relaxed">
                  {item.description}
                </div>
                
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Package className="w-4 h-4" />
                    <span>{item.inventory} IN STOCK</span>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-zinc-900 pt-6 space-y-4">
                <div className="text-xs text-zinc-600 tracking-wider mb-3">PAYMENT METHOD</div>
                
                <button 
                  onClick={() => setPaymentMethod('wallet')}
                  className={`w-full border-2 p-4 transition-all text-left ${
                    paymentMethod === 'wallet' ? 'border-white bg-zinc-950' : 'border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-zinc-600" />
                      <div>
                        <div className="text-white text-sm">WALLET</div>
                        <div className="text-zinc-600 text-xs">0x742d...bEb</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">{ethBalance.toFixed(4)} ETH</div>
                      <div className="text-zinc-600 text-xs">{y8tBalance.toFixed(0)} Y8T</div>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full border-2 p-4 transition-all text-left ${
                    paymentMethod === 'card' ? 'border-white bg-zinc-950' : 'border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-zinc-600" />
                    <div>
                      <div className="text-white text-sm">CARD</div>
                      <div className="text-zinc-600 text-xs">Credit or Debit</div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="border-t-2 border-zinc-900 pt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">SUBTOTAL</span>
                  <span className="text-white">{item.price} ETH</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">NETWORK FEE</span>
                  <span className="text-white">0.002 ETH</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">PROTOCOL FEE (2%)</span>
                  <span className="text-white">{(parseFloat(item.price) * 0.02).toFixed(3)} ETH</span>
                </div>
                <div className="border-t-2 border-zinc-900 pt-3 flex items-center justify-between">
                  <span className="text-white font-medium">TOTAL</span>
                  <span className="text-white text-xl font-medium">
                    {paymentMethod === 'wallet' ? (
                      `${(parseFloat(item.price) * (1 + PROTOCOL_FEE_PERCENTAGE) + NETWORK_FEE_ETH).toFixed(3)} ETH`
                    ) : (
                      `$${(parseFloat(item.price) * ETH_TO_USD * (1 + PROTOCOL_FEE_PERCENTAGE) + 7.82).toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => paymentMethod === 'card' ? setShowCardForm(true) : completeStorePurchase()}
                disabled={paymentMethod === 'wallet' && ethBalance < (parseFloat(item.price) * 1.02 + 0.002)}
                className="w-full bg-white text-black py-4 text-sm tracking-widest font-bold hover:bg-zinc-200 transition-all disabled:bg-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed"
              >
                {paymentMethod === 'wallet' ? (
                  ethBalance < (parseFloat(item.price) * 1.02 + 0.002) ? 'INSUFFICIENT ETH BALANCE' : 'COMPLETE PURCHASE'
                ) : 'CONTINUE TO PAYMENT'}
              </button>

              <div className="text-xs text-zinc-600 text-center">
                By completing this purchase, you agree to our Terms of Service
              </div>
            </div>

            <div className="border-2 border-zinc-900 p-6 space-y-3">
              <div className="flex items-center gap-2 text-zinc-600">
                <Lock className="w-4 h-4" />
                <span className="text-xs tracking-wider">SECURE CHECKOUT</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {paymentMethod === 'wallet' 
                  ? 'All transactions are secured via smart contract on BASE. Your purchase is instantly verifiable on-chain and non-custodial.'
                  : 'Card payments are processed securely by Square. Your payment information is encrypted and never stored.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStore = () => {
    if (checkoutItem) {
      return renderCheckout();
    }

    if (selectedItem) {
      const item = storeItems.find(i => i.id === selectedItem);
      if (!item) return null;
      
      return (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="min-h-screen">
            <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
              <button onClick={() => setSelectedItem(null)} className="text-zinc-500 hover:text-white text-sm">
                ← BACK
              </button>
            </div>
            <div className="border-b border-zinc-900">
              <div className="aspect-square bg-zinc-950 flex items-center justify-center border-b-2 border-zinc-900">
                <div className="text-9xl text-zinc-900 font-light">{item.id}</div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl text-white tracking-wider mb-2">{item.name}</div>
                    <div className="text-zinc-500 text-xs tracking-wider">{item.type}</div>
                  </div>
                  <div className="text-white text-2xl font-medium">{item.price} ETH</div>
                </div>
                
                <div className="text-sm text-zinc-400 leading-relaxed border-t border-zinc-900 pt-4">
                  {item.description}
                </div>

                <div className="flex items-center gap-4 text-xs border-t border-zinc-900 pt-4">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Package className="w-4 h-4" />
                    <span>{item.inventory} AVAILABLE</span>
                  </div>
                  {item.inventory < 20 && (
                    <div className="flex items-center gap-2 text-red-500">
                      <TrendingUp className="w-4 h-4" />
                      <span>LOW STOCK</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addToCart(item.id)}
                    disabled={purchasedItems.some(p => p.storeItemId === item.id) || cart.some(c => c.id === item.id)}
                    className="bg-black border-2 border-zinc-900 text-white py-4 text-sm tracking-widest font-medium hover:border-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ADD TO CART
                  </button>
                  <button 
                    onClick={() => setCheckoutItem(item.id)}
                    className="bg-white text-black py-4 text-sm tracking-widest font-medium hover:bg-zinc-200 transition-all"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="min-h-screen">
          <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
            <div className="flex items-center justify-between">
              <div className="text-xl tracking-widest text-white font-medium">STORE</div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowCart(true)}
                  className="relative text-zinc-500 hover:text-white transition-all"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-black text-xs flex items-center justify-center rounded-full font-bold">
                      {cart.length}
                    </span>
                  )}
                </button>
                <button onClick={() => setActiveSection(null)} className="text-zinc-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-px bg-zinc-900">
              {storeItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className="aspect-square bg-black hover:bg-zinc-950 transition-all flex items-center justify-center group"
                >
                  <div className="text-4xl text-zinc-800 font-light group-hover:text-zinc-600 transition-all">{item.id}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAudio = () => {
    if (checkoutTrack) {
      return renderTrackCheckout();
    }

    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="min-h-screen">
          <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-30">
            <div className="flex items-center justify-between">
              <div className="text-xl tracking-widest text-white font-medium">Y8T.AUDIO</div>
              <button onClick={() => setActiveSection(null)} className="text-zinc-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <div className="text-zinc-600">YOUR BALANCE</div>
              <div className="text-white font-medium">{y8tBalance.toFixed(2)} Y8T</div>
            </div>
          </div>

          {currentTrack && ownedTracks.includes(currentTrack) && (
            <div className="p-6 border-b border-zinc-900 sticky top-[88px] bg-black z-20">
              <div className="border-2 border-zinc-900 p-6 space-y-4 bg-black">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-white text-lg tracking-wider mb-1">
                      {audioTracks.find(t => t.id === currentTrack)?.title}
                    </div>
                    <div className="text-xs text-zinc-600">
                      {audioTracks.find(t => t.id === currentTrack)?.genre} · {audioTracks.find(t => t.id === currentTrack)?.bpm} BPM
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-xs text-zinc-600 font-mono">
                    {(() => {
                      const track = audioTracks.find(t => t.id === currentTrack);
                      if (!track) return '0:00';
                      const totalSeconds = durationToSeconds(track.duration);
                      const currentSeconds = (playbackProgress / 100) * totalSeconds;
                      const mins = Math.floor(currentSeconds / 60);
                      const secs = Math.floor(currentSeconds % 60);
                      return `${mins}:${String(secs).padStart(2, '0')}`;
                    })()}
                  </div>
                  <div className="flex-1 h-1 bg-zinc-900 cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = (x / rect.width) * 100;
                    setPlaybackProgress(percentage);
                  }}>
                    <div className="h-full bg-white transition-all" style={{ width: `${playbackProgress}%` }}></div>
                  </div>
                  <div className="text-xs text-zinc-600 font-mono">
                    {audioTracks.find(t => t.id === currentTrack)?.duration}
                  </div>
                </div>

                <div className="aspect-video bg-zinc-950 border border-zinc-900 flex items-center justify-center gap-1 p-12">
                  {[...Array(WAVEFORM_BARS)].map((_, i) => {
                    // Create smooth, musical waveform animation
                    const baseFrequency = 0.08; // Slower, more musical movement
                    const phaseOffset = i * 8; // Spacing between bars
                    const time = playbackProgress * 3; // Animation speed
                    
                    // Combine multiple sine waves for complex, realistic waveform
                    const primaryWave = Math.sin((time + phaseOffset) * baseFrequency);
                    const secondaryWave = Math.sin((time + phaseOffset * 1.5) * baseFrequency * 2) * 0.5;
                    const tertiaryWave = Math.sin((time + phaseOffset * 0.7) * baseFrequency * 0.5) * 0.3;
                    
                    const combinedWave = primaryWave + secondaryWave + tertiaryWave;
                    
                    // Calculate height: 30-80% of container
                    const minHeight = 30;
                    const maxHeight = 80;
                    const heightPercent = minHeight + (Math.abs(combinedWave) / 1.8) * (maxHeight - minHeight);
                    
                    // Calculate opacity for depth effect
                    const baseOpacity = 0.4;
                    const opacityRange = 0.5;
                    const opacity = baseOpacity + (Math.abs(combinedWave) / 1.8) * opacityRange;
                    
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-emerald-500 transition-all duration-100"
                        style={{
                          height: isPlaying ? `${heightPercent}%` : '4px',
                          opacity: isPlaying ? opacity : 0.2,
                          filter: isPlaying ? 'blur(0.5px)' : 'none'
                        }}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="p-6 space-y-px">
            {audioTracks.map((track, index) => {
              const isOwned = ownedTracks.includes(track.id);
              const isCurrentTrack = currentTrack === track.id;
              const isCurrentlyPlaying = isCurrentTrack && isPlaying;
              const canAfford = y8tBalance >= track.priceY8T;
              
              return (
                <div
                  key={track.id}
                  className={`w-full bg-black border border-zinc-900 p-6 transition-all hover:border-zinc-800 ${
                    isCurrentTrack ? 'border-white' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-zinc-700 text-xs font-mono w-8">{String(index + 1).padStart(2, '0')}</div>
                      <div className="flex-1">
                        <div className={`text-base tracking-wider mb-1 ${isCurrentTrack ? 'text-white' : 'text-white'}`}>
                          {track.title}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-600">
                          <span>{track.genre}</span>
                          <span>·</span>
                          <span>{track.duration}</span>
                          <span>·</span>
                          <span>{track.bpm} BPM</span>
                          {!isOwned && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-500">{track.priceY8T} Y8T</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOwned ? (
                        <button
                          onClick={() => handlePlayPause(track.id)}
                          className={`w-10 h-10 border-2 flex items-center justify-center transition-all ${
                            isCurrentTrack ? 'border-white bg-white text-black' : 'border-zinc-800 text-zinc-600 hover:border-white hover:text-white'
                          }`}
                        >
                          {isCurrentlyPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                          )}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleBuyTrack(track.id)}
                          disabled={!canAfford}
                          className={`w-10 h-10 border-2 flex items-center justify-center transition-all ${
                            canAfford 
                              ? 'border-zinc-800 text-zinc-600 hover:border-emerald-500 hover:text-emerald-500' 
                              : 'border-zinc-900 text-zinc-800 cursor-not-allowed'
                          }`}
                          title={canAfford ? 'Buy track' : 'Insufficient balance'}
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {!isOwned && (
                    <div className="flex items-center gap-2 text-xs mt-4 pt-4 border-t border-zinc-900">
                      {canAfford ? (
                        <>
                          <Zap className="w-4 h-4 text-zinc-600" />
                          <span className="text-zinc-600">Click cart icon to purchase</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-zinc-800" />
                          <span className="text-zinc-800">Insufficient balance to purchase</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {isOwned && (
                    <div className="flex items-center gap-2 text-xs text-emerald-500 mt-4 pt-4 border-t border-zinc-900">
                      <CheckCircle className="w-4 h-4" />
                      <span>OWNED</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWallet = () => (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
          <div className="flex items-center justify-between">
            <div className="text-xl tracking-widest text-white font-medium">WALLET</div>
            <button onClick={() => setActiveSection(null)} className="text-zinc-500 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="border-2 border-zinc-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-600 tracking-wider">ETH BALANCE</div>
            </div>
            <div className="text-4xl text-white font-medium">{ethBalance.toFixed(4)} ETH</div>
            <div className="text-xs text-zinc-600">
              ≈ ${(ethBalance * ETH_TO_USD).toFixed(2)} USD
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-900">
              <button
                onClick={() => addETHFunds(0.5)}
                className="border-2 border-zinc-900 text-white py-2 text-xs tracking-wider font-medium hover:border-emerald-500 hover:text-emerald-500 transition-all"
              >
                +0.5 ETH
              </button>
              <button
                onClick={() => addETHFunds(1.0)}
                className="border-2 border-zinc-900 text-white py-2 text-xs tracking-wider font-medium hover:border-emerald-500 hover:text-emerald-500 transition-all"
              >
                +1.0 ETH
              </button>
              <button
                onClick={() => addETHFunds(5.0)}
                className="border-2 border-zinc-900 text-white py-2 text-xs tracking-wider font-medium hover:border-emerald-500 hover:text-emerald-500 transition-all"
              >
                +5.0 ETH
              </button>
            </div>
          </div>

          <div className="border-2 border-zinc-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-600 tracking-wider">Y8T BALANCE</div>
              <button 
                onClick={() => setShowTransactions(true)}
                className="text-xs text-zinc-600 hover:text-white flex items-center gap-1 transition-all"
              >
                <History className="w-4 h-4" />
                <span>HISTORY</span>
              </button>
            </div>
            <div className="text-4xl text-white font-medium">{y8tBalance.toFixed(2)} Y8T</div>
            <div className="text-xs text-zinc-600">
              ≈ ${(y8tBalance * Y8T_TO_USD).toFixed(2)} USD
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-900">
              <button
                onClick={() => addY8TFunds(100)}
                className="border-2 border-zinc-900 text-white py-2 text-xs tracking-wider font-medium hover:border-emerald-500 hover:text-emerald-500 transition-all"
              >
                +100 Y8T
              </button>
              <button
                onClick={() => addY8TFunds(500)}
                className="border-2 border-zinc-900 text-white py-2 text-xs tracking-wider font-medium hover:border-emerald-500 hover:text-emerald-500 transition-all"
              >
                +500 Y8T
              </button>
              <button
                onClick={() => addY8TFunds(1000)}
                className="border-2 border-zinc-900 text-white py-2 text-xs tracking-wider font-medium hover:border-emerald-500 hover:text-emerald-500 transition-all"
              >
                +1000 Y8T
              </button>
            </div>
          </div>

          <div className="border-t-2 border-zinc-900 pt-6">
            <div className="text-xs text-zinc-600 tracking-wider mb-4 font-medium">DIGITAL COLLECTIBLES</div>
            <div className="space-y-2">
              {purchasedItems.map((item) => (
                <div key={item.id} className="border-2 border-zinc-900 p-4 hover:bg-zinc-950 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                      <div className="text-2xl text-zinc-800 font-light">{item.image}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="text-white text-sm tracking-wider truncate">{item.name}</div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {item.status === 'ACTIVE' && (
                            <div className="flex items-center gap-1 text-emerald-500">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs">ACTIVE</span>
                            </div>
                          )}
                          {item.status === 'OWNED' && (
                            <div className="flex items-center gap-1 text-blue-500">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs">OWNED</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-600">
                        <span>{item.type}</span>
                        <span>·</span>
                        <span>{item.date}</span>
                        <span>·</span>
                        <span>{item.value}</span>
                      </div>
                      {item.expires && (
                        <div className="text-xs text-zinc-500 mt-2">
                          Expires: {item.expires}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {ownedTracks.length > 0 && (
            <div className="border-t-2 border-zinc-900 pt-6">
              <div className="text-xs text-zinc-600 tracking-wider mb-4 font-medium">OWNED TRACKS</div>
              <div className="space-y-2">
                {ownedTracks.map((trackId) => {
                  const track = audioTracks.find(t => t.id === trackId);
                  return (
                    <div key={trackId} className="border-2 border-zinc-900 p-4 hover:bg-zinc-950 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                          <Music className="w-8 h-8 text-zinc-800" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="text-white text-sm tracking-wider truncate">{track.title}</div>
                            <div className="flex items-center gap-1 text-emerald-500 flex-shrink-0">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs">OWNED</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-zinc-600">
                            <span>{track.genre}</span>
                            <span>·</span>
                            <span>{track.duration}</span>
                            <span>·</span>
                            <span>{track.priceY8T} Y8T</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-2 border-zinc-900 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600 tracking-wider">TOTAL VALUE</span>
              <span className="text-white text-lg font-medium">0.65 ETH</span>
            </div>
            <div className="text-xs text-zinc-600 leading-relaxed">
              Your collectibles represent ownership rights and access privileges on the Y8T protocol.
            </div>
          </div>

          <div className="border-2 border-zinc-900 p-6 space-y-3">
            <div className="flex items-center gap-2 text-zinc-600">
              <Activity className="w-4 h-4" />
              <span className="text-xs tracking-wider">DATA MANAGEMENT</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Your wallet data is saved locally in your browser. Click below to reset all data and start fresh.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all data? This will clear your balances, purchases, and transaction history. This cannot be undone.')) {
                  clearLocalStorage();
                  window.location.reload();
                }
              }}
              className="w-full border-2 border-red-900 text-red-500 py-3 text-xs tracking-widest font-medium hover:border-red-500 hover:bg-red-950 transition-all"
            >
              RESET ALL DATA
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVideoCheckout = () => {
    const video = videoContent.find(v => v.id === checkoutVideo);
    
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="min-h-screen">
          <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
            <button onClick={() => setCheckoutVideo(null)} className="text-zinc-500 hover:text-white text-sm">
              ← BACK
            </button>
          </div>
          
          <div className="p-6 space-y-6 max-w-2xl mx-auto">
            <div className="border-2 border-zinc-900 p-6 space-y-6">
              <div className="text-2xl text-white tracking-wider font-medium">PURCHASE VIDEO</div>
              
              <div className="border-t-2 border-zinc-900 pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white text-lg tracking-wider mb-1">{video.title}</div>
                    <div className="text-zinc-600 text-xs">{video.category} · {video.duration} · {video.resolution} · {video.year}</div>
                  </div>
                  <div className="text-white text-xl">{video.priceY8T} Y8T</div>
                </div>
                
                <div className="text-sm text-zinc-400 leading-relaxed">
                  {video.description}
                </div>
              </div>

              <div className="border-t-2 border-zinc-900 pt-6 space-y-4">
                <div className="text-xs text-zinc-600 tracking-wider mb-3">PAYMENT</div>
                
                <div className="border-2 border-white bg-zinc-950 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-zinc-600" />
                      <div>
                        <div className="text-white text-sm">Y8T WALLET</div>
                        <div className="text-zinc-600 text-xs">0x742d...bEb</div>
                      </div>
                    </div>
                    <div className="text-white text-sm">{y8tBalance.toFixed(2)} Y8T</div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-zinc-900 pt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">VIDEO PRICE</span>
                  <span className="text-white">{video.priceY8T} Y8T</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">PROTOCOL FEE (2%)</span>
                  <span className="text-white">{(video.priceY8T * 0.02).toFixed(2)} Y8T</span>
                </div>
                <div className="border-t-2 border-zinc-900 pt-3 flex items-center justify-between">
                  <span className="text-white font-medium">TOTAL</span>
                  <span className="text-white text-xl font-medium">
                    {(video.priceY8T * 1.02).toFixed(2)} Y8T
                  </span>
                </div>
                <div className="text-xs text-zinc-600">
                  New balance: {(y8tBalance - video.priceY8T * 1.02).toFixed(2)} Y8T
                </div>
              </div>

              <button 
                onClick={completeVideoPurchase}
                disabled={y8tBalance < video.priceY8T * 1.02}
                className="w-full bg-white text-black py-4 text-sm tracking-widest font-bold hover:bg-zinc-200 transition-all disabled:bg-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed"
              >
                {y8tBalance < video.priceY8T * 1.02 ? 'INSUFFICIENT BALANCE' : 'COMPLETE PURCHASE'}
              </button>

              <div className="text-xs text-zinc-600 text-center">
                Video will be instantly available for streaming after purchase
              </div>
            </div>

            <div className="border-2 border-zinc-900 p-6 space-y-3">
              <div className="flex items-center gap-2 text-zinc-600">
                <Lock className="w-4 h-4" />
                <span className="text-xs tracking-wider">SECURE TRANSACTION</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All transactions are processed on-chain via Y8T smart contracts. Your purchase is permanent and includes lifetime streaming access.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVideo = () => {
    if (checkoutVideo) {
      return renderVideoCheckout();
    }

    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="min-h-screen">
          <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-30">
            <div className="flex items-center justify-between">
              <div className="text-xl tracking-widest text-white font-medium">Y8T.VIDEO</div>
              <button onClick={() => setActiveSection(null)} className="text-zinc-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <div className="text-zinc-600">YOUR BALANCE</div>
              <div className="text-white font-medium">{y8tBalance.toFixed(2)} Y8T</div>
            </div>
          </div>

          {currentVideo && ownedVideos.includes(currentVideo) && (
            <div className="p-6 border-b border-zinc-900 sticky top-[88px] bg-black z-20">
              <div className="border-2 border-zinc-900 p-6 space-y-4 bg-black">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-lg tracking-wider font-medium">
                      {videoContent.find(v => v.id === currentVideo)?.title}
                    </div>
                    <div className="text-xs text-zinc-600">
                      {videoContent.find(v => v.id === currentVideo)?.category} · {videoContent.find(v => v.id === currentVideo)?.resolution}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="w-12 h-12 border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                  >
                    {isVideoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-xs text-zinc-600 font-mono">
                    {(() => {
                      const video = videoContent.find(v => v.id === currentVideo);
                      if (!video) return '0:00';
                      const totalSeconds = durationToSeconds(video.duration);
                      const currentSeconds = (videoProgress / 100) * totalSeconds;
                      const mins = Math.floor(currentSeconds / 60);
                      const secs = Math.floor(currentSeconds % 60);
                      return `${mins}:${String(secs).padStart(2, '0')}`;
                    })()}
                  </div>
                  <div className="flex-1 h-1 bg-zinc-900 cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = (x / rect.width) * 100;
                    setVideoProgress(percentage);
                  }}>
                    <div className="h-full bg-white transition-all" style={{ width: `${videoProgress}%` }}></div>
                  </div>
                  <div className="text-xs text-zinc-600 font-mono">
                    {videoContent.find(v => v.id === currentVideo)?.duration}
                  </div>
                </div>

                <div className="aspect-video bg-zinc-950 border border-zinc-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950"></div>
                  <div className="relative z-10 text-zinc-700 text-6xl font-light">
                    {videoContent.find(v => v.id === currentVideo)?.id}
                  </div>
                  {isVideoPlaying && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white" style={{ width: `${videoProgress}%` }}></div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-6 space-y-px">
            {videoContent.map((video, index) => {
              const isOwned = ownedVideos.includes(video.id);
              const isCurrentVideo = currentVideo === video.id;
              const isCurrentlyPlaying = isCurrentVideo && isVideoPlaying;
              const canAfford = y8tBalance >= video.priceY8T;
              
              return (
                <div 
                  key={video.id} 
                  className={`bg-black border-2 p-6 transition-all ${
                    isCurrentVideo ? 'border-white bg-zinc-950' : 'border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-32 aspect-video bg-zinc-950 border border-zinc-900 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950"></div>
                      <div className="relative z-10 text-4xl text-zinc-800 font-light">{video.id}</div>
                      <div className="absolute top-2 right-2 text-xs text-zinc-600 bg-black px-2 py-1">
                        {video.duration}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-white text-lg tracking-wider font-medium mb-1">
                            {video.title}
                          </div>
                          <div className="text-xs text-zinc-600">
                            {video.category} · {video.resolution} · {video.year}
                          </div>
                        </div>
                        {!isOwned && (
                          <div className="text-emerald-500 text-sm font-medium whitespace-nowrap">
                            {video.priceY8T} Y8T
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-zinc-400 leading-relaxed">
                        {video.description}
                      </div>

                      {!isOwned && (
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => handleBuyVideo(video.id)}
                            disabled={!canAfford}
                            className={`px-6 py-2 text-xs tracking-widest font-medium transition-all ${
                              canAfford
                                ? 'bg-white text-black hover:bg-zinc-200'
                                : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                            }`}
                          >
                            {canAfford ? 'BUY NOW' : 'INSUFFICIENT BALANCE'}
                          </button>
                        </div>
                      )}

                      {isOwned && (
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => handleVideoPlayPause(video.id)}
                            className="px-6 py-2 bg-white text-black text-xs tracking-widest font-medium hover:bg-zinc-200 transition-all flex items-center gap-2"
                          >
                            {isCurrentlyPlaying ? (
                              <>
                                <Pause className="w-4 h-4" />
                                PAUSE
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4" />
                                {isCurrentVideo ? 'RESUME' : 'PLAY'}
                              </>
                            )}
                          </button>
                          <div className="flex items-center gap-2 text-xs text-emerald-500">
                            <CheckCircle className="w-4 h-4" />
                            <span>OWNED</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderGallery = () => {
    if (selectedItem) {
      const item = galleryItems.find(i => i.id === selectedItem);
      if (!item) return null;
      
      return (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="min-h-screen">
            <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
              <button onClick={() => setSelectedItem(null)} className="text-zinc-500 hover:text-white text-sm">
                ← BACK
              </button>
            </div>
            <div className="border-b border-zinc-900">
              <div className="aspect-square bg-gradient-to-br from-zinc-900 via-zinc-950 to-black"></div>
              <div className="p-6 space-y-4">
                <div className="text-2xl text-white tracking-wider">{item.title}</div>
                <div className="flex items-center justify-between text-zinc-500 text-sm">
                  <div>{item.medium}</div>
                  <div>{item.year}</div>
                </div>
                <button className="w-full bg-white text-black py-4 text-sm tracking-widest font-medium hover:bg-zinc-200 transition-all">
                  VIEW
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="min-h-screen">
          <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
            <div className="flex items-center justify-between">
              <div className="text-xl tracking-widest text-white font-medium">GALLERY</div>
              <button onClick={() => setActiveSection(null)} className="text-zinc-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-px bg-zinc-900">
              {galleryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className="aspect-square bg-black hover:bg-zinc-950 transition-all flex items-center justify-center group"
                >
                  <div className="text-4xl text-zinc-800 font-light group-hover:text-zinc-600 transition-all">{item.id}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDocs = () => {
    if (viewingDoc) {
      const allDocs = documents.flatMap(cat => cat.items);
      const doc = allDocs.find(d => d.id === selectedDoc);
      
      return (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="min-h-screen">
            <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
              <button onClick={() => setViewingDoc(false)} className="text-zinc-500 hover:text-white text-sm">
                ← BACK
              </button>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-zinc-900 bg-zinc-950 p-8">
                <div className="text-xl text-white tracking-wider font-medium mb-6">{doc.title}</div>
                <div className="text-sm text-zinc-400 whitespace-pre-wrap font-mono leading-relaxed">
                  {doc.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedDoc) {
      const allDocs = documents.flatMap(cat => cat.items);
      const doc = allDocs.find(d => d.id === selectedDoc);
      
      return (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="min-h-screen">
            <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
              <button onClick={() => setSelectedDoc(null)} className="text-zinc-500 hover:text-white text-sm">
                ← BACK
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="border-2 border-zinc-900 p-6 space-y-4">
                <div className="text-2xl text-white tracking-wider font-medium">{doc.title}</div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-zinc-600 mb-1 text-xs tracking-wider">DATE</div>
                    <div className="text-white">{doc.date}</div>
                  </div>
                  <div>
                    <div className="text-zinc-600 mb-1 text-xs tracking-wider">SIZE</div>
                    <div className="text-white">{doc.size}</div>
                  </div>
                  <div>
                    <div className="text-zinc-600 mb-1 text-xs tracking-wider">STATUS</div>
                    <div className={`${
                      doc.status === 'PUBLIC' ? 'text-emerald-500' :
                      doc.status === 'MEMBERS' ? 'text-blue-500' :
                      'text-zinc-500'
                    }`}>{doc.status}</div>
                  </div>
                  <div>
                    <div className="text-zinc-600 mb-1 text-xs tracking-wider">TYPE</div>
                    <div className="text-white">TXT</div>
                  </div>
                </div>

                <div className="border-t-2 border-zinc-900 pt-4 space-y-2">
                  <div className="text-xs text-zinc-600 mb-3">DOCUMENT PREVIEW</div>
                  <div className="bg-zinc-950 border border-zinc-900 p-8 aspect-video flex items-center justify-center">
                    <FileText className="w-16 h-16 text-zinc-800" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {doc.status !== 'LOCKED' && (
                    <>
                      <button 
                        onClick={() => handleDownload(doc)}
                        className="bg-white text-black py-4 text-xs tracking-widest font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        DOWNLOAD
                      </button>
                      <button 
                        onClick={() => setViewingDoc(true)}
                        className="border-2 border-zinc-900 py-4 text-xs tracking-widest font-bold hover:border-zinc-800 text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        VIEW
                      </button>
                    </>
                  )}
                  {doc.status === 'LOCKED' && (
                    <button className="col-span-2 border-2 border-zinc-900 py-4 text-xs tracking-widest font-bold text-zinc-600 flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock className="w-4 h-4" />
                      MEMBERS ONLY
                    </button>
                  )}
                </div>
              </div>

              <div className="border-2 border-zinc-900 p-6 space-y-3">
                <div className="text-xs text-zinc-600 tracking-wider">DESCRIPTION</div>
                <p className="text-white text-sm leading-relaxed">
                  {doc.content.split('\n\n')[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="min-h-screen">
          <div className="border-b border-zinc-900 p-6 sticky top-0 bg-black z-10">
            <div className="flex items-center justify-between">
              <div className="text-xl tracking-widest text-white font-medium">DOCS</div>
              <button onClick={() => setActiveSection(null)} className="text-zinc-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-px">
            {documents.map((category) => (
              <div key={category.id} className="bg-black border-2 border-zinc-900">
                <div className="p-6 border-b border-zinc-900">
                  <div className="text-base tracking-widest text-white font-medium">{category.category}</div>
                </div>
                {category.items.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className="w-full p-6 border-t border-zinc-900 hover:bg-zinc-950 transition-all text-left group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-white text-sm tracking-wider mb-2">{doc.title}</div>
                        <div className="flex items-center gap-3 text-xs text-zinc-600">
                          <span>{doc.date}</span>
                          <span>·</span>
                          <span>{doc.size}</span>
                          <span>·</span>
                          <span className={`${
                            doc.status === 'PUBLIC' ? 'text-emerald-500' :
                            doc.status === 'MEMBERS' ? 'text-blue-500' :
                            'text-zinc-500'
                          }`}>{doc.status}</span>
                        </div>
                      </div>
                      {doc.status === 'LOCKED' ? (
                        <Lock className="w-4 h-4 text-zinc-700 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-all flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderVideoFrame = () => {
    // Show live stream if broadcasting
    if (isLive && streamUrl) {
      return (
        <div className="relative border-2 border-zinc-900 bg-black overflow-hidden">
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-bold tracking-wider">LIVE</span>
            </div>
            <div className="bg-black/80 px-3 py-1">
              <span className="text-white text-xs">{viewerCount} watching</span>
            </div>
          </div>
          
          {/* Live stream player - this would be your Mux/Cloudflare Stream embed */}
          <div className="aspect-video bg-zinc-950 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <Activity className="w-16 h-16 text-emerald-500 mx-auto animate-pulse" />
              <div className="text-white text-lg font-medium">STREAMING LIVE</div>
              <div className="text-zinc-600 text-xs">
                {activeDevice === 'tv' && '📺 BROADCAST CAMERA'}
                {activeDevice === 'desktop' && '🖥️ DESKTOP SCREEN'}
                {activeDevice === 'tablet' && '📱 iPAD VIEW'}
                {activeDevice === 'vision' && '👓 VISION PRO POV'}
              </div>
              
              {/* In production, replace with actual video player */}
              {/* <video 
                src={streamUrl} 
                autoPlay 
                controls 
                className="w-full h-full"
              /> */}
              
              {/* Or Mux player: */}
              {/* <MuxPlayer
                streamType="live"
                playbackId="YOUR_MUX_PLAYBACK_ID"
                metadata={{
                  video_title: "Y8T Live Stream"
                }}
              /> */}
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 z-20">
            <button
              onClick={stopLive}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold tracking-wider transition-all"
            >
              END STREAM
            </button>
          </div>
        </div>
      );
    }

    // Show device icon when not live
    const getDeviceInfo = () => {
      switch(activeDevice) {
        case 'vision':
          return { icon: Glasses, label: 'VISION.PRO' };
        case 'tablet':
          return { icon: Tablet, label: 'iPAD.PRO' };
        case 'tv':
          return { icon: Tv, label: 'BROADCAST' };
        default:
          return { icon: Monitor, label: 'DESKTOP' };
      }
    };

    const { icon: Icon, label } = getDeviceInfo();

    return (
      <div className="flex items-center justify-center gap-3 py-6">
        <Icon className="w-6 h-6 text-zinc-600" />
        <span className="text-xs tracking-widest text-zinc-600 font-medium">{label}</span>
      </div>
    );
  };

  if (showTransactions) {
    return renderTransactions();
  }

  if (showCart) {
    return renderCart();
  }

  return (
    <div className="min-h-screen bg-black text-zinc-400 pb-12">
      {renderNotification()}
      {renderLoadingOverlay()}
      {activeSection === 'store' && renderStore()}
      {activeSection === 'gallery' && renderGallery()}
      {activeSection === 'audio' && renderAudio()}
      {activeSection === 'video' && renderVideo()}
      {activeSection === 'docs' && renderDocs()}
      {activeSection === 'wallet' && renderWallet()}
      {activeSection === 'guestbook' && renderGuestbook()}

      {!activeSection && (
        <>
          <div className="border-b border-zinc-900 px-6 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="text-3xl font-medium tracking-widest text-white">
                  Y8T
                </div>
                <div className="text-xs text-zinc-600 font-mono">
                  {time.toLocaleTimeString('en-US', { hour12: false })}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        
        <div className="space-y-4">
          {renderVideoFrame()}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'tv', label: 'CAST', icon: Tv },
            { id: 'vision', label: 'VIS', icon: Glasses },
            { id: 'tablet', label: 'PAD', icon: Tablet },
            { id: 'desktop', label: 'DESK', icon: Monitor }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleDeviceChange(id)}
              className={`py-4 text-xs tracking-widest transition-all border-2 flex flex-col items-center gap-2 font-medium ${
                activeDevice === id 
                  ? 'bg-white text-black border-white' 
                  : 'border-zinc-900 hover:border-zinc-800 text-zinc-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
              {isLive && activeDevice === id && (
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Go Live / Connect OBS Controls */}
        <div className="border-2 border-zinc-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className={`w-5 h-5 ${obsConnected ? 'text-emerald-500' : 'text-zinc-600'}`} />
              <span className="text-white text-sm tracking-wider font-medium">
                {obsConnected ? 'OBS CONNECTED' : 'OBS DISCONNECTED'}
              </span>
            </div>
            {!obsConnected && (
              <button
                onClick={connectToOBS}
                className="text-xs text-zinc-600 hover:text-white tracking-wider transition-all"
              >
                CONNECT
              </button>
            )}
          </div>

          {obsConnected && !isLive && (
            <button
              onClick={goLive}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-sm tracking-widest font-bold transition-all flex items-center justify-center gap-2"
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
              GO LIVE
            </button>
          )}

          {isLive && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">STREAM STATUS</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">LIVE</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">VIEWERS</span>
                <span className="text-white font-medium">{viewerCount}</span>
              </div>
              <div className="text-xs text-zinc-600 break-all">
                {streamUrl}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(streamUrl)}
                className="w-full border-2 border-zinc-900 text-white py-3 text-xs tracking-widest font-medium hover:border-white transition-all"
              >
                COPY STREAM LINK
              </button>
            </div>
          )}

          <div className="text-xs text-zinc-600 leading-relaxed pt-3 border-t border-zinc-900">
            {obsConnected 
              ? 'Switch devices to change OBS scenes. Click GO LIVE to start streaming and post to Farcaster.'
              : 'Install OBS with WebSocket plugin (ws://localhost:4455) to enable live streaming.'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setActiveSection('wallet')}
            className="border-2 border-zinc-900 p-6 hover:bg-zinc-950 hover:border-zinc-800 transition-all flex flex-col items-center gap-3"
          >
            <Wallet className="w-6 h-6 text-zinc-600" />
            <span className="text-xs tracking-widest font-medium text-white">WALLET</span>
            <div className="text-xs text-zinc-600">{y8tBalance.toFixed(2)} Y8T</div>
          </button>
          <button 
            onClick={() => setActiveSection('guestbook')}
            className="border-2 border-zinc-900 p-6 hover:bg-zinc-950 hover:border-zinc-800 transition-all flex flex-col items-center gap-3"
          >
            <MessageSquare className="w-6 h-6 text-zinc-600" />
            <span className="text-xs tracking-widest font-medium text-white">GUESTBOOK</span>
            <div className="text-xs text-zinc-600">{guestbookEntries.length} ENTRIES</div>
          </button>
        </div>

        <div className="space-y-px">
          {[
            { label: 'STORE', status: 'MINT', icon: ShoppingBag, action: 'store' },
            { label: 'GALLERY', status: 'VIEW', icon: Image, action: 'gallery' },
            { label: 'AUDIO', status: 'PLAY', icon: Music, action: 'audio' },
            { label: 'VIDEO', status: 'WATCH', icon: Video, action: 'video' },
            { label: 'DOCS', status: 'READ', icon: FileText, action: 'docs' }
          ].map(({ label, status, icon: Icon, action }) => (
            <button
              key={label}
              onClick={() => action && setActiveSection(action)}
              className="w-full bg-black border-2 border-zinc-900 p-6 hover:bg-zinc-950 hover:border-zinc-800 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Icon className="w-5 h-5 text-zinc-600" />
                  <div className="text-base tracking-widest text-white font-medium">{label}</div>
                </div>
                <div className="text-xs text-zinc-600 font-medium">{status}</div>
              </div>
            </button>
          ))}
        </div>

      </div>
      </>
      )}
    </div>
  );
}

export default Portal;

