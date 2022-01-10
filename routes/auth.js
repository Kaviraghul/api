const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
    
    try{
        //password hashing
        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //new user
        const newUser = await new User({
            username : req.body.username,
            email    : req.body.email,
            password : hashedPassword
        });

        // save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
});


// LOGIN
router.post("/login", async (req,res) => {
    try{
        const user =  await User.findOne({email:req.body.email});
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!user || !validPassword){
            res.status(404).json("user not found");
        }
        

    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;