'use strict';

const test = require('ava').test;
const sinon = require('sinon');
const moment = require('moment');

const jpdate = require('src');

test.beforeEach((t) => {
  const now = moment('2016-01-22 01:23:45');
  t.context.timer = sinon.useFakeTimers(now.toDate().getTime(), 'Date');
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
    { elem: 'あした', relative: 1, type: 'days' },
    { elem: '3秒後', relative: 3, type: 'seconds' },
    { elem: '30分後', relative: 30 * 60, type: 'seconds' },
    { elem: '二十三時間後', relative: 23 * 60 * 60, type: 'seconds' },
    { elem: '十時', relative: (moment({ hour: 10 }).toDate().getTime() - Date.now()) / 1000, type: 'seconds' },
    {
      elem: '十時二十分',
      relative: (moment({ hour: 10, minute: 20 }).toDate().getTime() - Date.now()) / 1000,
      type: 'seconds'
    },
    {
      elem: '十時二十分三十五秒',
      relative: (moment({ hour: 10, minute: 20, second: 35 }).toDate().getTime() - Date.now()) / 1000,
      type: 'seconds'
    }
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
    '50分後': moment(now).add(50, 'minutes').toDate(),
    'あさって': moment(now).add(2, 'days').toDate(),
    '明日の一時間後': moment(now).add(1, 'days').add(1, 'hours').toDate(),
    '来年のきょう': moment(now).add(1, 'years').toDate(),
    '一年前の十日後': moment(now).add(-1, 'years').add(10, 'days').toDate(),
    '2年後の21日前': moment(now).add(2, 'years').add(-21, 'days').toDate(),
    '３年後': moment(now).add(3, 'years').toDate(),
    '10年後の昨日': moment(now).add(10, 'years').add(-1, 'days').toDate(),
    '百年後の一昨日': moment(now).add(100, 'years').add(-2, 'days').toDate()
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
