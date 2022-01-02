const router = require('express').Router();

const userController = require(`${__dirname}/../controllers/userController`);
const authController = require(`${__dirname}/../controllers/authController`);

router.post('/login', authController.login);
router.post('/signup', authController.signup);

module.exports = router;
