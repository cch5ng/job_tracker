require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const db = require('../databasePool');

class EventTable {

  //TODO handle date which is user generated
  static postEvent({name, format, contact, notes, description, follow_up, job_guid, date_time}) {
    let guid = uuidv4();
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO event (name, format, contact, notes, description, follow_up, guid, job_guid, date_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [name, format, contact, notes, description, follow_up, guid, job_guid, date_time],
        (error, response) => {
          if (error) return reject(error);
          if (response.rows.length) {
            console.log('gets here')
            const eventId = response.rows[0].id;
            if (eventId) {
              resolve({ message: `The event: ${guid} was created successfully`});
            }
          } else {
            resolve({ message: 'The event could not be saved'})
          }
        }
      )
    })
  }

  static updateEvent({name, format, contact, notes, description, follow_up, job_guid, date_time, guid}) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE event SET name=$1, format=$2, contact=$3, notes=$4, description=$5, follow_up=$6, job_guid=$7, date_time=$8, guid=$9 RETURNING id`,
        [name, format, contact, notes, description, follow_up, job_guid, date_time, guid],
        (error, response) => {
          if (error) return reject(error);
          if (response.rows.length) {
            const jobId = response.rows[0].id;
            if (jobId) {
              resolve({ message: `The event: ${guid} was updated successfully`});
            }
          } else {
            resolve({ message: 'The event could not be saved'})
          }
        }
      )
    })
  }

  // static getJobs({ user_guid }) {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `SELECT name, status, description, url, company_name, questions, source, guid, created_at FROM job WHERE user_guid=$1`,
  //       [user_guid],
  //       (error, response) => {
  //         if (error) return reject(error);
  //         if (response.rows.length) {
  //           resolve({jobs: response.rows, message: `${response.rows.length} jobs were retrieved`})
  //         } else {
  //           resolve({jobs: [], message: 'No jobs were found'})
  //         }
  //       })
  //   })
  // }

  // static getJobByGuid({ job_guid }) {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `SELECT name, status, description, url, company_name, questions, source, guid FROM job WHERE guid=$1`,
  //       [job_guid],
  //       (error, response) => {
  //         if (error) return reject(error);
  //         if (response.rows.length) {
  //           resolve({job: response.rows[0], message: 'The job was retrieved'})
  //         } else {
  //           resolve({jobs: [], message: 'No jobs were found'})
  //         }
  //       })
  //   })
  // }

  // static archiveJob({ job_guid }) {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `UPDATE job SET status='archived' WHERE guid=$1 RETURNING id`,
  //       [job_guid],
  //       (error, response) => {
  //         if (error) return reject(error);
  //           if (response.rows.length && response.rows[0].id) {
  //             resolve({ 
  //               message: `Job: ${job_guid} was archived`,
  //               status: 'success'
  //             });
  //           } else {
  //             resolve({message: 'The job could not be archived. Please wait a few moments and try again.'})
  //           }
  //       }
  //     )
  //   })
  // }

}

module.exports = EventTable;
