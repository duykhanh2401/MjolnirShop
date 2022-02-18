const router = require('express').Router();
const userController = require(`${__dirname}/../controllers/userController`);
const authController = require(`${__dirname}/../controllers/authController`);
const adminController = require(`${__dirname}/../controllers/adminController`);

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.get('/logoutAdmin', adminController.logoutAdmin);
router.post('/loginAdmin', authController.loginAdmin);

router.post(
	'/updateMyPassword',
	authController.protect,
	authController.updateMyPassword,
);
router.post('/updateMe', authController.protect, userController.updateMe);
router.get(
	'/me',
	authController.protect,
	userController.getMe,
	userController.getUser,
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.use(adminController.protect);
router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createUser);

router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
