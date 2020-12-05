const { Router } = require('express');
const AuthTable = require('../tables/auth');

const router = Router();

// router.post('/', (req, res, next) => {
//   const {email} = req.body;
//   AuthTable.getUserByEmail({email})
//     .then(resp => {
//       if (resp.error) {
//         AuthTable.postUser({email})
//         .then(resp => {
  
//           res.status(200).json(resp)
//         })
//         .catch(error => next(error))  
//       }
//     })
//     .catch(error => next(error))
// });

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
    .then(resp => resp.json())
    .then(json => res.status(200).json(resp))
    .catch(error => next(error))  
});

module.exports = router;