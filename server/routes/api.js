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
    userId: req.body.userId,
    classId: req.body.classId
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

router.get('/:studentId/signins', (req, res) => {
  const studentId = req.params.studentId;

  SignIn.find({ userId: studentId})
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

router.get('/:studentId/:classId/signins', (req, res) => {
  const studentId = req.params.studentId;
  const classId = req.params.classId;

  SignIn.find({ userId: studentId, classId: classId})
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
