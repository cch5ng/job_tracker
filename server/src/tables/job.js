require('dotenv').config()
const db = require('../databasePool');

class JobTable {
  static postJob({name, status, description, url, company_name, questions, source, user_guid, guid, created_at}) {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO job (name, status, description, url, company_name, questions, source, guid, user_guid, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [name, status, description, url, company_name, questions, source, guid, user_guid, created_at],
        (error, response) => {
          if (error) return reject(error);
          if (response.rows.length) {
            const jobId = response.rows[0].id;
            if (jobId) {
              resolve({ message: `The job: ${guid} was created successfully`,
                        job_guid: guid,
                        status: 'success'
              });
            }
          } else {
            resolve({ message: 'The job could not be saved'})
          }
        }
      )
    })
  }

  static updateJob({name, status, description, url, company_name, questions, source, user_guid, guid}) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE job SET name=$3, status=$4, description=$5, url=$6, company_name=$7, questions=$8, source=$9 WHERE guid=$1 AND user_guid=$2 RETURNING id`,
        [guid, user_guid, name, status, description, url, company_name, questions, source],
        (error, response) => {
          if (error) return reject(error);
          if (response.rows.length) {
            const jobId = response.rows[0].id;
            if (jobId) {
              resolve({ message: `The job: ${guid} was updated successfully`});
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
        `SELECT name, status, description, url, company_name, questions, source, guid, created_at FROM job WHERE user_guid=$1`,
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

  static getJobByGuid({ job_guid }) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT name, status, description, url, company_name, questions, source, guid, created_at FROM job WHERE guid=$1`,
        [job_guid],
        (error, response) => {
          if (error) return reject(error);
          if (response.rows.length) {
            resolve({job: response.rows[0], message: 'The job was retrieved'})
          } else {
            resolve({jobs: [], message: 'No jobs were found'})
          }
        })
    })
  }

  static archiveJob({ job_guid }) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE job SET status='archived' WHERE guid=$1 RETURNING id`,
        [job_guid],
        (error, response) => {
          if (error) return reject(error);
            if (response.rows.length && response.rows[0].id) {
              resolve({ 
                message: `Job: ${job_guid} was archived`,
                status: 'success'
              });
            } else {
              resolve({message: 'The job could not be archived. Please wait a few moments and try again.'})
            }
        }
      )
    })
  }

}

module.exports = JobTable;
