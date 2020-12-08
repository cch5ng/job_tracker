const getDictFromAr = (ar) => {
  let dict = {};
  ar.forEach(job => {
    let id = job.guid;
    dict[id] = job;
  })
  return dict;
}

const getArFromDictBasic = (dict) => {
  let ar = [];
  Object.keys(dict).forEach(key => {
    ar.push(dict[key])
  })
  return ar;
}

const getArFromDict = (dict) => {
  let ar = [];
  Object.keys(dict).forEach(key => {
    ar.push(dict[key])
  })
  orderArByCreatedDate(ar);
  return ar;
}

//sorts array of objects by created_at date
//most recent to oldest
const orderArByCreatedDate = (ar) => {
  ar.sort(function(a, b) {
    var dateA = a.created_at;
    var dateB = b.created_at;
    if (dateA > dateB) {
      return -1;
    }
    if (dateA < dateB) {
      return 1;
    }
    return 0;
  });
}

const orderArByProp = (ar, prop, order) => {
  ar.sort(function(a, b) {
    var elA = new Date(a[prop]);
    var elB = new Date(b[prop]);
    let compareElA = elA.getTime();
    let compareElB = elB.getTime();
    if (order === 'asc') {
      if (compareElA > compareElB) {
        return -1;
      }
      if (compareElA < compareElB) {
        return 1;
      }  
    } else if (order === 'desc') {
      if (compareElA < compareElB) {
        return -1;
      }
      if (compareElA > compareElB) {
        return 1;
      }  
    }
    return 0;
  });
}

const convertLocalDateTimeToISOStr = (dateStr) => {
  let newDate = new Date(dateStr);
  return newDate.toISOString();
}

const convertISOStrToLocalDateTime = (dateStr) => {
  let newDate = new Date(dateStr);
  return newDate.toLocaleString();
}

const prettyFormatDate = (dateNum) => {
  let dateStr = dateNum.toString();
  if (dateStr.length === 1) {
    return `0${dateStr}`;
  } else {
    return dateNum;
  }
}

export {getDictFromAr, getArFromDict, convertLocalDateTimeToISOStr, convertISOStrToLocalDateTime, orderArByProp, getArFromDictBasic, prettyFormatDate};