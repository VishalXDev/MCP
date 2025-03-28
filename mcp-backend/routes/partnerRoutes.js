const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPartners,
  addPartner,
  deletePartner
} = require('../controllers/partnerController');

// All routes will require authentication
router.use(protect);

// GET /api/partners
router.get('/', getPartners);

// POST /api/partners
router.post('/', addPartner);

// DELETE /api/partners/:id
router.delete('/:id', deletePartner);

module.exports = router;