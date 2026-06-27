const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
});

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder')
      .update(sign)
      .digest('hex');

    if (expected !== razorpay_signature)
      return res.status(400).json({ message: 'Payment verify nahi hua' });

    await Payment.create({
      client: req.user._id,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount,
      status: 'completed'
    });

    res.json({ message: 'Payment successful!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};