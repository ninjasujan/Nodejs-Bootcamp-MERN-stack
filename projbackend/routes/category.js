const express = require('express');
const router = express.Router();

const { getUserById } = require('../controllers/user');
const { isAdmin, isSignedIn, isAuthenticated } = require('../controllers/auth');
const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category');

// param routes
router.param('userId', getUserById);
router.param('categoryId', getCategoryById);

// create routes
router.post(
  '/category/create/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

// read routes
router.get('/category/:categoryId', getCategory);
router.get('/categories', getAllCategory);

// update route
router.put(
  '/category/:categoryId/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// delete route
router.delete(
  '/category/:categoryId/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteCategory
);

module.exports = router;
