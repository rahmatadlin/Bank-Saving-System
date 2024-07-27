const { ObjectId } = require('mongodb');

exports.createDepositoType = async (req, res) => {
  try {
    const result = await req.db.collection('depositoTypes').insertOne(req.body);
    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getDepositoTypes = async (req, res) => {
  try {
    const depositoTypes = await req.db.collection('depositoTypes').find().toArray();
    res.json(depositoTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDepositoType = async (req, res) => {
  try {
    const depositoType = await req.db.collection('depositoTypes').findOne({ _id: new ObjectId(req.params.id) });
    if (!depositoType) return res.status(404).json({ message: 'Deposito type not found' });
    res.json(depositoType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDepositoType = async (req, res) => {
  try {
    const result = await req.db.collection('depositoTypes').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Deposito type not found' });
    res.json({ message: 'Deposito type updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteDepositoType = async (req, res) => {
  try {
    const result = await req.db.collection('depositoTypes').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Deposito type not found' });
    res.json({ message: 'Deposito type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
