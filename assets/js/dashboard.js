/**
 * STACKLY PHOTOGRAPHY PORTFOLIO — DASHBOARD CORE CONTROLLER
 * Handles role-based navigation, live role-switching, session state,
 * mobile drawer management, and iframe page routing.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Session Setup & Graceful Fallback
  let user = JSON.parse(localStorage.getItem('loggedInUser'));
  
  // If not logged in, provide a default demo session so the dashboard works out of the box
  if (!user || !user.role) {
    user = {
      name: 'Eleanor Vance',
      role: 'Client',
      email: 'eleanor@stacklystudio.com'
    };
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  // Role defaults for initial landing
  const roleDefaults = {
    'Client': 'client_overview',
    'Photographer': 'photographer_overview',
    'Agency': 'agency_overview'
  };

  // Demo personas for instant switching
  const personas = {
    'Client': { name: 'Eleanor Vance', email: 'eleanor@stacklystudio.com' },
    'Photographer': { name: 'Julian Thorne', email: 'julian@stacklystudio.com' },
    'Agency': { name: 'Stackly Exec Suite', email: 'director@stacklystudio.com' }
  };

  // UI Elements
  const navUserName = document.getElementById('navUserName');
  const navUserEmail = document.getElementById('navUserEmail');
  const userAvatar = document.getElementById('userAvatar');
  const roleBadge = document.getElementById('roleBadge');

  const navClient = document.getElementById('navClient');
  const navPhotographer = document.getElementById('navPhotographer');
  const navAgency = document.getElementById('navAgency');

  const frame = document.getElementById('dashFrame');
  const sidebar = document.getElementById('dashSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const signoutBtn = document.getElementById('signoutBtn');

  // 2. Render User & Role State
  function applyRole(roleName, pageToLoad) {
    user.role = roleName;
    if (personas[roleName]) {
      user.name = personas[roleName].name;
      user.email = personas[roleName].email;
    }
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    if (navUserName) navUserName.textContent = user.name;
    if (navUserEmail) navUserEmail.textContent = user.email;
    if (userAvatar) userAvatar.textContent = user.name.charAt(0).toUpperCase();
    if (roleBadge) roleBadge.textContent = roleName.toUpperCase();

    // Toggle Nav Lists
    if (navClient) navClient.style.display = roleName === 'Client' ? 'block' : 'none';
    if (navPhotographer) navPhotographer.style.display = roleName === 'Photographer' ? 'block' : 'none';
    if (navAgency) navAgency.style.display = roleName === 'Agency' ? 'block' : 'none';

    // Update Quick-Switcher Buttons
    document.querySelectorAll('.role-switch-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.switchRole === roleName);
    });

    // Determine target page
    const targetPage = pageToLoad || roleDefaults[roleName] || 'client_overview';
    navigateToPage(targetPage);
  }

  // 3. Navigation & Iframe Routing
  function navigateToPage(pageSlug) {
    if (!frame) return;

    const href = 'dashboard/' + pageSlug + '.html';
    frame.src = href;
    sessionStorage.setItem('dashPage', pageSlug);

    // Update active highlight in all visible nav links
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
      const match = a.dataset.page === pageSlug;
      a.classList.toggle('active', match);
    });

    if (window.innerWidth < 992) {
      closeSidebar();
    }
  }

  // Listen to navigation clicks
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page) {
        navigateToPage(page);
      }
    });
  });

  // Role Switcher buttons
  document.querySelectorAll('.role-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newRole = btn.dataset.switchRole;
      if (newRole && newRole !== user.role) {
        sessionStorage.removeItem('dashPage');
        applyRole(newRole);
      }
    });
  });

  // 4. Mobile Drawer Controls
  function openSidebar() {
    if (sidebar) sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // 5. Sign Out
  if (signoutBtn) {
    signoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('loggedInUser');
      sessionStorage.removeItem('dashPage');
      window.location.href = 'index.html';
    });
  }

  // 6. Initialize on Load
  const savedRole = user.role || 'Client';
  const savedPage = sessionStorage.getItem('dashPage') || roleDefaults[savedRole];
  applyRole(savedRole, savedPage);

  // 7. PostMessage bridge for embedded pages
  if (frame) {
    frame.addEventListener('load', () => {
      try {
        frame.contentWindow.postMessage({ type: 'DASH_USER', user }, '*');
      } catch (err) {}
    });
  }
});
