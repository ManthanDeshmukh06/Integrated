const PaymentService = require("../services/PaymentService");

exports.createPaymentOrder = async (req, res) => {
  try {
    const result = await PaymentService.createPaymentOrder(req.params.billId);
    res.status(200).json(result);
  } catch (err) {
    console.error("Create Payment Order Error:", err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const result = await PaymentService.verifyPayment(
      req.body,
      req.params.txn_id
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.getPatientTransactions = async (req, res) => {
  try {
    const txns = await PaymentService.getTransactionsByPatient(
      req.params.patient_id
    );
    res.status(200).json(txns);
  } catch (err) {
    console.error("Get Transactions Error:", err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};