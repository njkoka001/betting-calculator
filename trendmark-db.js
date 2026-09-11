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
    CAMPAIGN: 'trendmark_campaign_v1'
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

  const DEFAULT_CAMPAIGN = {
    title: 'Trendmark Ultra Smart Watch v2',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
    copy: '🔥 FLASH SALE: Trendmark Ultra Smart Watch v2!\nOriginal Quality AMOLED Display, 7-Day Battery & Heart Rate Tracking.\nSpecial Offer: KSh 3,500 only! Free delivery in Nairobi.\nCall/WhatsApp 0734570672 to order yours today! Limited stock available.'
  };

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
      return session && session.role === 'ADMIN';
    },

    getAdminUser: function () {
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
      const users = this.getUsers();
      const cleanPhone = phone.trim().replace(/\s+/g, '');
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
      this.setSession(cleanPhone);
      return { success: true, user: newUser };
    },

    loginUser: function (phone, password) {
      const cleanPhone = phone.trim().replace(/\s+/g, '');
      const user = this.getUser(cleanPhone);
      if (!user) {
        return { success: false, message: 'Account not found. Please register first.' };
      }
      if (user.password !== password) {
        return { success: false, message: 'Invalid password. Please check and try again.' };
      }
      this.setSession(cleanPhone);
      return { success: true, user: user };
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
      return this.getUser(phone);
    },

    logout: function () {
      localStorage.removeItem(DB_KEYS.CLIENT_SESSION);
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

      const rate = user.rate || 1.0;
      const reward = views * rate;
      const submissions = this.getAllSubmissions();

      const newSub = {
        id: 'sub_' + Date.now(),
        userId: user.id,
        userName: user.name,
        userPhone: user.phone,
        package: user.package || 'Bronze Package',
        rate: rate,
        views: views,
        reward: reward,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
        status: 'PENDING',
        submittedAt: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      submissions.unshift(newSub);
      setStorage(DB_KEYS.SUBMISSIONS, submissions);
      return { success: true, submission: newSub };
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
    getCampaign: function () {
      return getStorage(DB_KEYS.CAMPAIGN, DEFAULT_CAMPAIGN);
    },

    saveCampaign: function (campaignData) {
      setStorage(DB_KEYS.CAMPAIGN, campaignData);
      return campaignData;
    }
  };

  window.TrendmarkDB = TrendmarkDB;
})(window);
