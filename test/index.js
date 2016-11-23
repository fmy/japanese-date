'use strict';

const test = require('ava').test;
const sinon = require('sinon');
const moment = require('moment');

const jpdate = require('src');

test.beforeEach((t) => {
  t.context.timer = sinon.useFakeTimers(new Date('2016/1/22 12:34:56').getTime(), 'Date');
});
test.afterEach((t) => {
  t.context.timer = sinon.restore();
});

test('match', (t) => {
  const arr = [
    { elem: '来年', relative: 1, type: 'years' },
    { elem: 'きょう', relative: 0, type: 'days' },
    { elem: '一年前', relative: -1, type: 'years' },
    { elem: '十日後', relative: 10, type: 'days' },
    { elem: '2年後', relative: 2, type: 'years' },
    { elem: '21日前', relative: -21, type: 'days' },
    { elem: '３年後', relative: 3, type: 'years' },
    { elem: '10年後', relative: 10, type: 'years' },
    { elem: '昨日', relative: -1, type: 'days' },
    { elem: '百年後', relative: 100, type: 'years' },
    { elem: 'あした', relative: 1, type: 'days' }
  ];
  const inputStr = arr.map((e) => {
    return e.elem;
  }).join(',');
  const dates = jpdate.match(inputStr, Date.now());
  t.is(dates.length, arr.length);
  for (const entry of dates.entries()) {
    const date = entry[1];
    t.truthy(date.hasOwnProperty('index'));
    delete date.index;
    t.deepEqual(date, arr[entry[0]]);
  }
});

test('getDate', (t) => {
  const now = Date.now();
  const obj = {
    'あさって': moment(now).add(2, 'days').toDate(),
    '来年のきょう': moment(now).add(1, 'years').toDate(),
    '一年前の十日後': moment(now).add(-1, 'years').add(10, 'days').toDate(),
    '2年後の21日前': moment(now).add(2, 'years').add(-21, 'days').toDate(),
    '３年後': moment(now).add(3, 'years').toDate(),
    '10年後の昨日': moment(now).add(10, 'years').add(-1, 'days').toDate(),
    '百年後のあした': moment(now).add(100, 'years').add(1, 'days').toDate()
  };
  const keys = Object.keys(obj);
  const inputStr = keys.join(',');
  const dates = jpdate.getDate(inputStr, now);
  t.is(dates.length, keys.length);
  for (const entry of dates.entries()) {
    const date = entry[1];
    const inputDate = obj[keys[entry[0]]];
    t.deepEqual(date.getTime(), inputDate.getTime(), `${keys[entry[0]]}`);
  }
});