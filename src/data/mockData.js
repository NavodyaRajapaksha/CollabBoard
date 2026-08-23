export const mockTasks = [
  {
    id: 1,
    title: 'User research synthesis',
    column: 'todo',
    tag: 'research',
    description: 'Compile user interview findings',
  },
  {
    id: 2,
    title: 'Low-fi wireframes',
    column: 'todo',
    tag: 'design',
    description: 'Create initial wireframe sketches',
  },
  {
    id: 3,
    title: 'Set up CI pipeline',
    column: 'todo',
    tag: 'devops',
    description: 'Configure GitHub Actions',
  },
  {
    id: 4,
    title: 'Backend API design',
    column: 'doing',
    tag: 'backend',
    description: 'Design REST endpoints',
  },
  {
    id: 5,
    title: 'Component library setup',
    column: 'doing',
    tag: 'frontend',
    description: 'Setup reusable components',
  },
  {
    id: 6,
    title: 'Project kickoff',
    column: 'done',
    tag: 'meeting',
    description: 'Initial team meeting',
  },
  {
    id: 7,
    title: 'Team onboarding',
    column: 'done',
    tag: 'people',
    description: 'Setup team accounts',
  },
];

export const columns = [
  { id: 'todo', label: 'To Do', icon: 'fa-circle', color: '#94a3b8' },
  { id: 'doing', label: 'Doing', icon: 'fa-circle', color: '#f59e0b' },
  { id: 'done', label: 'Done', icon: 'fa-circle', color: '#22c55e' },
];