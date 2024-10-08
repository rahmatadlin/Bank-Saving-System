const { ObjectId } = require('mongodb');

exports.createAccount = async (req, res) => {
  try {
    const { customerId, depositoTypeId, balance } = req.body;
    if (!customerId || !depositoTypeId || typeof balance !== 'number') {
      return res.status(400).json({ message: "Invalid account data" });
    }
    const newAccount = {
      customerId: new ObjectId(customerId),
      depositoTypeId: new ObjectId(depositoTypeId),
      balance,
      lastTransactionDate: new Date(),
      createdAt: new Date()
    };
    const result = await req.db.collection('accounts').insertOne(newAccount);
    res.status(201).json({ _id: result.insertedId, ...newAccount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await req.db.collection('accounts').find().toArray();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAccount = async (req, res) => {
  try {
    const account = await req.db.collection('accounts').findOne({ _id: new ObjectId(req.params.id) });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const { customerId, depositoTypeId, balance } = req.body;
    const updatedAccount = {};
    if (customerId) updatedAccount.customerId = new ObjectId(customerId);
    if (depositoTypeId) updatedAccount.depositoTypeId = new ObjectId(depositoTypeId);
    if (typeof balance === 'number') updatedAccount.balance = balance;
    
    const result = await req.db.collection('accounts').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedAccount }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Account not found' });
    res.json({ message: 'Account updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const result = await req.db.collection('accounts').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Account not found' });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deposit = async (req, res) => {
  try {
    const { amount, date } = req.body;
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }
    const depositDate = new Date(date);
    if (isNaN(depositDate.getTime())) {
      return res.status(400).json({ message: "Invalid deposit date" });
    }
    const result = await req.db.collection('accounts').updateOne(
      { _id: new ObjectId(req.params.id) },
      { 
        $inc: { balance: amount },
        $set: { lastTransactionDate: depositDate }
      }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Account not found' });
    res.json({ message: 'Deposit successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.withdraw = async (req, res) => {
  try {
    const { amount, date } = req.body;
    console.log("Withdrawal request:", { amount, date });

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal amount" });
    }
    const withdrawalDate = new Date(date);
    if (isNaN(withdrawalDate.getTime())) {
      return res.status(400).json({ message: "Invalid withdrawal date" });
    }
    
    const account = await req.db.collection('accounts').findOne({ _id: new ObjectId(req.params.id) });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    console.log("Account found:", account);
    
    if (!account.lastTransactionDate) {
      console.log("No last transaction date found, using account creation date or current date");
      account.lastTransactionDate = account.createdAt || new Date();
    }

    const depositoType = await req.db.collection('depositoTypes').findOne({ _id: new ObjectId(account.depositoTypeId) });
    if (!depositoType) return res.status(404).json({ message: 'Deposito type not found' });
    console.log("Deposito type found:", depositoType);
    
    const monthsDiff = (withdrawalDate.getTime() - account.lastTransactionDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const monthlyInterestRate = depositoType.yearlyReturn / 12 / 100;
    const endingBalance = account.balance * Math.pow(1 + monthlyInterestRate, monthsDiff);
    console.log("Calculated ending balance:", endingBalance);
    
    if (endingBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    const newBalance = endingBalance - amount;
    
    const result = await req.db.collection('accounts').updateOne(
      { _id: new ObjectId(req.params.id) },
      { 
        $set: { 
          balance: newBalance,
          lastTransactionDate: withdrawalDate
        }
      }
    );
    
    res.json({ message: 'Withdrawal successful', endingBalance: newBalance });
  } catch (error) {
    console.error("Withdrawal error:", error);
    res.status(400).json({ message: error.message });
  }
};