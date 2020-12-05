const { Router } = require('express');
const EventTable = require('../tables/event');
const {checkJwt} = require('../utils');

const router = Router();

//create new event (should be tied to an existing job guid)
router.post('/', checkJwt, (req, res, next) => {
  const {job_guid, name, format, contact, notes, description, follow_up, date_time} = req.body;
  console.log('gets here')
    if (job_guid) {
    EventTable.postEvent({name, format, contact, notes, description, follow_up, job_guid, date_time})
      .then(resp => {
        if (resp.status_code === 401) {
          res.status(401).json({error: 'Please log in and try again.'})
        } else {
          res.status(201).json(resp)
        }
      })
      .catch(error => next(error))    
    } else {
      res.status(200).json({message: 'Could not save event because there is an issue with the current user email authorization'})
    }
});

//update event given event guid
router.put('/:event_guid', checkJwt, (req, res, next) => {
  const guid = req.params.event_guid;
  const {job_guid, name, format, contact, notes, description, follow_up, date_time} = req.body;
  if (guid) {
    EventTable.updateEvent({job_guid, name, format, contact, notes, description, follow_up, date_time, guid})
    .then(resp => {
      if (resp.status_code === 401) {
        res.status(401).json({error: 'Please log in and try again.'})
      } else {
        res.status(201).json(resp)
      }
    })
    .catch(error => next(error))    
  } else {
    res.status(200).json({message: 'Could not save event because there is an issue with the current user email authorization'})
  } 
});

//get events for given user guid (later search/filter)
// router.get('/all/:user_guid', checkJwt, (req, res, next) => {
//   const {user_guid} = req.params;
//   JobTable.getJobs({user_guid})
//     .then(resp => {
//       if (resp.status_code === 401) {
//         res.status(401).json({error: 'Please log in and try again.'})
//       } else {
//         res.status(200).json(resp)
//       }
//     })
//     .catch(err => next(err));
// })

//get events for given job guid
// router.get('/job/:job_guid', checkJwt, (req, res, next) => {
//   const {job_guid} = req.params;
//   JobTable.getJobByGuid({job_guid})
//     .then(resp => {
//       if (resp.status_code === 401) {
//         res.status(401).json({error: 'Please log in and try again.'})
//       } else {
//         res.status(200).json(resp)
//       }
//     })
//     .catch(err => next(err));
// })

// TODO delete
// router.put('/archive/:job_guid', checkJwt, (req, res, next) => {
//   const {job_guid} = req.params;
//   JobTable.archiveJob({job_guid})
//     .then(resp => {
//       if (resp.status_code === 401) {
//         res.status(401).json({error: 'Please log in and try again.'})
//       } else {
//         res.status(200).json(resp)
//       }
//     })
//     .catch(err => next(err));
// })



module.exports = router;