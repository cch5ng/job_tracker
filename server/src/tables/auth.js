require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const db = require('../databasePool');

class AuthTable {
  static postUser({email}) {
    let guid = uuidv4();
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO job_tracker_user (email, guid) VALUES ($1, $2) RETURNING id`,
        [email, guid],
        (error, response) => {
          if (error) return reject(error);
          if (response.rows.length) {
            const userId = response.rows[0].id;
            if (userId) {
              resolve({ message: `The user was created successfully`, user_guid: guid});
            }
          } else {
            resolve({ message: 'The user account could not be created'})
          }
        }
      )
    })
  }

  static getUserGuid({ email }) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT guid from job_tracker_user WHERE email=$1`,
        [email],
        (error, response) => {
          if (error) return reject(error);
          if (response.rows.length) {
            const userGuid = response.rows[0].guid;
            if (userGuid) {
              resolve({ message: 'The guid was retrieved', user_guid: response.rows[0].guid })
            }
          } else {
            resolve({ message: 'The user does not exist'})
          }
        }
      )
    })
  }
}

module.exports = AuthTable;
