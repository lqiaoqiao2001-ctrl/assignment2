'use strict';

const { dates, parseRequest, decide, formatTime, makeReminder } = TimeCheck;
const byId = id => document.getElementById(id);
const requestInput = byId('request');
const policy = byId('policy');
const status = byId('status');
const policyHints = {
  selective: 'Set clear times immediately. Ask a.m. or p.m. for unclear times.',
  confirm: 'Review every interpreted time before setting it.',
  direct: 'Compare what happens when unclear times default to a.m.'
};

let pending = null;
let reminder = null;
let previous = null;
let canUndo = false;

function render(message) {
  status.textContent = message;
  byId('pending').hidden = !pending;
  byId('saved').hidden = !reminder;
  byId('empty').hidden = Boolean(reminder);
  byId('edit').hidden = Boolean(pending) || !reminder;
  byId('undo').hidden = Boolean(pending) || !canUndo;

  if (pending) {
    const { request, kind } = pending;
    byId('question').textContent = {
      clarify: 'Did you mean a.m. or p.m.?',
      confirm: 'Set this reminder?',
      edit: 'Which time should TimeCheck use?'
    }[kind];
    byId('pending-task').textContent = `${dates[request.day]} · ${request.task}`;
    byId('choices').replaceChildren(...request.choices.map(hour => {
      const button = document.createElement('button');
      button.type = 'button';
      if (kind === 'confirm') button.className = 'primary';
      button.textContent = (kind === 'confirm' ? 'Confirm ' : '') + formatTime(hour, request.minute);
      button.addEventListener('click', () => save(request, hour));
      return button;
    }));
  }

  if (reminder) {
    byId('saved-task').textContent = reminder.task;
    byId('saved-time').textContent = `${dates[reminder.day]} · ${formatTime(reminder.hour, reminder.minute)}`;
    byId('assumption').hidden = !reminder.assumed;
  }
}

function save(request, hour, assumed = false) {
  previous = reminder;
  reminder = makeReminder(request, hour, assumed);
  canUndo = true;
  pending = null;
  render(assumed ? 'Reminder set using the a.m. default.' : 'Reminder set in the simulator.');
  byId('saved-time').focus();
}

byId('request-form').addEventListener('submit', event => {
  event.preventDefault();
  const request = parseRequest(requestInput.value);
  pending = null;
  if (request.error) {
    requestInput.setAttribute('aria-invalid', 'true');
    render(request.error);
    requestInput.focus();
    return;
  }
  requestInput.removeAttribute('aria-invalid');

  const decision = decide(request, policy.value);
  if (decision === 'save') {
    save(request, request.choices[0], request.choices.length === 2);
    return;
  }
  pending = { request, kind: decision };
  render('Choose a time to continue.');
  byId('question').focus();
});

byId('cancel').addEventListener('click', () => {
  const wasEdit = pending.kind === 'edit';
  pending = null;
  render(wasEdit ? 'Time change cancelled.' : 'Request cancelled.');
  (wasEdit ? byId('edit') : requestInput).focus();
});

byId('edit').addEventListener('click', () => {
  const early = reminder.hour % 12;
  pending = { request: { ...reminder, choices: [early, early + 12] }, kind: 'edit' };
  render('Choose a.m. or p.m. for this reminder.');
  byId('question').focus();
});

byId('undo').addEventListener('click', () => {
  reminder = previous;
  previous = null;
  canUndo = false;
  render(reminder ? 'Last change undone. Previous reminder restored.' : 'Last change undone. Reminder removed.');
  (reminder ? byId('saved-time') : requestInput).focus();
});

function clearPending(message) {
  if (pending) {
    pending = null;
    render(message);
  }
}

function sample(time) {
  requestInput.value = `Remind me to submit my assignment tomorrow at ${time}.`;
  requestInput.removeAttribute('aria-invalid');
  pending = null;
  render('Sample loaded. Submit it to continue.');
  requestInput.focus();
}

byId('clear-example').addEventListener('click', () => sample('9 pm'));
byId('ambiguous-example').addEventListener('click', () => sample('nine'));
requestInput.addEventListener('input', () => {
  requestInput.removeAttribute('aria-invalid');
  clearPending('Request changed. Submit it again.');
});
policy.addEventListener('change', () => {
  byId('policy-hint').textContent = policyHints[policy.value];
  clearPending('Policy changed. Submit the request again.');
});
byId('policy-hint').textContent = policyHints[policy.value];
