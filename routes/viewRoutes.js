const router = require('express').Router();
const viewController = require(`${__dirname}/../controllers/viewController`);

const userController = require(`${__dirname}/../controllers/userController`);
const authController = require(`${__dirname}/../controllers/authController`);

// router.post('/login', authController.login);
// router.post('/signup', authController.signup);

router.use(authController.isLoggedIn);

router.get('/product/:id', viewController.getProduct);
router.get('/category/:category/:id', viewController.getProduct);
router.get('/', viewController.getOverview);

module.exports = router;
