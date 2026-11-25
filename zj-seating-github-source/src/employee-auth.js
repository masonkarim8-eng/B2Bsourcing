const SESSION_KEY = 'zj-employee-demo-session-v1';

export const DEMO_EMPLOYEES = Object.freeze([
  Object.freeze({
    id: 'sales-tester-mctestington',
    name: 'Tester McTestington',
    email: 'tester.mctestington@zjseating.test',
    password: 'Test2026!',
    role: 'Sales User',
    initials: 'TM'
  }),
  Object.freeze({
    id: 'sales-manager-morgan-lee',
    name: 'Morgan Lee',
    email: 'morgan.lee@zjseating.test',
    password: 'Manage2026!',
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
  const loginView = document.querySelector('#employee-login');
  const form = document.querySelector('#employee-login-form');
  const email = document.querySelector('#employee-email');
  const password = document.querySelector('#employee-password');
  const error = document.querySelector('#employee-login-error');
  const toggle = document.querySelector('#employee-password-toggle');
  const demoFill = document.querySelector('#employee-demo-fill');
  const accountButtons = [...document.querySelectorAll('.demo-account-picker [data-demo-account]')];
  let selectedDemoId = DEMO_EMPLOYEE.id;

  function clearError() {
    error.hidden = true;
    error.textContent = '';
    email.removeAttribute('aria-invalid');
    password.removeAttribute('aria-invalid');
  }

  function selectDemoAccount(id) {
    const employee = DEMO_EMPLOYEES.find((account) => account.id === id) || DEMO_EMPLOYEE;
    selectedDemoId = employee.id;
    accountButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.demoAccount === employee.id)));
    document.querySelector('#demo-credentials-title').textContent = `FICTIONAL ${employee.role.toUpperCase()}`;
    document.querySelector('#demo-account-name').textContent = employee.name;
    document.querySelector('#demo-account-email').textContent = employee.email;
    document.querySelector('#demo-account-password').textContent = employee.password;
    demoFill.dataset.demoAccount = employee.id;
    demoFill.textContent = `Use ${employee.role.toLowerCase()} credentials`;
    clearError();
  }

  function showLogin() {
    loginView.hidden = false;
    document.body.classList.remove('employee-authenticated');
    document.title = 'Employee Sign In | ZJ Seating';
    clearError();
    password.value = '';
    window.setTimeout(() => email.focus(), 0);
  }

  function authenticate(session) {
    loginView.hidden = true;
    document.body.classList.add('employee-authenticated');
    clearError();
    onAuthenticated(session.user);
  }

  accountButtons.forEach((button) => button.addEventListener('click', () => selectDemoAccount(button.dataset.demoAccount)));
  demoFill.addEventListener('click', () => {
    const employee = DEMO_EMPLOYEES.find((account) => account.id === selectedDemoId) || DEMO_EMPLOYEE;
    email.value = employee.email;
    password.value = employee.password;
    clearError();
    document.querySelector('#employee-sign-in').focus();
  });

  toggle.addEventListener('click', () => {
    const show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    toggle.textContent = show ? 'Hide' : 'Show';
    toggle.setAttribute('aria-pressed', String(show));
    toggle.setAttribute('aria-label', `${show ? 'Hide' : 'Show'} password`);
    password.focus();
  });

  email.addEventListener('input', clearError);
  password.addEventListener('input', clearError);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const normalizedEmail = email.value.trim().toLowerCase();
    const employee = DEMO_EMPLOYEES.find((account) => account.email === normalizedEmail && account.password === password.value);
    if (!employee) {
      error.textContent = 'Those details do not match either fictional demo account. Choose an account above and use its shown credentials.';
      error.hidden = false;
      email.setAttribute('aria-invalid', 'true');
      password.setAttribute('aria-invalid', 'true');
      password.focus();
      password.select();
      return;
    }
    authenticate(persistSession(employee));
  });

  document.querySelector('#employee-logout').addEventListener('click', () => {
    clearEmployeeSession();
    form.reset();
    password.type = 'password';
    toggle.textContent = 'Show';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.setAttribute('aria-label', 'Show password');
    selectDemoAccount(DEMO_EMPLOYEE.id);
    onLoggedOut();
    showLogin();
  });

  selectDemoAccount(DEMO_EMPLOYEE.id);
  const existing = savedSession();
  if (existing) authenticate(existing);
  else showLogin();
}
