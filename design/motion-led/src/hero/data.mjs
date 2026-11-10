// Single source for the six-workflow hero: static HTML (render.mjs), the reduced-motion
// overview and the runtime (runtime.js) all read these records. Generic role/record
// labels only; no personal data, approvals, payments or compliance guarantees.
export const WF = [
  { id: 'recruitment', name: 'Recruitment', ua: 'user', title: 'Applicant · Care aide role', rw: 400, gx: 22, gy: 18,
    s: { begin: { lab: 'Screening', chip: ['Screening', 'info'], rows: [['Application form', 'Received', 'ok'], ['Screening questions', 'Complete', 'ok'], ['Interview', 'Not started', 'n']] },
         action: { lab: 'Screening → interview', hot: 2, chip: ['Moving stage', 'info'], rows: [['Application form', 'Received', 'ok'], ['Screening questions', 'Complete', 'ok'], ['Interview', 'Requested', 'info']] },
         settled: { lab: 'Next action recorded', chip: ['Interview stage', 'info'], rows: [['Application form', 'Received', 'ok'], ['Screening questions', 'Complete', 'ok'], ['Interview', 'Requested', 'info']], note: ['Next action: schedule interview', 'You decide who is hired.'] } } },
  { id: 'training', name: 'Training', ua: 'folder', title: 'Staff training file', rw: 420, gx: 70, gy: 16,
    s: { begin: { lab: 'Awaiting file', chip: ['1 needed', 'due'], rows: [['Orientation record', 'Verified', 'ok'], ['CPR certificate', 'Not received', 'miss'], ['Annual training', 'Due 30 Nov', 'due']] },
         action: { lab: 'File received', hot: 1, chip: ['Receiving', 'info'], rows: [['Orientation record', 'Verified', 'ok'], ['CPR certificate', 'Received', 'info'], ['Annual training', 'Due 30 Nov', 'due']] },
         settled: { lab: 'Received, not yet verified', chip: ['In review', 'info'], rows: [['Orientation record', 'Verified', 'ok'], ['CPR certificate', 'Received · not verified', 'due'], ['Annual training', 'Due 30 Nov', 'due']], note: ['Verification: your review', 'Receipt is logged. You confirm the file.'] } } },
  { id: 'payroll', name: 'Payroll', ua: 'clock', title: 'Pay period · Week 2', rw: 440, gx: 30, gy: 70,
    s: { begin: { lab: 'Missing clock-out', chip: ['1 gap', 'miss'], rows: [['Mon 08:00 – 16:00', '8.0 h', 'ok'], ['Tue 08:00 – no clock-out', 'Missing', 'miss'], ['Wed 08:00 – 16:30', '8.5 h', 'ok']] },
         action: { lab: 'Correction captured', hot: 1, chip: ['Correcting', 'info'], rows: [['Mon 08:00 – 16:00', '8.0 h', 'ok'], ['Tue 08:00 – 16:00', 'Correction added', 'info'], ['Wed 08:00 – 16:30', '8.5 h', 'ok']] },
         settled: { lab: 'Ready for reconciliation', chip: ['For your review', 'info'], rows: [['Mon 08:00 – 16:00', '8.0 h', 'ok'], ['Tue 08:00 – 16:00', 'Corrected · pending', 'due'], ['Wed 08:00 – 16:30', '8.5 h', 'ok']], note: ['Before payroll reconciliation', 'You reconcile the period and approve payroll.'] } } },
  { id: 'operations', name: 'Operations', ua: 'clipboard', title: 'Daily log · Morning shift', rw: 410, gx: 76, gy: 64,
    s: { begin: { lab: 'Entry started', chip: ['Draft', 'n'], rows: [['Shift and time', 'Filled', 'ok'], ['Medication log entry', 'Filled', 'ok'], ['Shift note', 'Empty', 'n']] },
         action: { lab: 'Consistent entry', hot: 2, chip: ['Completing', 'info'], rows: [['Shift and time', 'Filled', 'ok'], ['Medication log entry', 'Filled', 'ok'], ['Shift note', 'Added', 'info']] },
         settled: { lab: 'Sent for your review', chip: ['Submitted', 'info'], rows: [['Shift and time', 'Filled', 'ok'], ['Medication log entry', 'Filled', 'ok'], ['Shift note', 'Added', 'ok']], note: ['Waiting for your review', 'You oversee clinical record review.'] } } },
  { id: 'billing', name: 'Billing', ua: 'fileText', title: 'Claim review', rw: 430, gx: 24, gy: 40,
    s: { begin: { lab: 'Missing detail', chip: ['1 exception', 'miss'], rows: [['Service date', 'Present', 'ok'], ['Units', 'Present', 'ok'], ['Authorization number', 'Missing', 'miss']] },
         action: { lab: 'Detail corrected', hot: 2, chip: ['Correcting', 'info'], rows: [['Service date', 'Present', 'ok'], ['Units', 'Present', 'ok'], ['Authorization number', 'Added', 'info']] },
         settled: { lab: 'Ready for your check', chip: ['Not submitted', 'n'], rows: [['Service date', 'Present', 'ok'], ['Units', 'Present', 'ok'], ['Authorization number', 'Added', 'ok']], note: ['Review, then authorize', 'You decide when to submit.'] } } },
  { id: 'compliance', name: 'Compliance', ua: 'shield', title: 'Staff record', rw: 420, gx: 64, gy: 26,
    s: { begin: { lab: 'Record missing', chip: ['2 open', 'due'], rows: [['License', 'On file', 'ok'], ['CPR record', 'Due 30 Nov', 'due'], ['TB test result', 'Missing', 'miss']] },
         action: { lab: 'Follow-up assigned', hot: 2, chip: ['Assigning', 'info'], rows: [['License', 'On file', 'ok'], ['CPR record', 'Due 30 Nov', 'due'], ['TB test result', 'Follow-up', 'info']] },
         settled: { lab: 'Owner and due date set', chip: ['2 open', 'due'], rows: [['License', 'On file', 'ok'], ['CPR record', 'Due 30 Nov', 'due'], ['TB test result', 'Follow-up', 'info']], note: ['Follow-up: TB test result', 'You track follow-up, owners and due dates.'] } } }
];

// Beat timing (seconds). contact = press on the moving row; settle = note reveal;
// swap = carriers retract and the same card reshapes into the next workflow.
export const BEAT = 6.2, CONTACT = 1.35, SETTLE = 2.45, SWAP = 5.8, LOOP = BEAT * WF.length;
export const ROWS = 3;
