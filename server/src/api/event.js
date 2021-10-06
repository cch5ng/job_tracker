const { Router, json } = require('express');
const EventTable = require('../tables/event');
const JobTable = require('../tables/job');

const {checkJwt} = require('../utils');

const router = Router();

//create new event (should be tied to an existing job guid)
router.post('/', (req, res, next) => {
  const {job_guid, format, contact, notes, description, 
    follow_up, date_time, fbIdToken} = req.body;
  const error_fields = [];
  const required_fields = ['format', 'contact', 'date_time'];

  required_fields.forEach(field => {
    if (!req.body[field] || req.body[field] === 'none') {
      error_fields.push(field);
    }
  });
  if (error_fields.length) {
    const error_message = `These fields are required: ${error_fields.join(', ')}`;
    res.status(400).json({message: error_message, type: 'error'})
  } else if (job_guid) {
    EventTable.postEvent({format, contact, notes, description, follow_up, job_guid, date_time})
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
router.put('/:event_guid', (req, res, next) => {
  const guid = req.params.event_guid;
  const {job_guid, format, contact, notes, description, 
    follow_up, date_time, fbIdToken} = req.body;
  const error_fields = [];
  const required_fields = ['format', 'contact', 'date_time'];

  required_fields.forEach(field => {
    if (!req.body[field] || req.body[field] === 'none') {
      error_fields.push(field);
    }
  });
  if (error_fields.length) {
    const error_message = `These fields are required: ${error_fields.join(', ')}`;
    res.status(400).json({message: error_message, type: 'error'})
  } else if (guid) {
    EventTable.updateEvent({job_guid, format, contact, notes, description, follow_up, date_time, guid})
    .then(resp => {
      if (resp.status_code === 401) {
        res.status(401).json({type: 'error', message: 'Please log in and try again.'})
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
router.get('/:event_guid', (req, res, next) => {
  const {event_guid} = req.params;
  const {fbIdToken} = req.body;
  EventTable.getEventByGuid({event_guid})
    .then(resp => {
      if (resp.status_code === 401) {
        res.status(401).json({error: 'Please log in and try again.'})
      } else {
        res.status(201).json(resp)
      }
    })
    .catch(error => next(error)) 
})

//get events for given user guid (later search/filter)
router.get('/user/:user_guid', (req, res, next) => {
  const {user_guid} = req.params;
  const {fbIdToken} = req.body;
  EventTable.getEventsByUserGuid({user_guid})
    .then(resp => {
      if (resp.status_code === 401) {
        res.status(401).json({error: 'Please log in and try again.'})
      } else {
        res.status(201).json(resp)
      }
    })
    .catch(error => next(error)) 
})

//get events for given job guid
router.get('/job/:job_guid', (req, res, next) => {
  const {job_guid} = req.params;
  const {fbIdToken} = req.body;
  EventTable.getEventsByJobGuid({job_guid})
    .then(resp => {
      if (resp.status_code === 401) {
        res.status(401).json({error: 'Please log in and try again.'})
      } else {
        res.status(200).json(resp)
      }
    })
    .catch(err => next(err));
})

router.delete('/:event_guid', (req, res, next) => {
  const {event_guid} = req.params;
  const {fbIdToken} = req.body;
  EventTable.deleteEvent({event_guid})
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