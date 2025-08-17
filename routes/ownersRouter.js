const express = require('express');
const router = express.Router();
const mongoose = require('../models/owner-model');
const ownerModel = require('../models/owner-model');
const isLoggedIn = require('../middlewares/isLoggedIn');

if(process.env.node_env === 'development') {
    router.post("/create", async (req, res) => {
        let owner = await ownerModel.find();
        if( owner.length > 0 ){
            return res.status(504).send("you don't have permission to creae a new owner")
        }
        let {fullname, email, password} = req.body;

        let createdowner = await ownerModel.create({
            fullname,
            email,
            password
        });
        res.status(201).send(createdowner);
    });
}

router.get('/', (req, res) => {
    res.send("Owners it's working");   
});


router.get("/admin", (req, res) => {
    let success = req.flash('success');

    res.render("createproducts", {success});
});

module.exports = router;