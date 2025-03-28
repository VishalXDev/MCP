const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPartners,
  addPartner,
  deletePartner
} = require('../controllers/partnerController');

// Protect all routes with JWT authentication
router.use(protect);

router.route('/')
  .get(getPartners)    // GET /api/partners
  .post(addPartner);   // POST /api/partners

router.route('/:id')
  .delete(deletePartner); // DELETE /api/partners/:id

module.exports = router;