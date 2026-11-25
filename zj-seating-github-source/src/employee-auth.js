const SESSION_KEY = 'zj-employee-demo-session-v1';

export const DEMO_EMPLOYEES = Object.freeze([
  Object.freeze({
    id: 'sales-tester-mctestington',
    name: 'Tester McTestington',
    email: 'sales.user@demo.local',
    role: 'Sales User',
    initials: 'TM'
  }),
  Object.freeze({
    id: 'sales-manager-morgan-lee',
    name: 'Morgan Lee',
    email: 'sales.manager@demo.local',
    role: 'Sales Manager',
    initials: 'ML'
  })
]);

export const DEMO_EMPLOYEE = DEMO_EMPLOYEES[0];

function publicIdentity(employee) {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    initials: employee.initials
  };
}

function savedSession() {
  try {
    const session = JSON.parse(window.sessionStorage.getItem(SESSION_KEY));
    const employee = DEMO_EMPLOYEES.find((account) => account.id === session?.user?.id);
    if (!employee || !session.authenticatedAt) return null;
    return { ...session, user: publicIdentity(employee), demoOnly: true };
  } catch {
    return null;
  }
}

function persistSession(employee) {
  const session = {
    user: publicIdentity(employee),
    authenticatedAt: new Date().toISOString(),
    demoOnly: true
  };
  try { window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch {}
  return session;
}

export function clearEmployeeSession() {
  try { window.sessionStorage.removeItem(SESSION_KEY); } catch {}
}

export function initEmployeeAuth({ onAuthenticated, onLoggedOut }) {
  // Real access control happens at Cloudflare Access (one-time email code).
  // This screen only picks which demo role to show inside the workspace.
  const loginView = document.querySelector('#employee-login');
  const form = document.querySelector('#employee-login-form');
  const accountButtons = [...document.querySelectorAll('.demo-account-picker [data-demo-account]')];
  let selectedDemoId = DEMO_EMPLOYEE.id;

  function selectDemoAccount(id) {
    const employee = DEMO_EMPLOYEES.find((account) => account.id === id) || DEMO_EMPLOYEE;
    selectedDemoId = employee.id;
    accountButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.demoAccount === employee.id)));
  }

  function showLogin() {
    loginView.hidden = false;
    document.body.classList.remove('employee-authenticated');
    document.title = 'Employee Workspace | ZJ Seating';
  }

  function authenticate(session) {
    loginView.hidden = true;
    document.body.classList.add('employee-authenticated');
    onAuthenticated(session.user);
  }

  accountButtons.forEach((button) => button.addEventListener('click', () => selectDemoAccount(button.dataset.demoAccount)));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const employee = DEMO_EMPLOYEES.find((account) => account.id === selectedDemoId) || DEMO_EMPLOYEE;
    authenticate(persistSession(employee));
  });

  document.querySelector('#employee-logout').addEventListener('click', () => {
    clearEmployeeSession();
    selectDemoAccount(DEMO_EMPLOYEE.id);
    onLoggedOut();
    showLogin();
  });

  selectDemoAccount(DEMO_EMPLOYEE.id);
  const existing = savedSession();
  if (existing) authenticate(existing);
  else showLogin();
}
