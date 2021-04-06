require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const db = require('../databasePool');

class CompanyTable {

//get all companies for given user
  static getCompanies({ user_guid }) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT name, id, purpose, description, financial FROM company WHERE user_guid=$1`,
        [user_guid],
        (error, response) => {
          if (error) return reject(error);
          if (response.rows.length) {
            resolve({companies: response.rows, message: `${response.rows.length} companies were retrieved`})
          } else {
            resolve({companies: [], message: 'No companies were found'})
          }
        })
    })
  }

  //create
  static postCompany({name, user_guid}) {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO company (name, user_guid) VALUES ($1, $2) RETURNING id`,
        [name, user_guid],
        (error, response) => {
          if (error) return reject(error);
          if (response.rows.length) {
            const companyId = response.rows[0].id;
            if (companyId) {
              resolve({ message: `The company, ${name}, was created successfully`,
                        companyId,
                        status: 'success'
              });
            }
          } else {
            resolve({ message: 'The company could not be saved'})
          }
        }
      )
    })
  }

  //update
  static updateCompany({name, id, financial, description, purpose}) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE company SET name=$1, financial=$3, description=$4, purpose=$5 WHERE id=$2 RETURNING id`,
        [name, id, financial, description, purpose],
        (error, response) => {
          if (error) return reject(error);
          if (response.rows.length) {
            const companyId = response.rows[0].id;
            if (companyId) {
              resolve({ type: 'success', companyId, message: `The company, ${name}, was updated successfully`});
            }
          } else {
            resolve({ type: 'error', message: 'The company could not be saved'})
          }
        }
      )
    })
  }

}

module.exports = CompanyTable;
