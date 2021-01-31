const {getDictFromAr, getArFromDict, convertLocalDateTimeToISOStr, 
  convertISOStrToLocalDateTime, orderArByProp, prettyFormatDate} = require('./index');

const jobsAr = [
  {guid: 1, name: 'job1', company_name: 'company1'},
  {guid: 2, name: 'job2', company_name: 'company2'}
]
const jobsDict = {
  1: {guid: 1, name: 'job1', company_name: 'company1'},
  2: {guid: 2, name: 'job2', company_name: 'company2'}
}

test('getDictFromAr', () => {
  expect(getDictFromAr(jobsAr)).toEqual(jobsDict);
});

test('getArFromDict', () => {
  expect(getArFromDict(jobsDict)).toEqual(jobsAr);
});

test('prettyFormatDate - single digit', () => {
  expect(prettyFormatDate(9)).toEqual('09');
});

test('prettyFormatDate - double digit', () => {
  expect(prettyFormatDate(28)).toEqual('28');
});

//date_time or created_at
let eventsAr = [
  {guid: 3, date_time: '2021-01-31T00:00:00.000Z', description: 'test event3'},
  {guid: 6, date_time: '2021-01-03T00:00:00.000Z', description: 'test event6'},
  {guid: 9, date_time: '2021-05-09T00:00:00.000Z', description: 'test event9'}
];

let eventsAr2 = [
  {guid: 3, date_time: '2021-01-31T00:00:00.000Z', description: 'test event3'},
  {guid: 6, date_time: '2021-01-03T00:00:00.000Z', description: 'test event6'},
  {guid: 9, date_time: '2021-05-09T00:00:00.000Z', description: 'test event9'}
];

const eventsArChron = [
  {guid: 6, date_time: '2021-01-03T00:00:00.000Z', description: 'test event6'},
  {guid: 3, date_time: '2021-01-31T00:00:00.000Z', description: 'test event3'},
  {guid: 9, date_time: '2021-05-09T00:00:00.000Z', description: 'test event9'}
];

const eventsArBackChron = [
  {guid: 9, date_time: '2021-05-09T00:00:00.000Z', description: 'test event9'},
  {guid: 3, date_time: '2021-01-31T00:00:00.000Z', description: 'test event3'},
  {guid: 6, date_time: '2021-01-03T00:00:00.000Z', description: 'test event6'}
];


test('orderArByProp - asc', () => {
  orderArByProp(eventsAr, 'date_time', 'asc');
  expect(eventsAr).toEqual(eventsArChron);
});

test('orderArByProp - desc', () => {
  orderArByProp(eventsAr2, 'date_time', 'desc');
  expect(eventsAr2).toEqual(eventsArBackChron);
});

let jobsAr2 = [
  {guid: 1, created_at: '2021-05-09T00:00:00.000Z', description: 'test event9'},
  {guid: 2, created_at: '2021-01-31T00:00:00.000Z', description: 'test event3'},
  {guid: 3, created_at: '2021-01-03T00:00:00.000Z', description: 'test event6'}
];

let jobsAr3 = [
  {guid: 1, created_at: '2021-01-31T00:00:00.000Z', description: 'test event3'},
  {guid: 2, created_at: '2021-01-03T00:00:00.000Z', description: 'test event6'},
  {guid: 3, created_at: '2021-05-09T00:00:00.000Z', description: 'test event9'}
];

const jobsArChron = [
  {guid: 3, created_at: '2021-01-03T00:00:00.000Z', description: 'test event6'},
  {guid: 2, created_at: '2021-01-31T00:00:00.000Z', description: 'test event3'},
  {guid: 1, created_at: '2021-05-09T00:00:00.000Z', description: 'test event9'}
]

const jobsArBackChron = [
  {guid: 3, created_at: '2021-05-09T00:00:00.000Z', description: 'test event9'},
  {guid: 1, created_at: '2021-01-31T00:00:00.000Z', description: 'test event3'},
  {guid: 2, created_at: '2021-01-03T00:00:00.000Z', description: 'test event6'}  
]

test('orderArByProp - asc jobs', () => {
  orderArByProp(jobsAr2, 'created_at', 'asc');
  expect(jobsAr2).toEqual(jobsArChron);
});

test('orderArByProp - desc jobs', () => {
  orderArByProp(jobsAr3, 'created_at', 'desc');
  expect(jobsAr3).toEqual(jobsArBackChron);
});
