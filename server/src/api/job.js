const { Router } = require('express');
const JobTable = require('../tables/job');
const CompanyTable = require('../tables/company');

const router = Router();

//create new job
//should take into consideration creating a new company (vs an existing company)
//for now just create a new company
router.post('/jobs', (req, res, next) => {
  const {name, status, description, link, company, questions, source} = req.body;
  JobTable.createJob({name, status, description, link, company, questions, source})
    .then(({message}) => {
      res.status(201).json({message})
    })
    .catch(error => next(error))
  // AuthTable.getAccount({ emailHash })
  //   .then(({ account }) => {
  //   })
  //   .then(({ message, cookie }) => {
  //     res.status(201).json({ message, cookie }) //reusing the message returned from setSession
  //   })
  //   .catch(error => next(error));
});

//update a job given jobId
router.put('/jobs', (req, res, next) => {
    // AuthTable.storeUserTimezone( { timezone, emailHash })
    //   .then(resp => {
    //     if (resp) {
    //       res.status(201).json(resp)
    //     } else {
    //       error = new Error('Invalid session');
    //       error.statusCode = 400;
    //       return next(error);
    //     }
    //   })
    //   .catch(err => next(err));
})

//retrieve all jobs (later search/filter)
router.get('/jobs', (req, res, next) => {
  // AuthTable.storePushSubscription({ emailHash, pushSubscription })
  //   .then(({ message }) => {
  //     if (message) {
  //       res.json({ message });
  //     }
  //   })
  //   .catch(err => next(err));
})

//update job given jobId to set to status archived (maybe reuse the generic put route?)
router.put('/jobs/archive', (req, res, next) => {
  // AuthTable.deletePushSubscription({ emailHash })
  //   .then(({ message }) => {
  //     if (message) {
  //       res.json({ message });
  //     }
  //   })
  //   .catch(err => next(err));
})

module.exports = router;