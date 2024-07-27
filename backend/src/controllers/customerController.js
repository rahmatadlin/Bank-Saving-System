const { ObjectId } = require("mongodb");

exports.createCustomer = async (req, res) => {
  try {
    const { name } = req.body;
    const trimmedName = name.trim();

    // Validate name
    if (!trimmedName) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    const invalidCharsRegex = /[!@#$%^&*(),.?":{}|<>0-9]/;
    if (invalidCharsRegex.test(trimmedName)) {
      return res.status(400).json({ message: "Name cannot contain symbols or numbers" });
    }
    const capitalLetterRegex = /^[A-Z]/;
    if (!capitalLetterRegex.test(trimmedName)) {
      return res.status(400).json({ message: "Name must start with a capital letter" });
    }

    // Insert new customer
    const result = await req.db.collection("customers").insertOne({ name: trimmedName });
    res.status(201).json({ _id: result.insertedId, name: trimmedName });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await req.db.collection("customers").find().toArray();
    const accounts = await req.db.collection("accounts").find().toArray();
    const depositoTypes = await req.db.collection("depositoTypes").find().toArray();

    const result = customers.map((customer) => {
      const customerAccounts = accounts
        .filter(account => account.customerId && account.customerId.toString() === customer._id.toString())
        .map((account) => {
          const depositoType = depositoTypes.find(
            (depositoType) => depositoType._id.toString() === account.depositoTypeId.toString()
          );
          return {
            ...account,
            depositoType: depositoType ? {
              name: depositoType.name,
              yearlyReturn: depositoType.yearlyReturn,
            } : null,
          };
        });

      return {
        ...customer,
        accounts: customerAccounts,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customerId = new ObjectId(req.params.id);

    const customer = await req.db.collection("customers").findOne({ _id: customerId });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const accounts = await req.db.collection("accounts").find({ customerId: customerId }).toArray();
    const depositoTypes = await req.db.collection("depositoTypes").find().toArray();

    const customerAccounts = accounts.map((account) => {
      const depositoType = depositoTypes.find(
        (depositoType) => depositoType._id.toString() === account.depositoTypeId.toString()
      );
      return {
        ...account,
        depositoType: depositoType ? {
          name: depositoType.name,
          yearlyReturn: depositoType.yearlyReturn,
        } : null,
      };
    });

    const result = {
      ...customer,
      accounts: customerAccounts,
    };

    res.json(result);
  } catch (error) {
    res.status500().json({ message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customerId = new ObjectId(req.params.id);
    const { name } = req.body;
    const trimmedName = name?.trim();

    // Validate name
    if (!trimmedName) {
      return res.status(400).json({ message: "Name is required" });
    }
    const invalidCharsRegex = /[!@#$%^&*(),.?":{}|<>0-9]/;
    if (invalidCharsRegex.test(trimmedName)) {
      return res.status(400).json({ message: "Name cannot contain symbols or numbers" });
    }
    const capitalLetterRegex = /^[A-Z]/;
    if (!capitalLetterRegex.test(trimmedName)) {
      return res.status(400).json({ message: "Name must start with a capital letter" });
    }

    // Check if new name is different from the current name
    const currentCustomer = await req.db.collection("customers").findOne({ _id: customerId });
    if (!currentCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    if (currentCustomer.name.trim() === trimmedName) {
      return res.status(400).json({ message: "New name cannot be the same as the current name" });
    }

    // Update customer
    const result = await req.db.collection("customers").updateOne(
      { _id: customerId },
      { $set: { name: trimmedName } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const result = await req.db.collection("customers").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
