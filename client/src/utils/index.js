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

const convertLocalDateTimeToISOStr = (dateStr) => {
  let newDate = new Date(dateStr);
  return newDate.toISOString();
}

const convertISOStrToLocalDateTime = (dateStr) => {
  let newDate = new Date(dateStr);
  return newDate.toLocaleString();
}

export {getDictFromAr, getArFromDict, convertLocalDateTimeToISOStr, convertISOStrToLocalDateTime};