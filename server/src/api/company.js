const { Router } = require('express');
const admin = require("firebase-admin");

const CompanyTable = require('../tables/company');
const AuthTable = require('../tables/auth');

if (!admin.apps.length) {
  var serviceAccount = require(process.env.FIREBASE_ADMIN_KEY_PATH);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const router = Router();

//retrieve all jobs (later search/filter)
router.post('/all/:user_guid', (req, res, next) => {
  const {user_guid} = req.params;
  const {fbIdToken} = req.body;

  admin
    .auth()
    .verifyIdToken(fbIdToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      
      CompanyTable.getCompanies({user_guid})
      .then(resp => {
        if (resp.status_code === 401) {
          res.status(401).json({error: 'Please log in and try again.'})
        } else {
          res.status(200).json(resp)
        }
      })
      .catch(err => next(err));
    })
    .catch((error) => {
      next(error);
    });
})

router.post('/', (req, res, next) => {
  const {name, user_guid, fbIdToken} = req.body;
  const error_fields = [];
  const required_fields = ['name'];

  required_fields.forEach(field => {
    if (!req.body[field] || req.body[field] === 'none') {
      error_fields.push(field);
    }
  });
  if (error_fields.length) {
    const error_message = `These fields are required: ${error_fields.join(', ')}`;
    res.status(400).json({message: error_message, type: 'error'})
  } else if (user_guid) {
    admin
      .auth()
      .verifyIdToken(fbIdToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        CompanyTable.postCompany({name, user_guid})
          .then(resp => {
            if (resp.status_code === 401) {
              res.status(401).json({error: 'Please log in and try again.'})
            } else {
              res.status(201).json(resp)
            }
          })
          .catch(error => next(error))

      })
      .catch((error) => {
        next(error);
        // Handle error
      });
     
  } else {
    res.status(200).json({message: 'Could not save job because there is an issue with the current user email authorization'})
  }
});

router.put('/update/:id', (req, res, next) => {
  const id = req.params.id;
  const {name, description, financial, purpose, user_guid, fbIdToken} = req.body;
  const error_fields = [];
  const required_fields = ['name'];

  required_fields.forEach(field => {
    if (!req.body[field] || req.body[field] === 'none') {
      error_fields.push(field);
    }
  });
  if (error_fields.length) {
    const error_message = `These fields are required: ${error_fields.join(', ')}`;
    res.status(400).json({message: error_message, type: 'error'})
  } else if (id) {

    admin
      .auth()
      .verifyIdToken(fbIdToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        CompanyTable.updateCompany({name, description, financial, purpose, id})
          .then(resp => {
            if (resp.status_code === 401) {
              res.status(401).json({error: 'Please log in and try again.'})
            } else {
              res.status(201).json(resp)
            }
          })
          .catch(error => next(error))
      })
      .catch((error) => {
        next(error);
        // Handle error
      });
 
  } else {
    res.status(200).json({message: 'Could not save company because there is an issue with the current user email authorization'})
  }
});

module.exports = router;