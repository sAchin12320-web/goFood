const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const validator = require('validator');

router.post('/orderData', async (req, res) => {
  let data = req.body.order_data;
  let email = req.body.email;
  await data.splice(0, 0, { order_date: req.body.order_date });

  // Validate email
  if (!req.body.email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }

  // Check if email exists in the database
  let eId = await Order.findOne({ email });
  // console.log(eId);

  if (eId === null) {
    try {
      // Create a new order if email does not exist
      await Order.create({
        email: req.body.email,
        order_data: [data]
      }).then(() => {
        res.json({ success: true })
      })
    } catch (error) {
      // console.log(error.message);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  } else {
    try {
      // Update existing order with new data
      await Order.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: data } }
      ).then(() => {
        res.json({ success: true })
      })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
});

router.post('/myOrderData', async (req, res) => {
  try {
      console.log(req.body.email)
      let eId = await Order.findOne({ 'email': req.body.email })
      //console.log(eId)
      res.json({orderData:eId})
  } catch (error) {
      res.send("Error",error.message)
  }
  

});


module.exports = router; 
