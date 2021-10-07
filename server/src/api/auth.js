const { Router } = require('express');
var admin = require("firebase-admin");

const AuthTable = require('../tables/auth');

if (!admin.apps.length) {
  var serviceAccount = require(process.env.FIREBASE_ADMIN_KEY_PATH);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const router = Router();

router.post('/guid', (req, res, next) => {
  const {email, fbIdToken} = req.body;

  admin
    .auth()
    .verifyIdToken(fbIdToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      AuthTable.getUserGuid({email})
      .then(resp => {
        res.status(200).json(resp)
      })
      .catch(error => next(error))
    })
    .catch((error) => {
      next(error);
      // Handle error
    });
})

router.post('/user', (req, res, next) => {
  const {email, fbIdToken} = req.body;

  admin
    .auth()
    .verifyIdToken(fbIdToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      // ...
      AuthTable.postUser({email})
        .then(resp => res.status(200).json(resp))
        .catch(error => next(error))  
    })
    .catch((error) => {
      // Handle error
    });
});

module.exports = router;