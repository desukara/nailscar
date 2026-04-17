document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 🌐 LANGUAGE SYSTEM
  // =========================

  const path = window.location.pathname;
  let fileName = path.substring(path.lastIndexOf("/") + 1);

  if (!fileName || fileName === "") {
    fileName = "index.html";
  }

  function isJapanesePage(name) {
    return name.includes("-ja.html");
  }

  function isIndexPage(name) {
    return name === "index.html" || name === "index-ja.html";
  }

  function getJapaneseVersion(name) {
    if (!name.includes("-ja.html")) {
      return name.replace(".html", "-ja.html");
    }
    return name;
  }

  function getEnglishVersion(name) {
    return name.replace("-ja.html", ".html");
  }

  function saveLanguage(lang) {
    localStorage.setItem("siteLanguage", lang);
  }

  function getSavedLanguage() {
    return localStorage.getItem("siteLanguage");
  }

  function detectBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    return lang && lang.startsWith("ja") ? "ja" : "en";
  }

  function redirectToLanguage(lang) {
    let target = fileName;

    if (lang === "ja" && !isJapanesePage(fileName)) {
      target = getJapaneseVersion(fileName);
    }

    if (lang === "en" && isJapanesePage(fileName)) {
      target = getEnglishVersion(fileName);
    }

    const query = window.location.search || "";
    const hash = window.location.hash || "";

    if (target !== fileName) {
      window.location.replace(target + query + hash);
    }
  }

  let savedLanguage = getSavedLanguage();

  if (!savedLanguage) {
    savedLanguage = detectBrowserLanguage();
    saveLanguage(savedLanguage);
  }

  if (isIndexPage(fileName)) {
    redirectToLanguage(savedLanguage);
  }

  // =========================
  // 🌐 LANGUAGE TOGGLE UI
  // =========================

  const isJA = isJapanesePage(fileName);

  document.querySelectorAll("[data-lang]").forEach((link) => {
    const lang = link.dataset.lang;

    if ((lang === "ja" && isJA) || (lang === "en" && !isJA)) {
      link.setAttribute("aria-current", "true");
      link.classList.add("active");
    } else {
      link.removeAttribute("aria-current");
      link.classList.remove("active");
    }

    link.addEventListener("click", () => {
      saveLanguage(lang);
    });
  });

  // =========================
  // 📱 INSTALL APP BANNER
  // =========================

  const installBanner = document.getElementById("installBanner");
  const installBtn = document.getElementById("installBtn");
  const closeBanner = document.getElementById("closeBanner");

  let deferredPrompt = null;

  // 🔥 ALWAYS SHOW BANNER
  if (installBanner) {
    installBanner.style.display = "block";
  }

  // Capture install prompt if available
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  // Install button
  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt = null;
      }
    });
  }

  // Close button
  if (closeBanner) {
    closeBanner.addEventListener("click", () => {
      if (installBanner) {
        installBanner.style.display = "none";
      }
    });
  }

  // After install
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    if (installBanner) {
      installBanner.style.display = "none";
    }
  });

  // =========================
  // 📱 MENU TOGGLE
  // =========================

  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  function openMenu() {
    if (!menuToggle || !siteNav) return;

    siteNav.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.textContent = "✕";
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!menuToggle || !siteNav) return;

    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    if (!menuToggle || !siteNav) return;

    const isOpen = siteNav.classList.contains("open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle && siteNav) {
    menuToggle.textContent = "☰";

    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMenu();
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideNav = siteNav.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideNav && !clickedToggle) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // =========================
  // ✨ SCROLL REVEAL
  // =========================

  const sectionsToReveal = document.querySelectorAll(".card, .hero-note");

  if ("IntersectionObserver" in window && sectionsToReveal.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionsToReveal.forEach((item) => {
      item.classList.add("reveal");
      observer.observe(item);
    });
  }
});
