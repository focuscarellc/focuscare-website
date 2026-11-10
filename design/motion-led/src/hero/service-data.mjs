import { WF } from './data.mjs';

// Value illustrations use generic steps, not customer records or measured results.
// Share the approved hero's surfaces, camera, native icons and timeline.
const stories = {
  recruitment: {
    title: 'Application to interview', hot: 1,
    rows: [['Application', 'Received', 'Received'], ['Hiring stage', 'Screening', 'Interview'], ['Next action', 'Not set', 'Recorded']],
    note: ['Keep candidates moving.', 'You decide who to hire.']
  },
  training: {
    title: 'Files and requirements', hot: 1,
    rows: [['Training files', 'Organized', 'Organized'], ['Certificate', 'Needed', 'Received'], ['Your review', 'Waiting', 'Ready']],
    note: ['See what is missing or due.', 'You confirm completion.']
  },
  payroll: {
    title: 'Time records to review', hot: 1,
    rows: [['Period records', 'Organized', 'Organized'], ['Time correction', 'Missing', 'Added'], ['Reconciliation', 'Waiting', 'Ready']],
    note: ['Fewer gaps to chase.', 'You reconcile records and approve payroll.']
  },
  operations: {
    title: 'Daily records, connected', hot: 0,
    rows: [['Daily form', 'Started', 'Complete'], ['Medication log', 'Captured', 'Captured'], ['Your review', 'Waiting', 'Ready']],
    note: ['Consistent records. Clearer review.', 'You oversee daily record review.']
  },
  billing: {
    title: 'Gaps caught before submission', hot: 1,
    rows: [['Claim details', 'Organized', 'Organized'], ['Authorization', 'Missing', 'Added'], ['Your review', 'Waiting', 'Ready']],
    note: ['Catch gaps before submission.', 'You verify and authorize submission.']
  },
  compliance: {
    title: 'Records and follow-up', hot: 2,
    rows: [['Staff documents', 'Organized', 'Organized'], ['Renewal dates', 'Tracked', 'Tracked'], ['Missing record', 'Needs follow-up', 'Assigned']],
    note: ['Know what needs attention.', 'You oversee records and follow-up.']
  }
};

export const SERVICE_WF = WF.map(w => {
  const story = stories[w.id];
  const rows = done => story.rows.map(([label, start, end], i) => [label, done ? end : start, done ? (i === story.hot ? 'info' : 'ok') : (i === story.hot ? 'due' : 'n')]);
  return { ...w, rw: 400, title: story.title, s: {
    begin: { lab: 'Before', chip: ['In progress', 'n'], rows: rows(false) },
    action: { lab: 'Connected workflow', hot: story.hot, chip: ['Updating', 'info'], rows: rows(true) },
    settled: { lab: 'Clear next step', chip: ['For your review', 'info'], rows: rows(true), note: story.note }
  } };
});
