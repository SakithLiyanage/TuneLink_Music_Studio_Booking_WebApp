const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole,
  updateUserVerification,
  updateUserActiveStatus,
  getUserStats,
  impersonateUser,
  adminResetPassword,
  assignUserRole,
  getAdminStats
} = require('../controllers/users');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/stats')
  .get(getUserStats);

router.route('/admin/stats')
  .get(getAdminStats);

router.route('/role/:role')
  .get(getUsersByRole);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:id/verify')
  .put(updateUserVerification);

router.route('/:id/active')
  .put(updateUserActiveStatus);

router.route('/:id/impersonate')
  .post(impersonateUser);

router.route('/:id/resetpassword')
  .put(adminResetPassword);

router.route('/:id/role')
  .put(assignUserRole);

module.exports = router;
