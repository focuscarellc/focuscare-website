// Ordered registry of every library component (id, metadata, React component, motion).
import { Button, Toolbar, ClockIn } from './components/actions.jsx';
import { SearchField, EmailInput, Toggle, Checklist, RadioCards, Segmented, Slider, DatePicker } from './components/inputs.jsx';
import { Tabs, Sidebar, CommandPalette } from './components/navigation.jsx';
import { Toast, ProgressRing, Upload, Dialog, StatusBadges } from './components/feedback.jsx';
import { KpiCard, BarChart, LineChart, Timeline, StaffCard } from './components/data.jsx';
import { LIST_A } from './components/x-benchmark.jsx';
import { LIST_B } from './components/x-news.jsx';
import { LIST_C } from './components/x-dev.jsx';
import { LIST_D } from './components/x-agents.jsx';
import { LIST_E } from './components/x-media.jsx';
import { LIST_F } from './components/x-research.jsx';
import { LIST_G } from './components/x-hardware.jsx';
import { DataTable, Stepper, TeamPicker, SignaturePad, ChatThread, EmptyState, Accordion, MedRecord } from './components/extended.jsx';

export const CORE = [
  Button, Toolbar, ClockIn,
  SearchField, EmailInput, Toggle, Checklist, RadioCards, Segmented, Slider, DatePicker, TeamPicker, SignaturePad,
  Tabs, Sidebar, CommandPalette, Stepper, Accordion,
  Toast, ProgressRing, Upload, Dialog, StatusBadges, ChatThread, EmptyState,
  KpiCard, BarChart, LineChart, Timeline, StaffCard, DataTable, MedRecord
];
// Explainer set: editorial/benchmark visuals for narrated explainers (one file per theme).
export const EXPLAINER = [...LIST_A, ...LIST_B, ...LIST_C, ...LIST_D, ...LIST_E, ...LIST_F, ...LIST_G];
export const LIBRARY = [...CORE, ...EXPLAINER];
export const CATEGORIES = [...new Set(LIBRARY.map(c => c.category))];
export const byId = id => LIBRARY.find(c => c.id === id);
export * from './components/actions.jsx';
export * from './components/inputs.jsx';
export * from './components/navigation.jsx';
export * from './components/feedback.jsx';
export * from './components/data.jsx';
export * from './components/extended.jsx';
