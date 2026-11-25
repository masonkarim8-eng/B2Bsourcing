const menus = [...document.querySelectorAll('[data-nav-menu]')];
const desktop = window.matchMedia('(min-width: 1024px)');

function closeAll(except = null) {
  menus.forEach((menu) => { if (menu !== except) menu.open = false; });
}

menus.forEach((menu) => {
  const summary = menu.querySelector('summary');
  summary.setAttribute('aria-expanded', String(menu.open));
  menu.addEventListener('toggle', () => {
    summary.setAttribute('aria-expanded', String(menu.open));
    if (menu.open) closeAll(menu);
  });
  menu.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && desktop.matches) menu.open = true;
  });
  menu.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse' && desktop.matches && !menu.contains(document.activeElement)) menu.open = false;
  });
  menu.addEventListener('focusout', (event) => {
    if (!menu.contains(event.relatedTarget)) menu.open = false;
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-nav-menu]')) closeAll();
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const active = menus.find((menu) => menu.open && menu.contains(document.activeElement));
  closeAll();
  active?.querySelector('summary').focus();
});
document.querySelector('.nav-toggle')?.addEventListener('click', () => closeAll());
document.querySelectorAll('#primary-nav a').forEach((link) => link.addEventListener('click', () => closeAll()));
