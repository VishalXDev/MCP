const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPartners,
  addPartner,
  deletePartner
} = require('../controllers/partnerController');

router.route('/')
  .get(protect, getPartners)
  .post(protect, addPartner);

router.route('/:id')
  .delete(protect, deletePartner);

module.exports = router;