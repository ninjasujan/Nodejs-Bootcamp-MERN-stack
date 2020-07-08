const { ProductCart, Order } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({ error: "No order found.!" });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res, next) => {
  req.boby.order.user = req.profile;
  const order = new Order(req.boby.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({ error: "Failed save Order into DB" });
    }
    res.json(order);
  });
};

exports.getAllorders = (req, res, next) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({ error: "No order found." });
      }
      return res.status(200).json(orders);
    });
};

exports.getOrderStatus = (req, res, next) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateOrder = (req, res, next) => {
  Order.update(
    { _id: req.boby.orderId },
    { $set: { status: req.boby.status } }
  ).exec((err, order) => {
    if (err) {
      return res.status(400).json({ error: "Can't update order status" });
    }
    return res.json(order);
  });
};
