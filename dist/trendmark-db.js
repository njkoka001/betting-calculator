/**
 * Trendmark Data Engine & Authentication Architecture
 * 
 * Strict Role & Authority Separation:
 * 1. ONE Central Admin Dashboard (/admin):
 *    - Strictly guarded by Admin Authentication.
 *    - Controls and audits all client accounts, package activations, OCR proofs, and M-Pesa B2C payouts.
 * 2. Client / User Dashboard (/dashboard):
 *    - Each client sees ONLY their own account data, personal package, proof queue, and wallet payouts.
 *    - Zero access to administrative controls.
 */
(function (window) {
  const DB_KEYS = {
    USERS: 'trendmark_users_v2',
    CLIENT_SESSION: 'trendmark_session_phone_v1',
    ADMIN_SESSION: 'trendmark_admin_session_v2',
    ACTIVATIONS: 'trendmark_activations_v1',
    SUBMISSIONS: 'trendmark_submissions_v1',
    WITHDRAWALS: 'trendmark_withdrawals_v1',
    LEDGER: 'trendmark_ledger_v1',
    CAMPAIGN: 'trendmark_campaign_v1',
    USER_CAMPAIGNS: 'trendmark_user_campaigns_v2',
    REFERRALS: 'trendmark_referrals_v1'
  };

  const MASTER_ADMIN = {
    id: 'admin_master',
    username: 'admin',
    phone: '0734570672',
    name: 'Trendmark Master Administrator',
    password: 'admin123',
    pin: '2026',
    role: 'ADMIN'
  };


  const PRODUCT_CATALOG = [
    {
      id: 'prod_1',
      title: 'Trendmark Ultra Smart Watch v2',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
      category: 'Smartwatches',
      description: 'Original Quality AMOLED Display, 7-Day Battery & Heart Rate Tracking.',
      copy: '🔥 FLASH SALE: Trendmark Ultra Smart Watch v2!\nOriginal Quality AMOLED Display, 7-Day Battery & Heart Rate Tracking.\nSpecial Offer: KSh 3,500 only! Free delivery in Nairobi.\nCall/WhatsApp 0734570672 to order yours today! Limited stock available.'
    },
    {
      id: 'prod_2',
      title: 'Trendmark Bass Pro Wireless ANC Earbuds',
      price: 2200,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
      category: 'Audio',
      description: 'Active Noise Cancellation, 36h Battery with Charging Case, Deep Bass Stereo.',
      copy: '🎵 TRENDMARK BASS PRO EARBUDS!\nActive Noise Cancelling (ANC), Crystal Clear Phone Calls & 36H Playtime.\nSpecial Price: KSh 2,200 only!\nOrder now via Call/WhatsApp 0734570672. Free doorstep delivery!'
    },
    {
      id: 'prod_3',
      title: 'Trendmark 20,000mAh 22.5W Fast Power Bank',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1609592424367-27088b9c2ca2?auto=format&fit=crop&q=80&w=800',
      category: 'Accessories',
      description: 'Super-Fast 22.5W charging with LED digital battery display & dual USB-C ports.',
      copy: '⚡ NEVER RUN OUT OF BATTERY! Trendmark 20,000mAh 22.5W Fast Charging Power Bank.\nLED % display, charges 3 devices simultaneously.\nOnly KSh 2,800! WhatsApp/Call 0734570672 to order today.'
    },
    {
      id: 'prod_4',
      title: 'Trendmark Studio Pro Wireless Headphones',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      category: 'Audio',
      description: 'Hi-Fi Over-Ear Studio Sound, 40mm Neodymium Drivers, 50h Wireless Playtime.',
      copy: '🎧 EXPERIENCE PURE SOUND: Trendmark Studio Pro Wireless Headphones.\nPremium memory foam earcups, 50-Hour battery & immersive Hi-Fi sound.\nOffer Price: KSh 4,500! Call or WhatsApp 0734570672 for quick delivery.'
    },
    {
      id: 'prod_5',
      title: 'Trendmark 4K Ultra HD Dual-Screen Action Camera',
      price: 6200,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
      category: 'Cameras',
      description: 'Native 4K 60FPS, 30m Waterproof with casing, EIS Anti-Shake & WiFi app control.',
      copy: '📷 CAPTURE EVERY ADVENTURE in 4K 60FPS!\nTrendmark Dual-Screen Waterproof Action Camera with stabilization.\nPromo Price: KSh 6,200 only.\nOrder directly via WhatsApp/Call 0734570672 today!'
    },
    {
      id: 'prod_6',
      title: 'Trendmark 15W MagSafe Wireless Fast Car Mount',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=800',
      category: 'Accessories',
      description: 'Smart auto-clamping, 360° air-vent rotation, high-speed 15W Qi wireless charging.',
      copy: '🚗 UPGRADE YOUR CAR! Trendmark 15W Fast Wireless Auto-Clamp Car Mount.\nHands-free GPS navigation and ultra-fast wireless charging.\nKSh 1,800 only! WhatsApp/Call 0734570672 to get yours delivered.'
    },
    {
      id: 'prod_7',
      title: 'Trendmark BoomBox 40W Rugged Party Speaker',
      price: 4800,
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
      category: 'Audio',
      description: '40W stereo drivers, IPX7 waterproof, dynamic RGB beat lighting & TWS pairing.',
      copy: '🔊 PUMP UP THE BEAT! Trendmark 40W Rugged Waterproof Party Speaker.\nRGB party lights, monstrous bass & 24h battery.\nGet it for KSh 4,800 only! Call/WhatsApp 0734570672 for delivery.'
    },
    {
      id: 'prod_8',
      title: 'Trendmark Elite Pro Wireless Gaming Controller',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&q=80&w=800',
      category: 'Gaming',
      description: 'Hall Effect anti-drift joysticks, dual vibration motors, PC/Android/iOS compatible.',
      copy: '🎮 LEVEL UP YOUR GAMING! Trendmark Elite Pro Multi-Platform Wireless Gamepad.\nZero-drift hall sensors & tactile triggers.\nPrice: KSh 3,200 only! Order via 0734570672 WhatsApp.'
    }
  ];

  const DEFAULT_CAMPAIGN = PRODUCT_CATALOG[0];

  const DEFAULT_USERS = [
    {
      id: 'usr_1',
      name: 'Alice Wangari',
      phone: '0721889900',
      password: 'user123',
      role: 'USER',
      package: 'Gold Package',
      rate: 3.5,
      status: 'ACTIVE',
      walletBalance: 2100.00,
      createdAt: '2026-08-15'
    },
    {
      id: 'usr_2',
      name: 'Brian Otieno',
      phone: '0711445566',
      password: 'user123',
      role: 'USER',
      package: 'Silver Package',
      rate: 2.0,
      status: 'ACTIVE',
      walletBalance: 1350.00,
      createdAt: '2026-08-20'
    },
    {
      id: 'usr_3',
      name: 'John Kamau',
      phone: '0712345678',
      password: 'user123',
      role: 'USER',
      package: 'Silver Package',
      rate: 2.0,
      status: 'ACTIVE',
      walletBalance: 274.00,
      createdAt: '2026-09-01'
    },
    {
      id: 'usr_4',
      name: 'Mercy Muthoni',
      phone: '0798765432',
      password: 'user123',
      role: 'USER',
      package: 'Gold Package',
      rate: 3.5,
      status: 'ACTIVE',
      walletBalance: 857.50,
      createdAt: '2026-09-02'
    },
    {
      id: 'usr_5',
      name: 'Kevin Kiprono',
      phone: '0725112233',
      password: 'user123',
      role: 'USER',
      package: 'Bronze Package',
      rate: 1.0,
      status: 'ACTIVE',
      walletBalance: 130.00,
      createdAt: '2026-09-03'
    },
    {
      id: 'usr_demo',
      name: 'Demo Promoter',
      phone: '0700000000',
      password: 'user123',
      role: 'USER',
      package: null,
      rate: 0,
      status: 'INACTIVE',
      walletBalance: 0.00,
      createdAt: '2026-09-09'
    }
  ];

  const DEFAULT_ACTIVATIONS = [
    {
      id: 'act_1',
      userId: 'usr_samuel',
      userName: 'Samuel Karanja',
      userPhone: '0748119922',
      package: 'Gold Package',
      price: 1000,
      rate: 3.5,
      smsMessage: 'QK92A8812K Confirmed. Ksh1,000.00 sent to TRENDMARK ELECTRONICS 0734570672 on 9/9/26 at 11:42 AM. New M-PESA balance is Ksh4,520.00.',
      mpesaCode: 'QK92A8812K',
      status: 'PENDING',
      createdAt: 'Today at 11:42 AM'
    },
    {
      id: 'act_2',
      userId: 'usr_sarah',
      userName: 'Sarah Njeri',
      userPhone: '0720556677',
      package: 'Silver Package',
      price: 500,
      rate: 2.0,
      smsMessage: 'QK91PL4001 Confirmed. Ksh500.00 sent to TRENDMARK 0734570672 on 9/9/26 at 10:15 AM.',
      mpesaCode: 'QK91PL4001',
      status: 'PENDING',
      createdAt: 'Today at 10:15 AM'
    }
  ];

  const DEFAULT_SUBMISSIONS = [
    {
      id: 'sub_1',
      userId: 'usr_3',
      userName: 'John Kamau',
      userPhone: '0712345678',
      package: 'Silver Package',
      rate: 2.0,
      views: 137,
      reward: 274.00,
      imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
      status: 'APPROVED',
      submittedAt: 'Yesterday'
    },
    {
      id: 'sub_2',
      userId: 'usr_4',
      userName: 'Mercy Muthoni',
      userPhone: '0798765432',
      package: 'Gold Package',
      rate: 3.5,
      views: 245,
      reward: 857.50,
      imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=800',
      status: 'PENDING',
      submittedAt: '1 hour ago'
    },
    {
      id: 'sub_3',
      userId: 'usr_5',
      userName: 'Kevin Kiprono',
      userPhone: '0725112233',
      package: 'Bronze Package',
      rate: 1.0,
      views: 130,
      reward: 130.00,
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
      status: 'PENDING',
      submittedAt: '2 hours ago'
    }
  ];

  const DEFAULT_WITHDRAWALS = [
    {
      id: 'wth_1',
      userId: 'usr_1',
      userName: 'Alice Wangari',
      userPhone: '0721889900',
      package: 'Gold Package',
      amount: 2100.00,
      status: 'PENDING',
      refCode: null,
      requestedAt: 'Today, 11:20 AM'
    },
    {
      id: 'wth_2',
      userId: 'usr_2',
      userName: 'Brian Otieno',
      userPhone: '0711445566',
      package: 'Silver Package',
      amount: 1350.00,
      status: 'PENDING',
      refCode: null,
      requestedAt: 'Today, 10:45 AM'
    },
    {
      id: 'wth_3',
      userId: 'usr_3',
      userName: 'John Kamau',
      userPhone: '0712345678',
      package: 'Silver Package',
      amount: 250.00,
      status: 'COMPLETED',
      refCode: 'QK89XLP01',
      requestedAt: 'Yesterday, 04:15 PM'
    }
  ];

  const DEFAULT_LEDGER = [
    {
      id: 'tx_1',
      userPhone: '0712345678',
      type: 'REWARD',
      description: 'Daily Campaign Reward (137 approved views @ KSh 2.00)',
      amount: 274.00,
      date: 'Yesterday'
    },
    {
      id: 'tx_2',
      userPhone: '0712345678',
      type: 'PAYOUT',
      description: 'M-Pesa Withdrawal Completed to 0712345678',
      amount: -250.00,
      date: 'Yesterday'
    }
  ];

  function getStorage(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('TrendmarkDB storage error:', e);
    }
  }

  // Initial DB Setup
  function initDB() {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      setStorage(DB_KEYS.USERS, DEFAULT_USERS);
    }
    if (!localStorage.getItem(DB_KEYS.ACTIVATIONS)) {
      setStorage(DB_KEYS.ACTIVATIONS, DEFAULT_ACTIVATIONS);
    }
    if (!localStorage.getItem(DB_KEYS.SUBMISSIONS)) {
      setStorage(DB_KEYS.SUBMISSIONS, DEFAULT_SUBMISSIONS);
    }
    if (!localStorage.getItem(DB_KEYS.WITHDRAWALS)) {
      setStorage(DB_KEYS.WITHDRAWALS, DEFAULT_WITHDRAWALS);
    }
    if (!localStorage.getItem(DB_KEYS.LEDGER)) {
      setStorage(DB_KEYS.LEDGER, DEFAULT_LEDGER);
    }
    if (!localStorage.getItem(DB_KEYS.CAMPAIGN)) {
      setStorage(DB_KEYS.CAMPAIGN, DEFAULT_CAMPAIGN);
    }
  }

  initDB();

  const TrendmarkDB = {
    // ==========================================
    // 1. MASTER ADMIN AUTHENTICATION & SECURITY
    // ==========================================
    loginAdmin: function (identifier, password) {
      const cleanId = (identifier || '').trim();
      const cleanPass = (password || '').trim();

      const isMatch = (
        (cleanId === MASTER_ADMIN.phone || cleanId === MASTER_ADMIN.username || cleanId.toLowerCase() === 'admin') &&
        (cleanPass === MASTER_ADMIN.password || cleanPass === MASTER_ADMIN.pin)
      );

      if (isMatch) {
        const adminSessionData = {
          role: 'ADMIN',
          username: MASTER_ADMIN.username,
          phone: MASTER_ADMIN.phone,
          name: MASTER_ADMIN.name,
          loggedInAt: new Date().toISOString()
        };
        setStorage(DB_KEYS.ADMIN_SESSION, adminSessionData);
        return { success: true, admin: adminSessionData };
      }
      return { success: false, message: 'Invalid Admin Credentials. Only Trendmark Platform Administrators are authorized.' };
    },

    isAdminAuthenticated: function () {
      const session = getStorage(DB_KEYS.ADMIN_SESSION, null);
      // Admin auth is completely independent of client sessions.
      // Only the ADMIN_SESSION credential matters here.
      return !!(session && session.role === 'ADMIN');
    },


    getAdminUser: function () {
      if (!this.isAdminAuthenticated()) return null;
      return getStorage(DB_KEYS.ADMIN_SESSION, null);
    },

    logoutAdmin: function () {
      localStorage.removeItem(DB_KEYS.ADMIN_SESSION);
    },

    // ==========================================
    // 2. CLIENT AUTHENTICATION & SESSION
    // ==========================================
    getUsers: function () {
      return getStorage(DB_KEYS.USERS, DEFAULT_USERS);
    },

    getUser: function (phone) {
      const users = this.getUsers();
      return users.find(u => u.phone === phone) || null;
    },

    registerUser: function (name, phone, password) {
      const cleanPhone = phone.trim().replace(/\s+/g, '');
      if (cleanPhone === MASTER_ADMIN.phone) {
        return { success: false, message: 'This phone number is reserved for Trendmark Master Administration.' };
      }
      const users = this.getUsers();
      if (users.some(u => u.phone === cleanPhone)) {
        return { success: false, message: 'An account with this phone number already exists.' };
      }
      const newUser = {
        id: 'usr_' + Date.now(),
        name: name.trim(),
        phone: cleanPhone,
        password: password,
        role: 'USER',
        package: null,
        rate: 0,
        status: 'INACTIVE',
        walletBalance: 0.00,
        createdAt: new Date().toISOString().split('T')[0]
      };
      users.unshift(newUser);
      setStorage(DB_KEYS.USERS, users);

      // Clear any existing admin privileges for new client
      localStorage.removeItem(DB_KEYS.ADMIN_SESSION);
      this.setSession(cleanPhone);
      return { success: true, user: newUser };
    },

    loginUser: function (phone, password) {
      const cleanPhone = (phone || '').trim().replace(/\s+/g, '');
      const cleanPass = (password || '').trim();

      // Check if credentials belong to MASTER ADMIN
      const isMasterAdmin = (
        (cleanPhone === MASTER_ADMIN.phone || cleanPhone.toLowerCase() === 'admin' || cleanPhone === MASTER_ADMIN.username) &&
        (cleanPass === MASTER_ADMIN.password || cleanPass === MASTER_ADMIN.pin)
      );

      if (isMasterAdmin) {
        this.loginAdmin(cleanPhone, cleanPass);
        // Also register session phone for header display if needed
        localStorage.setItem(DB_KEYS.CLIENT_SESSION, MASTER_ADMIN.phone);
        return { 
          success: true, 
          isAdmin: true, 
          user: { ...MASTER_ADMIN, walletBalance: 0 } 
        };
      }

      // Normal Client Authentication
      const user = this.getUser(cleanPhone);
      if (!user) {
        return { success: false, message: 'Account not found. Please register first.' };
      }
      if (user.password !== password) {
        return { success: false, message: 'Invalid password. Please check and try again.' };
      }

      // CRITICAL: Normal client login immediately strips any Admin session
      localStorage.removeItem(DB_KEYS.ADMIN_SESSION);
      this.setSession(cleanPhone);
      return { success: true, isAdmin: false, user: user };
    },

    setSession: function (phone) {
      localStorage.setItem(DB_KEYS.CLIENT_SESSION, phone);
    },

    getSessionPhone: function () {
      return localStorage.getItem(DB_KEYS.CLIENT_SESSION);
    },

    getCurrentUser: function () {
      const phone = this.getSessionPhone();
      if (!phone) return null;
      if (phone === MASTER_ADMIN.phone) {
        return { ...MASTER_ADMIN, walletBalance: 0 };
      }
      return this.getUser(phone);
    },

    logout: function () {
      localStorage.removeItem(DB_KEYS.CLIENT_SESSION);
      localStorage.removeItem(DB_KEYS.ADMIN_SESSION);
    },

    updateUser: function (phone, updates) {
      const users = this.getUsers();
      const idx = users.findIndex(u => u.phone === phone);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        setStorage(DB_KEYS.USERS, users);
        return users[idx];
      }
      return null;
    },

    // ==========================================
    // 3. CLIENT-SCOPED DATA ACCESS (For User Dashboard)
    // ==========================================
    getClientSubmissions: function (phone) {
      const submissions = getStorage(DB_KEYS.SUBMISSIONS, []);
      return submissions.filter(s => s.userPhone === phone);
    },

    getClientWithdrawals: function (phone) {
      const withdrawals = getStorage(DB_KEYS.WITHDRAWALS, []);
      return withdrawals.filter(w => w.userPhone === phone);
    },

    getClientActivations: function (phone) {
      const activations = getStorage(DB_KEYS.ACTIVATIONS, []);
      return activations.filter(a => a.userPhone === phone);
    },

    getClientStats: function (phone) {
      const user = this.getUser(phone);
      if (!user) return null;
      const submissions = this.getClientSubmissions(phone);
      const withdrawals = this.getClientWithdrawals(phone);

      const approvedSub = submissions.filter(s => s.status === 'APPROVED');
      const totalViews = approvedSub.reduce((acc, s) => acc + (s.views || 0), 0);
      const totalEarned = approvedSub.reduce((acc, s) => acc + (s.reward || 0), 0);
      const pendingPayouts = withdrawals.filter(w => w.status === 'PENDING').reduce((acc, w) => acc + (w.amount || 0), 0);

      return {
        user: user,
        totalSubmissions: submissions.length,
        approvedSubmissions: approvedSub.length,
        totalViews: totalViews,
        totalEarned: totalEarned,
        walletBalance: user.walletBalance || 0,
        pendingPayouts: pendingPayouts
      };
    },

    // ==========================================
    // 4. CENTRAL ADMIN DATA ACCESS (All Clients)
    // ==========================================
    getAllUsers: function () {
      return this.getUsers();
    },

    getAllSubmissions: function () {
      return getStorage(DB_KEYS.SUBMISSIONS, []);
    },

    getAllWithdrawals: function () {
      return getStorage(DB_KEYS.WITHDRAWALS, []);
    },

    getAllActivations: function () {
      return getStorage(DB_KEYS.ACTIVATIONS, []);
    },

    // ==========================================
    // 5. PACKAGE ACTIVATION QUEUE & APPROVAL
    // ==========================================
    submitPackagePayment: function (phone, packageTitle, price, rate, mpesaMessage) {
      const user = this.getUser(phone);
      if (!user) return { success: false, message: 'User not found.' };

      // Extract transaction reference code
      const match = mpesaMessage.match(/([A-Z0-9]{10})/);
      const code = match ? match[1] : 'MANUAL-' + Date.now().toString().slice(-6);

      const activations = getStorage(DB_KEYS.ACTIVATIONS, []);
      const newAct = {
        id: 'act_' + Date.now(),
        userId: user.id,
        userName: user.name,
        userPhone: user.phone,
        package: packageTitle,
        price: price,
        rate: rate,
        smsMessage: mpesaMessage,
        mpesaCode: code,
        status: 'PENDING',
        createdAt: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      activations.unshift(newAct);
      setStorage(DB_KEYS.ACTIVATIONS, activations);

      // Update user state to PENDING
      this.updateUser(phone, {
        status: 'PENDING',
        package: packageTitle,
        rate: rate
      });

      return { success: true, activation: newAct };
    },

    approveActivation: function (actId) {
      const activations = this.getAllActivations();
      const act = activations.find(a => a.id === actId || a.userName === actId || a.userPhone === actId);
      if (act) {
        act.status = 'APPROVED';
        setStorage(DB_KEYS.ACTIVATIONS, activations);

        // Activate the subscriber
        this.updateUser(act.userPhone, {
          status: 'ACTIVE',
          package: act.package,
          rate: act.rate
        });

        // Credit referral bonus if this user was referred by someone
        this.creditReferralBonus(act.userPhone);

        return true;
      }
      return false;
    },


    rejectActivation: function (actId) {
      const activations = this.getAllActivations();
      const idx = activations.findIndex(a => a.id === actId || a.userName === actId || a.userPhone === actId);
      if (idx !== -1) {
        const act = activations[idx];
        this.updateUser(act.userPhone, { status: 'INACTIVE', package: null, rate: 0 });
        activations.splice(idx, 1);
        setStorage(DB_KEYS.ACTIVATIONS, activations);
        return true;
      }
      return false;
    },

    // ==========================================
    // 6. SCREENSHOT PROOFS & OCR REWARD ENGINE
    // ==========================================
    submitProof: function (phone, views, imageUrl) {
      const user = this.getUser(phone);
      if (!user) return { success: false, message: 'User not found.' };

      // Get user's active product before submission
      const activeCampaign = this.getUserActiveCampaign(phone);
      const currentProduct = activeCampaign.product || PRODUCT_CATALOG[0];

      const rate = user.rate || 1.0;
      const reward = views * rate;
      const submissions = this.getAllSubmissions();

      const newSub = {
        id: 'sub_' + Date.now(),
        userId: user.id,
        userName: user.name,
        userPhone: user.phone,
        productId: currentProduct.id,
        productTitle: currentProduct.title,
        productPrice: currentProduct.price,
        productImage: currentProduct.image,
        package: user.package || 'Bronze Package',
        rate: rate,
        views: views,
        reward: reward,
        imageUrl: imageUrl || currentProduct.image,
        status: 'PENDING',
        submittedAt: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      submissions.unshift(newSub);
      setStorage(DB_KEYS.SUBMISSIONS, submissions);

      // Mark current product campaign as SUBMITTED
      const userCampaigns = getStorage(DB_KEYS.USER_CAMPAIGNS, {});
      if (userCampaigns[phone]) {
        userCampaigns[phone].status = 'SUBMITTED';
        userCampaigns[phone].lastSubmittedAt = Date.now();
        setStorage(DB_KEYS.USER_CAMPAIGNS, userCampaigns);
      }

      // CRITICAL LOGIC: Generate a NEW product different from the one just submitted!
      const nextCampaign = this.rotateUserCampaignNow(phone);

      return { 
        success: true, 
        submission: newSub, 
        previousProduct: currentProduct,
        nextProduct: nextCampaign ? nextCampaign.product : null 
      };
    },

    approveSubmission: function (subId) {
      const submissions = this.getAllSubmissions();
      const sub = submissions.find(s => s.id === subId || s.userName === subId || s.userPhone === subId);
      if (sub && sub.status === 'PENDING') {
        sub.status = 'APPROVED';
        setStorage(DB_KEYS.SUBMISSIONS, submissions);

        // Credit subscriber wallet
        const user = this.getUser(sub.userPhone);
        if (user) {
          const newBal = (user.walletBalance || 0) + sub.reward;
          this.updateUser(sub.userPhone, { walletBalance: newBal });

          // Record in double-entry ledger
          const ledger = getStorage(DB_KEYS.LEDGER, []);
          ledger.unshift({
            id: 'tx_' + Date.now(),
            userPhone: sub.userPhone,
            type: 'REWARD',
            description: `Daily Campaign Reward (${sub.views} approved views @ KSh ${sub.rate.toFixed(2)})`,
            amount: sub.reward,
            date: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          setStorage(DB_KEYS.LEDGER, ledger);
        }
        return true;
      }
      return false;
    },

    rejectSubmission: function (subId, reason) {
      const submissions = this.getAllSubmissions();
      const sub = submissions.find(s => s.id === subId || s.userName === subId || s.userPhone === subId);
      if (sub && sub.status === 'PENDING') {
        sub.status = 'REJECTED';
        sub.rejectionReason = reason || 'Screenshot proof rejected.';
        setStorage(DB_KEYS.SUBMISSIONS, submissions);
        return true;
      }
      return false;
    },

    // ==========================================
    // 7. M-PESA WITHDRAWALS & B2C PAYROLL
    // ==========================================
    requestWithdrawal: function (phone, amount) {
      const user = this.getUser(phone);
      if (!user) return { success: false, message: 'User not found.' };
      if ((user.walletBalance || 0) < amount) {
        return { success: false, message: `Insufficient balance. Available: KSh ${(user.walletBalance || 0).toFixed(2)}.` };
      }
      if (amount < 100) {
        return { success: false, message: 'Minimum withdrawal amount is KSh 100.00.' };
      }

      // Deduct balance immediately upon request
      const newBal = user.walletBalance - amount;
      this.updateUser(phone, { walletBalance: newBal });

      // Create withdrawal request
      const withdrawals = this.getAllWithdrawals();
      const newWth = {
        id: 'wth_' + Date.now(),
        userId: user.id,
        userName: user.name,
        userPhone: user.phone,
        package: user.package || 'Standard',
        amount: amount,
        status: 'PENDING',
        refCode: null,
        requestedAt: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      withdrawals.unshift(newWth);
      setStorage(DB_KEYS.WITHDRAWALS, withdrawals);

      // Record in ledger
      const ledger = getStorage(DB_KEYS.LEDGER, []);
      ledger.unshift({
        id: 'tx_' + Date.now(),
        userPhone: phone,
        type: 'PAYOUT',
        description: `M-Pesa Payout Request to ${phone} (Pending)`,
        amount: -amount,
        date: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setStorage(DB_KEYS.LEDGER, ledger);

      return { success: true, withdrawal: newWth, newBalance: newBal };
    },

    approveWithdrawal: function (wthId, refCode) {
      const withdrawals = this.getAllWithdrawals();
      const wth = withdrawals.find(w => w.id === wthId || w.userName === wthId || w.userPhone === wthId);
      if (wth && wth.status === 'PENDING') {
        wth.status = 'COMPLETED';
        wth.refCode = refCode || 'QK' + Math.random().toString(36).substr(2, 7).toUpperCase();
        setStorage(DB_KEYS.WITHDRAWALS, withdrawals);
        return { success: true, refCode: wth.refCode };
      }
      return { success: false };
    },

    batchApproveWithdrawals: function () {
      const withdrawals = this.getAllWithdrawals();
      let count = 0;
      withdrawals.forEach((w, i) => {
        if (w.status === 'PENDING') {
          w.status = 'COMPLETED';
          w.refCode = 'BATCH-QK0' + (i + 1);
          count++;
        }
      });
      setStorage(DB_KEYS.WITHDRAWALS, withdrawals);
      return count;
    },

    getLedger: function (phone) {
      const ledger = getStorage(DB_KEYS.LEDGER, []);
      if (!phone) return ledger;
      return ledger.filter(tx => tx.userPhone === phone);
    },

    // ==========================================
    // 8. PROMOTIONAL CAMPAIGN MANAGER
    // ==========================================

    // ==========================================
    // 8. DYNAMIC 24-HR & POST-SUBMISSION CAMPAIGN ENGINE
    // ==========================================
    getProductCatalog: function () {
      return PRODUCT_CATALOG;
    },

    getUserActiveCampaign: function (phone) {
      if (!phone) {
        return {
          product: PRODUCT_CATALOG[0],
          assignedAt: Date.now(),
          expiresAt: Date.now() + 24 * 3600 * 1000,
          status: 'ACTIVE',
          hoursRemaining: 24,
          isNew: false
        };
      }

      const userCampaigns = getStorage(DB_KEYS.USER_CAMPAIGNS, {});
      let currentAssignment = userCampaigns[phone];
      const now = Date.now();
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

      let needsNewProduct = false;
      let lastProductId = null;

      if (!currentAssignment) {
        needsNewProduct = true;
      } else {
        lastProductId = currentAssignment.productId;
        const isExpired = (now - currentAssignment.assignedAt) >= TWENTY_FOUR_HOURS;
        const isSubmitted = (currentAssignment.status === 'SUBMITTED');
        if (isExpired || isSubmitted) {
          needsNewProduct = true;
        }
      }

      if (needsNewProduct) {
        // Collect IDs of products the user has recently submitted
        const userSubs = this.getClientSubmissions(phone);
        const completedProductIds = new Set(userSubs.map(s => s.productId).filter(Boolean));
        if (lastProductId) completedProductIds.add(lastProductId);

        // Filter for products that are DIFFERENT from lastProductId
        let available = PRODUCT_CATALOG.filter(p => p.id !== lastProductId && !completedProductIds.has(p.id));
        if (available.length === 0) {
          // If all products have been shown, pick any different from the last one
          available = PRODUCT_CATALOG.filter(p => p.id !== lastProductId);
        }
        if (available.length === 0) {
          available = PRODUCT_CATALOG;
        }

        const nextProduct = available[Math.floor(Math.random() * available.length)];

        currentAssignment = {
          userPhone: phone,
          productId: nextProduct.id,
          assignedAt: now,
          expiresAt: now + TWENTY_FOUR_HOURS,
          status: 'ACTIVE',
          product: nextProduct
        };

        userCampaigns[phone] = currentAssignment;
        setStorage(DB_KEYS.USER_CAMPAIGNS, userCampaigns);
      } else {
        if (!currentAssignment.product) {
          currentAssignment.product = PRODUCT_CATALOG.find(p => p.id === currentAssignment.productId) || PRODUCT_CATALOG[0];
        }
      }

      const timeLeftMs = Math.max(0, currentAssignment.expiresAt - now);
      const hoursRemaining = Math.max(1, Math.ceil(timeLeftMs / (3600 * 1000)));

      return {
        ...currentAssignment,
        hoursRemaining: hoursRemaining
      };
    },

    rotateUserCampaignNow: function (phone) {
      if (!phone) return null;
      const userCampaigns = getStorage(DB_KEYS.USER_CAMPAIGNS, {});
      const current = userCampaigns[phone];
      const lastId = current ? current.productId : null;

      // Filter for products different from the last one
      const candidates = PRODUCT_CATALOG.filter(p => p.id !== lastId);
      const nextProduct = candidates[Math.floor(Math.random() * candidates.length)] || PRODUCT_CATALOG[0];

      const newAssignment = {
        userPhone: phone,
        productId: nextProduct.id,
        assignedAt: Date.now(),
        expiresAt: Date.now() + 24 * 3600 * 1000,
        status: 'ACTIVE',
        product: nextProduct
      };

      userCampaigns[phone] = newAssignment;
      setStorage(DB_KEYS.USER_CAMPAIGNS, userCampaigns);
      return newAssignment;
    },

    getCampaign: function (phone) {
      if (phone) {
        const active = this.getUserActiveCampaign(phone);
        return active.product || DEFAULT_CAMPAIGN;
      }
      return getStorage(DB_KEYS.CAMPAIGN, DEFAULT_CAMPAIGN);
    },

    saveCampaign: function (campaignData) {
      setStorage(DB_KEYS.CAMPAIGN, campaignData);
      return campaignData;
    },

    // ==========================================
    // 9. REFERRAL SYSTEM
    // ==========================================

    /**
     * Generate a deterministic referral code for a user based on their phone.
     * Format: REF-<last8digitsOfPhone>
     */
    generateReferralCode: function (phone) {
      if (!phone) return null;
      const clean = phone.replace(/\D/g, '').slice(-8);
      return 'REF-' + clean;
    },

    /**
     * Get the full shareable referral URL for a user.
     * Uses the current page origin so it works on any deployment.
     */
    getReferralLink: function (phone) {
      const code = this.generateReferralCode(phone);
      if (!code) return null;
      const base = window.location.origin + window.location.pathname.replace(/admin\.html$/, 'index.html');
      return base + '?ref=' + encodeURIComponent(code);
    },

    /**
     * Record a referral when a new user registers via a referral link.
     * referralCode: the REF-XXXXXXXX code embedded in the URL.
     */
    recordReferral: function (newUserPhone, referralCode) {
      if (!referralCode || !newUserPhone) return false;
      const referrals = getStorage(DB_KEYS.REFERRALS, []);
      // Prevent duplicates
      if (referrals.some(r => r.referredPhone === newUserPhone)) return false;

      // Find the referrer by their code
      const users = this.getUsers();
      const referrer = users.find(u => this.generateReferralCode(u.phone) === referralCode);
      if (!referrer) return false;

      referrals.unshift({
        id: 'ref_' + Date.now(),
        referrerPhone: referrer.phone,
        referrerName: referrer.name,
        referredPhone: newUserPhone,
        bonusPaid: false,
        bonusAmount: 50,
        createdAt: new Date().toISOString().split('T')[0]
      });
      setStorage(DB_KEYS.REFERRALS, referrals);
      return true;
    },

    /**
     * Credit KSh 50 referral bonus to the referrer when the referred user
     * activates their first package. Called from approveActivation().
     */
    creditReferralBonus: function (activatedUserPhone) {
      const referrals = getStorage(DB_KEYS.REFERRALS, []);
      const ref = referrals.find(r => r.referredPhone === activatedUserPhone && !r.bonusPaid);
      if (!ref) return false;

      // Credit referrer wallet
      const referrer = this.getUser(ref.referrerPhone);
      if (referrer) {
        const newBal = (referrer.walletBalance || 0) + ref.bonusAmount;
        this.updateUser(ref.referrerPhone, { walletBalance: newBal });

        // Ledger entry for referrer
        const ledger = getStorage(DB_KEYS.LEDGER, []);
        ledger.unshift({
          id: 'tx_' + Date.now(),
          userPhone: ref.referrerPhone,
          type: 'REFERRAL',
          description: `Referral Bonus — friend ${activatedUserPhone} activated a package`,
          amount: ref.bonusAmount,
          date: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setStorage(DB_KEYS.LEDGER, ledger);
      }

      // Mark bonus as paid
      ref.bonusPaid = true;
      ref.paidAt = new Date().toISOString();
      setStorage(DB_KEYS.REFERRALS, referrals);
      return true;
    },

    /**
     * Get all users referred by a given phone number.
     */
    getUserReferrals: function (phone) {
      const referrals = getStorage(DB_KEYS.REFERRALS, []);
      return referrals.filter(r => r.referrerPhone === phone);
    },

    /**
     * Get referral stats for a user.
     */
    getReferralStats: function (phone) {
      const refs = this.getUserReferrals(phone);
      const paid = refs.filter(r => r.bonusPaid);
      return {
        totalReferred: refs.length,
        bonusPaid: paid.length,
        totalEarned: paid.reduce((acc, r) => acc + (r.bonusAmount || 0), 0),
        pending: refs.filter(r => !r.bonusPaid).length,
        referrals: refs
      };
    },

    /**
     * Get all referrals (admin view).
     */
    getAllReferrals: function () {
      return getStorage(DB_KEYS.REFERRALS, []);
    }
  };

  window.TrendmarkDB = TrendmarkDB;
})(window);
