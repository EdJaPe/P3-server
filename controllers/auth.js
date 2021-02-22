const bcrypt = require('bcrypt');
const express = require('express');
const { createUserToken } = require('../middleware/auth');
const db = require('../models');
const router = express.Router();


// URL prefix — /api

// Signup — POST /api/signup
router.post('/signup', (req, res) => {
  //res.json(req.body);
  
  bcrypt.hash(req.body.password, 10)
  .then(hash => db.User.create({
    name: req.body.name,
    email: req.body.email,
    password: hash
  }))
  .then(createdUser => res.json(createdUser))
  .catch(err => {
    console.log(`🔥 Error in the POST signup:`, err);
    res.json({ error: err})
  });
  
});

// Login — POST /api/login
router.post('/login', (req, res) => {
  //res.json({ message: 'LOGIN POST'});
  db.User.findOne({ email: req.body.email })
  .then(user => {
    res.json({
      token: createUserToken(req, user),
      user: user
    })
  }).catch(err =>{
    console.log('Error in POST login ', err);
    res.json({
      error: err.message
    });
  })
});


module.exports = router;