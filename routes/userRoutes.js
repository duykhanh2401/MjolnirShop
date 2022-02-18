const router = require('express').Router();
const userController = require(`${__dirname}/../controllers/userController`);
const authController = require(`${__dirname}/../controllers/authController`);
const adminController = require(`${__dirname}/../controllers/adminController`);

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.post('/loginAdmin', authController.loginAdmin);

router.use(authController.protect);

router.post('/updateMyPassword', authController.updateMyPassword);
router.post('/updateMe', userController.updateMe);
router.get('/me', userController.getMe, userController.getUser);
router.delete('/deleteMe', userController.deleteMe);

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
