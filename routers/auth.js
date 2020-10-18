const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require("../validation");



router.post('/register', async (req, res)=> {
    //Validation
    const {error} = registerValidation(req.body); 
    if(error) return res.status(400).send(error.details[0].message);

    //Check user already exsit
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exsits');

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassward = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassward

    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
        
    } catch (error) {
        res.status(400),send(error);
    }
});

module.exports = router;