const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
const db = require('../databasePool');

class JobTable {
  static postJob({name, status, description, url, company_name, questions, source, user_guid}) {
    let guid = uuidv4();
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO job (name, status, description, url, company_name, questions, source, guid, user_guid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [name, status, description, url, company_name, questions, source, guid, user_guid],
        (error, response) => {
          if (error) return reject(error);
          if (response.rows.length) {
            const jobId = response.rows[0].id;
            if (jobId) {
              resolve({ message: `The job: ${guid} was created successfully`});
            }
          } else {
            resolve({ message: 'The job could not be saved'})
          }
        }
      )
    })
  }

  static getJobs({ user_guid }) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT name, status, description, url, company_name, questions, source, guid FROM job WHERE user_guid=$1`,
        [user_guid],
        (error, response) => {
          if (error) return reject(error);
          if (response.rows.length) {
            resolve({jobs: response.rows, message: `${response.rows.length} jobs were retrieved`})
          } else {
            resolve({jobs: [], message: 'No jobs were found'})
          }
        })
    })
  }

  // static storePushSubscription({ emailHash, pushSubscription }) {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `UPDATE wastenot_user SET push_subscription=$1 WHERE "emailHash"=$2`,
  //       [pushSubscription, emailHash],
  //       (error, response) => {
  //         if (error) return reject(error);
  //         resolve({ message: 'user acct was updated with pushSubscription' });
  //       }
  //     )
  //   })
  // }

  static archiveJob({ job_guid }) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE job SET status='archived' WHERE guid=$1 RETURNING id`,
        [job_guid],
        (error, response) => {
          if (error) return reject(error);
            if (response.rows.length && response.rows[0].id) {
              resolve({ message: `Job: ${job_guid} was archived` });
            } else {
              resolve({message: 'The job could not be archived. Please wait a few moments and try again.'})
            }
        }
      )
    })
  }

}

module.exports = JobTable;
