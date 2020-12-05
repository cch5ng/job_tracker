const { Router } = require('express');
const AuthTable = require('../tables/auth');

const router = Router();

router.post('/guid', (req, res, next) => {
  const {email} = req.body;
  AuthTable.getUserGuid({email})
    .then(resp => {
      res.status(200).json(resp)
    })
    .catch(error => next(error))
})

router.post('/user', (req, res, next) => {
  const {email} = req.body;
  AuthTable.postUser({email})
    .then(resp => res.status(200).json(resp))
    .catch(error => next(error))  
});

module.exports = router;