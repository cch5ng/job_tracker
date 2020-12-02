const { Router } = require('express');
const JobTable = require('../tables/job');
const CompanyTable = require('../tables/company');
const AuthTable = require('../tables/auth');
const {checkJwt} = require('../utils');

const router = Router();

//create new job
//should take into consideration creating a new company (vs an existing company)
//for now just create a new company
router.post('/', checkJwt, (req, res, next) => {
  const {name, status, description, url, company_name, questions, source, user_guid} = req.body;
    if (user_guid) {
      JobTable.postJob({name, status, description, url, company_name, questions, source, user_guid})
      .then(resp => {
        if (resp.status_code === 401) {
          res.status(401).json({error: 'Please log in and try again.'})
        } else {
          res.status(201).json(resp)
        }
      })
      .catch(error => next(error))    
    } else {
      res.status(200).json({message: 'Could not save job because there is an issue with the current user email authorization'})
    }
});

router.put('/update/:job_guid', checkJwt, (req, res, next) => {
  const guid = req.params.job_guid;
  const {name, status, description, url, company_name, questions, source, user_guid} = req.body;
  if (user_guid) {
    JobTable.updateJob({name, status, description, url, company_name, questions, source, user_guid, guid})
    .then(resp => {
      if (resp.status_code === 401) {
        res.status(401).json({error: 'Please log in and try again.'})
      } else {
        res.status(201).json(resp)
      }
    })
    .catch(error => next(error))    
  } else {
    res.status(200).json({message: 'Could not save job because there is an issue with the current user email authorization'})
  } 
});

//retrieve all jobs (later search/filter)
router.get('/:user_guid', checkJwt, (req, res, next) => {
  const {user_guid} = req.params;
  JobTable.getJobs({user_guid})
    .then(resp => {
      if (resp.status_code === 401) {
        res.status(401).json({error: 'Please log in and try again.'})
      } else {
        res.status(200).json(resp)
      }
    })
    .catch(err => next(err));
})

//update job given jobId to set to status archived (maybe reuse the generic put route?)
router.put('/archive/:job_guid', checkJwt, (req, res, next) => {
  const {job_guid} = req.params;
  JobTable.archiveJob({job_guid})
    .then(resp => {
      if (resp.status_code === 401) {
        res.status(401).json({error: 'Please log in and try again.'})
      } else {
        res.status(200).json(resp)
      }
    })
    .catch(err => next(err));
})



module.exports = router;