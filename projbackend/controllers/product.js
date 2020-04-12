const Product = require('../models/product');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate('category')
    .exec((err, product) => {
      if (err) {
        return res.status(404).json({
          error: 'product not found.!',
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(422).json({
        error: 'problem with image',
      });
    }
    // destrucuring the fields
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: 'please include all fields of product.!',
      });
    }
    let product = new Product(fields);
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: 'file size too big',
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    product.save((err, product) => {
      if (err) {
        return res.status(500).json({
          error: 'Product not created.!',
        });
      }
      res.status(201).json(product);
    });
  });
};

exports.getProduct = (req, res, next) => {
  req.product.photo = undefined;
  return res.send(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res, next) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        message: 'Product deletion unsuccessfull',
        deletedProduct: deletedProduct,
      });
    }
    res.status(200).json({
      message: 'product deletion successful',
      deleteProduct: deleteProduct,
    });
  });
};

exports.updateProduct = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(422).json({
        error: 'problem with image',
      });
    }

    // updation code
    let product = req.product;
    product = _.extend(product, fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: 'file size too big',
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((err, product) => {
      if (err) {
        return res.status(500).json({
          error: 'updation of product failed.!',
        });
      }
      res.status(201).json(product);
    });
  });
};

exports.getAllProducts = (req, res, next) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 3;
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: 'NO product found in DB',
        });
      }
      res.status(200).json(products);
    });
};

exports.getAllUniqueCategories = (req, res, next) => {
  Product.distinct('category', {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: 'No category found.!',
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperation = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperation, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        message: 'stock updation failed.!',
      });
    }
    next();
  });
};
