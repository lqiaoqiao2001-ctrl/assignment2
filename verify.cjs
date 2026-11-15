'use strict';

const assert = require('node:assert/strict');
const { parseRequest, decide, formatTime, makeReminder } = require('./reminders.js');
const sample = time => parseRequest(`Remind me to submit my assignment tomorrow at ${time}.`);

const clear = sample('9 p.m.');
const ambiguous = sample('nine');
assert.deepEqual(clear.choices, [21]);
assert.deepEqual(ambiguous.choices, [9, 21]);
assert.equal(decide(clear, 'selective'), 'save');
assert.equal(decide(clear, 'confirm'), 'confirm');
assert.equal(decide(ambiguous, 'selective'), 'clarify');
assert.equal(decide(ambiguous, 'confirm'), 'clarify');
assert.equal(decide(ambiguous, 'direct'), 'save');
assert.deepEqual(sample('12').choices, [0, 12]);
assert.deepEqual(sample('12 a.m.').choices, [0]);
assert.deepEqual(sample('12 p.m.').choices, [12]);
assert.deepEqual(sample('21:35').choices, [21]);
assert.deepEqual(sample('9:30').choices, [9, 21]);
assert.equal(sample('nine pm').choices[0], 21);
for (const bad of ['24:00', '9:60', '21 pm', 'zero', '0 am']) assert.ok(sample(bad).error);
assert.ok(parseRequest('Remind me next Thursday').error);
assert.equal(formatTime(0, 4), '12:04 a.m.');
assert.equal(formatTime(12, 50), '12:50 p.m.');
assert.deepEqual(makeReminder(ambiguous, 21), {
  task: 'submit my assignment', day: 'tomorrow', hour: 21, minute: 0, assumed: false
});
assert.throws(() => makeReminder(clear, 9), RangeError);

console.log('Passed parser, time formatting, reminder validation and all three policies.');
