const getDictFromAr = (ar) => {
  let dict = {};
  ar.forEach(job => {
    let id = job.guid;
    dict[id] = job;
  })
  return dict;
}

const getArFromDict = (dict) => {
  let ar = [];
  Object.keys(dict).forEach(key => {
    ar.push(dict[key])
  })
  return ar;
}

const getCreateableDataFromDict = (dict) => {
  let objAr = [];
  Object.keys(dict).forEach(k => {
    let curObj = dict[k];
    let newObj = {};
    newObj.value = curObj.id;
    newObj.label = curObj.name;
    objAr.push(newObj);
  });
  objAr.sort((a, b) => {
    let compA = a.label;
    let compB = b.label;
    if (compA < compB) {
      return -1;
    } else if (compB < compA) {
      return 1;
    } else {
      return 0;
    }
  })
  return objAr;
}

//the prop name may be date_time or created_at but always ISO date/time string
const orderArByProp = (ar, prop, order) => {
  ar.sort(function(a, b) {
    var elA = new Date(a[prop]);
    var elB = new Date(b[prop]);
    let compareElA = elA.getTime();
    let compareElB = elB.getTime();
    if (order === 'asc') {
      if (compareElA < compareElB) {
        return -1;
      }
      if (compareElA > compareElB) {
        return 1;
      }  
    } else if (order === 'desc') {
      if (compareElA > compareElB) {
        return -1;
      }
      if (compareElA < compareElB) {
        return 1;
      }  
    }
    return 0;
  });
}

const convertLocalDateTimeToISOStr = (dateStr) => {
  if (dateStr.length) {
    let newDate = new Date(dateStr);
    return newDate.toISOString();  
  }
  return dateStr;
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
    return dateNum.toString();
  }
}

export {getDictFromAr, getArFromDict, convertLocalDateTimeToISOStr, 
  convertISOStrToLocalDateTime, orderArByProp, prettyFormatDate,
  getCreateableDataFromDict};