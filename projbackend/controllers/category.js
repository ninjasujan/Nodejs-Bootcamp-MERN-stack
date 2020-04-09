const Category = require('../models/category');

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, data) => {
    if (err) {
      return res.status(404).json({
        error: 'required collection not found.!',
      });
    }
    req.category = data;
    next();
  });
};

exports.createCategory = (req, res, next) => {
  const category = new Category(req.body);
  category.save().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'error in creatng category',
      });
    }
    res.status(200).json({ data });
  });
};

exports.getCategory = (req, res) => {
  res.json(req.category);
};

exports.getAllCategory = () => {
  Category.find().exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: 'no categories found.!',
      });
    }
    res.json(category);
  });
};

exports.updateCategory = (req, res, next) => {
  const category = req.category;
  category.name = req.body.name;
  category.save().exec((err, updatecategory) => {
    if (err) {
      return res.status(400).json({
        error: 'unable to update category.!',
      });
    }
    res.status(200).json(updatecategory);
  });
};
