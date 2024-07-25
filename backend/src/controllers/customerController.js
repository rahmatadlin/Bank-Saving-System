const { ObjectId } = require('mongodb');

exports.createCustomer = async (req, res) => {
  try {
    const { name } = req.body;
    const trimmedName = name.trim();
    
    // Check if name is provided
    if (!trimmedName) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }

    // Check if name contains symbols
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (symbolRegex.test(trimmedName)) {
      return res.status(400).json({ message: 'Name cannot contain symbols' });
    }

    // Check if name starts with a capital letter
    const capitalLetterRegex = /^[A-Z]/;
    if (!capitalLetterRegex.test(trimmedName)) {
      return res.status(400).json({ message: 'Name must start with a capital letter' });
    }

    // Insert new customer
    const result = await req.db.collection('customers').insertOne({ name: trimmedName });
    res.status(201).json({ _id: result.insertedId, name: trimmedName });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await req.db.collection('customers').find().toArray();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customer = await req.db.collection('customers').findOne({ _id: new ObjectId(req.params.id) });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customerId = new ObjectId(req.params.id);
    const updatedCustomer = req.body;

    // Ensure required fields are present and valid
    if (!updatedCustomer.name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const result = await req.db.collection('customers').updateOne(
      { _id: customerId },
      { $set: updatedCustomer }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const result = await req.db.collection('customers').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};