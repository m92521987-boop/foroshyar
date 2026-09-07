/* =========================================================
   فروش‌یار — رفتار عمومی سایت (هدر، منوی موبایل)
   ========================================================= */
(function () {
  const toggleBtn = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
