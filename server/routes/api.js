const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../../models/user');
const KarateClass = require('../../models/karateClass');
const SignIn = require('../../models/signIn');

/* GET api listing. */
router.post('/', (req, res) => {
  res.render('index');
});

router.post('/new-student', (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email
  });
  user.save(
    (err, result) => {
      if(err) {
        return res.status(500).json({
          title: 'Error',
          error: err
        })
      }
      res.status(201).json({
        title: 'Success',
        data: result
      });
    }
  )
});

router.post('/new-class', (req, res, next) => {

  const kclass = new KarateClass({
    name: req.body.name,
    description: req.body.description
  });

  kclass.save(
    (err, result) => {
      if(err) {
        return res.status(500).json({
          title: 'Error',
          error: err
        })
      }
      res.status(201).json({
        title: 'Success',
        data: result
      });
    }
  )
});

router.post('/new-signin', (req, res, next) => {

  const signin = new SignIn({
    name: req.body.name,
    userId: req.body.userId,
    classId: req.body.classId,
  });

  signin.save(
    (err, result) => {
      if(err) {
        return res.status(500).json({
          title: 'Error',
          error: err
        })
      }
      res.status(201).json({
        title: 'Success',
        data: result
      });
    }
  )
});

// Get all posts
router.get('/students-list', (req, res) => {
  User.find()
    .exec(function (err, students) {
      if (err) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
      }
      res.status(200).json({
          message: 'Success',
          data: students
      });
  });
});

router.get('/classes-list', (req, res) => {
  KarateClass.find()
    .exec(function (err, classes) {
      if (err) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
      }
      res.status(200).json({
          message: 'Success',
          data: classes
      });
  });
});

router.post('/getsignins', (req, res) => {
  let queryObj = {};

  console.log(req.body);

  if (req.body.userId) {
    queryObj.userId = req.body.userId;
  }

  if (req.body.classId) {
    queryObj.classId = req.body.classId;
  }

  if (req.body.dateLogged) {
    //Set mongo query logic HERE
    queryObj.dateLogged = req.body.dateLogged;
  }
  console.log('QOBJ IS', queryObj);
  SignIn.find(queryObj)
    .exec(function (err, signins) {
      if (err) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
      }
      res.status(200).json({
          message: 'Success',
          data: signins
      });
  });
});

module.exports = router;
