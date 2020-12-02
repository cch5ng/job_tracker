const { Router } = require('express');
const JobTable = require('../tables/job');
const CompanyTable = require('../tables/company');
const AuthTable = require('../tables/auth');

const router = Router();

//create new job
//should take into consideration creating a new company (vs an existing company)
//for now just create a new company
router.post('/', (req, res, next) => {
  const {name, status, description, url, company_name, questions, source, user_guid} = req.body;

  // AuthTable.getUserGuid({email: user_email})
  //   .then(resp => {
  //     let {user_guid} = resp;
      if (user_guid) {
        JobTable.postJob({name, status, description, url, company_name, questions, source, user_guid})
        .then(({message}) => {
          res.status(201).json({message})
        })
        .catch(error => next(error))    
      } else {
        res.status(200).json({message: 'Could not save job because there is an issue with the current user email authorization'})
      }
    // })
    // .catch(err => next(err))
});

//update a job given jobId
// router.put('/jobs', (req, res, next) => {
// })

//retrieve all jobs (later search/filter)
router.get('/:user_guid', (req, res, next) => {
  const {user_guid} = req.params;
  JobTable.getJobs({user_guid})
    .then(resp => res.status(200).json(resp))
    .catch(err => next(err));
})

//update job given jobId to set to status archived (maybe reuse the generic put route?)
router.put('/archive/:job_guid', (req, res, next) => {
  const {job_guid} = req.params;
  JobTable.archiveJob({job_guid})
    .then(resp => res.status(200).json(resp))
    .catch(err => next(err));
})



module.exports = router;