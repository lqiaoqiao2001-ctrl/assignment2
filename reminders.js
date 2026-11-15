(function (root) {
  'use strict';

  const hours = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const dates = { today: 'Mon, 16 Nov', tomorrow: 'Tue, 17 Nov' };

  function parseRequest(input) {
    const request = input.trim().match(/^remind me to\s+(.+?)\s+(today|tomorrow)\s+at\s+(.+?)\s*[.!?]?$/i);
    if (!request) return { error: 'Use “Remind me to [task] today or tomorrow at [time]”.' };

    const [, task, day, time] = request;
    const clock = time.match(/^(?:([0-9]{1,2})(?::([0-9]{2}))?|([a-z]+))\s*(a\.?m\.?|p\.?m\.?)?$/i);
    const error = { error: 'Use a time such as nine, 9 pm, 9:30 am or 21:00.' };
    if (!clock) return error;

    const [, numeral, minutes, word, period] = clock;
    const hour = word ? hours.indexOf(word.toLowerCase()) + 1 : Number(numeral);
    const minute = Number(minutes || 0);
    if ((word && !hour) || hour > 23 || minute > 59) return error;
    if (period && (hour < 1 || hour > 12)) return error;
    const choices = period ? [(hour % 12) + (period.toLowerCase().startsWith('p') ? 12 : 0)]
      : hour >= 1 && hour <= 12 ? [hour % 12, (hour % 12) + 12] : [hour];

    return { task, day: day.toLowerCase(), minute, choices };
  }

  function decide(request, policy) {
    if (request.choices.length === 2 && policy !== 'direct') return 'clarify';
    return policy === 'confirm' ? 'confirm' : 'save';
  }

  function formatTime(hour, minute) {
    return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'a.m.' : 'p.m.'}`;
  }

  function makeReminder(request, hour, assumed = false) {
    if (!request.choices.includes(hour)) throw new RangeError('Time must be one of the parsed choices.');
    return { task: request.task, day: request.day, hour, minute: request.minute, assumed };
  }

  const api = { dates, parseRequest, decide, formatTime, makeReminder };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TimeCheck = api;
})(globalThis);
