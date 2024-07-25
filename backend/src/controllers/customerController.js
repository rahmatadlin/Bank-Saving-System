const { ObjectId } = require('mongodb');

exports.createCustomer = async (req, res) => {
  try {
    const result = await req.db.collection('customers').insertOne(req.body);
    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    const result = await req.db.collection('customers').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
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