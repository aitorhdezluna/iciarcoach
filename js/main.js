/**
 * Caminar(se) — Icíar Coach
 * Interacciones nativas, revelaciones con IntersectionObserver y navegación accesible.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Detección de JS habilitado
  document.documentElement.classList.remove('no-js');

  // 2. Control de año dinámico en footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 3. Menú Móvil Accesible
  const menuToggle = document.getElementById('menu-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.contains('is-open');
      toggleMenu(!isOpen);
    });

    // Cerrar al pulsar un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('is-open')) {
          toggleMenu(false);
        }
      });
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        toggleMenu(false);
        menuToggle.focus();
      }
    });
  }

  function toggleMenu(state) {
    primaryNav.classList.toggle('is-open', state);
    menuToggle.classList.toggle('is-active', state);
    menuToggle.setAttribute('aria-expanded', state);
    document.body.style.overflow = state ? 'hidden' : '';
  }

  // 4. Header Auto-Hide con Scroll
  const header = document.getElementById('site-header');
  let lastScrollY = window.scrollY;
  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
      // Scroll hacia abajo -> ocultar
      header.classList.add('header-hidden');
    } else {
      // Scroll hacia arriba -> mostrar
      header.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // 5. Revelación Editorial con Intersection Observer
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    reveals.forEach(element => revealObserver.observe(element));
  } else {
    // Fallback directo
    reveals.forEach(el => el.classList.add('is-revealed'));
  }

  // 6. Acordeón Cinemático Accesible (FAQ)
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const targetPanelId = trigger.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetPanelId);

      // Cierre de otros paneles
      accordionTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherPanelId = otherTrigger.getAttribute('aria-controls');
          const otherPanel = document.getElementById(otherPanelId);
          if (otherPanel) {
            otherPanel.hidden = true;
          }
        }
      });

      // Conmutar el seleccionado
      trigger.setAttribute('aria-expanded', !isExpanded);
      if (targetPanel) {
        targetPanel.hidden = isExpanded;
      }
    });
  });
});
