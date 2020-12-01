const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
const db = require('../databasePool');

class JobTable {
  static postJob({name, status, description, link, company, questions, source, user_guid}) {
    let guid = uuidv4();
    let db = process.env.PGDATABASE;
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO ${db} (name, status, description, link, company, questions, source, guid, user_guid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [name, status, description, link, company, questions, source, guid, user_guid],
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
        `SELECT name, status, description, link, company, questions, source, FROM job WHERE user_guid=$1`,
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

  // static deletePushSubscription({ emailHash }) {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `UPDATE wastenot_user SET push_subscription=null WHERE "emailHash"=$1`,
  //       [emailHash],
  //       (error, response) => {
  //         if (error) return reject(error);
  //         resolve({ message: 'user acct was updated where pushSubscription was removed' });
  //       }
  //     )
  //   })
  // }

  // static getPushSubscription({ emailHash }) {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `SELECT push_subscription FROM wastenot_user WHERE "emailHash"=$1`,
  //       [emailHash],
  //       (error, response) => {
  //         if (error) return reject(error);
  //         if (response.rows) {
  //           resolve({
  //             subscription: JSON.parse(response.rows[0].push_subscription), 
  //             message: 'user pushSubscription was retrieved' });
  //         }
  //       }
  //     )
  //   })
  // }

  // static getAccount({ emailHash }) {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `SELECT id, "passwordHash", "sessionId" from wastenot_user WHERE "emailHash"=$1`,
  //       [emailHash],
  //       (error, response) => {
  //         if (error) return reject(error);
  //         if (response.rows) {
  //          resolve({ account: response.rows[0] })
  //         }
  //       }
  //     )
  //   })
  // }

  // //userId, timezone
  // //doublecheck where user_id is currently stored
  // static storeUserTimezone({ timezone, emailHash }) {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `UPDATE wastenot_user SET time_zone=$1 WHERE "emailHash"=$2`,
  //       [timezone, emailHash],
  //       (error, response) => {
  //         if (error) return reject(error);
  //         resolve({ message: `Timezone was saved for user`})
  //       })
  //   })
  // }

}

module.exports = JobTable;
