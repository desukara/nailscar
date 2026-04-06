document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.getElementById("siteNav");
  const moreToggle = document.querySelector(".more-toggle");
  const moreMenu = document.getElementById("moreMenu");
  const navMore = document.querySelector(".nav-more");
  const currentPage = body.dataset.page || "";
  const reduceMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  const STORAGE_KEY = "nailscar-theme";
  const MOBILE_BREAKPOINT = 900;

  let reduceMotion = reduceMotionQuery.matches;
  let lastMenuTrigger = null;
  let lastMoreTrigger = null;

  const expandState = new WeakMap();

  const pageClassMap = {
    home: "page-home",
    about: "page-about",
    resources: "page-resources",
    contact: "page-contact",
    legalism: "page-legalism",
    healing: "page-healing",
    stories: "page-stories",
    blog: "page-blog",
    faq: "page-faq",
  };

  const pageHrefMap = {
    home: "index.html",
    about: "about.html",
    resources: "resources.html",
    contact: "contact.html",
    legalism: "legalism.html",
    healing: "healing-pages.html",
    stories: "stories.html",
    blog: "blog.html",
    faq: "faq.html",
  };

  const isMobileViewport = () => window.innerWidth <= MOBILE_BREAKPOINT;

  const getSafeStorage = () => {
    try {
      return window.localStorage;
    } catch (error) {
      return null;
    }
  };

  const storage = getSafeStorage();

  const getStoredTheme = () => {
    if (!storage) return null;

    try {
      return storage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  };

  const setStoredTheme = (value) => {
    if (!storage) return;

    try {
      storage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // ignore storage write failures
    }
  };

  const getFocusableElements = (container) => {
    if (!container) return [];

    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hasAttribute("hidden"));
  };

  if (pageClassMap[currentPage]) {
    body.classList.add(pageClassMap[currentPage]);
  }

  const updateHeaderState = () => {
    if (!header) return;

    if (window.scrollY > 18) {
      header.classList.add("is-compact");
      body.classList.add("has-scrolled");
    } else {
      header.classList.remove("is-compact");
      body.classList.remove("has-scrolled");
    }
  };

  const syncThemeButtonLabel = () => {
    if (!themeToggle) return;

    const isDark = body.classList.contains("dark-mode");
    const iconSpan = themeToggle.querySelector("span");

    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", "Toggle theme");

    if (iconSpan) {
      iconSpan.textContent = isDark ? "☀" : "☾";
    }
  };

  const applyTheme = (theme) => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const useDark =
      theme === "dark" || (theme !== "light" && systemPrefersDark);

    body.classList.toggle("dark-mode", useDark);
    syncThemeButtonLabel();
  };

  const applySavedTheme = () => {
    const savedTheme = getStoredTheme();

    if (savedTheme === "dark" || savedTheme === "light") {
      applyTheme(savedTheme);
      return;
    }

    applyTheme(null);
  };

  const setActiveNavLink = () => {
    const navLinks = document.querySelectorAll(".site-nav a");
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    const activeHref = pageHrefMap[currentPage] || currentPath;

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      link.classList.remove("active");
      link.removeAttribute("aria-current");

      if (href && href === activeHref) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  };

  const setMoreMenuState = (isOpen, options = {}) => {
    if (!navMore || !moreToggle || !moreMenu) return;

    const { moveFocus = false, restoreFocus = false } = options;

    navMore.classList.toggle("is-open", isOpen);
    moreToggle.setAttribute("aria-expanded", String(isOpen));
    moreMenu.hidden = !isOpen;

    if (isOpen) {
      lastMoreTrigger =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : moreToggle;

      if (moveFocus) {
        const firstItem = getFocusableElements(moreMenu)[0];
        if (firstItem) firstItem.focus();
      }
    } else if (restoreFocus) {
      const restoreTarget =
        lastMoreTrigger instanceof HTMLElement ? lastMoreTrigger : moreToggle;
      restoreTarget.focus();
    }
  };

  const closeMoreMenu = (options = {}) => {
    setMoreMenuState(false, options);
  };

  const setMenuState = (isOpen, options = {}) => {
    if (!siteNav || !menuToggle) return;

    const { moveFocus = false, restoreFocus = false } = options;

    siteNav.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
    body.classList.toggle("menu-open", isOpen);

    if (!isOpen) {
      closeMoreMenu();

      if (restoreFocus) {
        const restoreTarget =
          lastMenuTrigger instanceof HTMLElement
            ? lastMenuTrigger
            : menuToggle;
        restoreTarget.focus();
      }

      return;
    }

    lastMenuTrigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : menuToggle;

    if (moveFocus && isMobileViewport()) {
      const firstItem = getFocusableElements(siteNav)[0];
      if (firstItem) firstItem.focus();
    }
  };

  const closeMenu = (options = {}) => {
    setMenuState(false, options);
  };

  const animateHeight = (element, expand, button) => {
    let state = expandState.get(element);

    if (!state) {
      state = { isAnimating: false };
      expandState.set(element, state);
    }

    if (state.isAnimating) return;

    state.isAnimating = true;

    if (reduceMotion) {
      element.classList.toggle("hidden", !expand);
      element.classList.toggle("show", expand);
      element.classList.remove("is-expanding", "is-collapsing");
      element.style.height = "";
      element.style.opacity = "";
      element.style.overflow = "";

      if (button) {
        button.textContent = expand ? "Show Less" : "Read More";
        button.setAttribute("aria-expanded", String(expand));
      }

      state.isAnimating = false;
      return;
    }

    element.style.overflow = "hidden";

    if (expand) {
      element.classList.remove("hidden");
      element.classList.add("is-expanding");
      element.style.height = "0px";
      element.style.opacity = "1";

      requestAnimationFrame(() => {
        element.style.height = `${element.scrollHeight}px`;
      });

      const onExpandEnd = (event) => {
        if (event.target !== element || event.propertyName !== "height") return;

        element.classList.remove("is-expanding");
        element.classList.add("show");
        element.style.height = "";
        element.style.opacity = "";
        element.style.overflow = "";

        if (button) {
          button.textContent = "Show Less";
          button.setAttribute("aria-expanded", "true");
        }

        state.isAnimating = false;
      };

      element.addEventListener("transitionend", onExpandEnd, { once: true });
      return;
    }

    element.classList.remove("is-expanding");
    element.classList.add("is-collapsing");
    element.style.height = `${element.scrollHeight}px`;
    element.style.opacity = "1";

    requestAnimationFrame(() => {
      element.style.height = "0px";
      element.style.opacity = "0";
    });

    const onCollapseEnd = (event) => {
      if (event.target !== element || event.propertyName !== "height") return;

      element.classList.remove("show", "is-collapsing");
      element.classList.add("hidden");
      element.style.height = "";
      element.style.opacity = "";
      element.style.overflow = "";

      if (button) {
        button.textContent = "Read More";
        button.setAttribute("aria-expanded", "false");
      }

      state.isAnimating = false;
    };

    element.addEventListener("transitionend", onCollapseEnd, { once: true });
  };

  const bindExpandableContent = () => {
    const buttons = document.querySelectorAll(".read-more-btn");

    buttons.forEach((button) => {
      const card = button.closest(".card");
      if (!card) return;

      const hiddenText = card.querySelector(".toggle-text");
      if (!hiddenText) return;

      const expanded = hiddenText.classList.contains("show");
      button.setAttribute("aria-expanded", String(expanded));

      button.addEventListener("click", (event) => {
        const href = button.getAttribute("href");
        if (href === "#" || hiddenText) {
          event.preventDefault();
        }

        const currentExpanded =
          button.getAttribute("aria-expanded") === "true";

        animateHeight(hiddenText, !currentExpanded, button);
      });
    });
  };

  const setRevealDelays = (revealItems) => {
    revealItems.forEach((item, index) => {
      if (reduceMotion) {
        item.style.transitionDelay = "0ms";
        return;
      }

      let delay = (index % 5) * 70;

      if (currentPage === "blog") {
        const allMainCards = Array.from(document.querySelectorAll("main .card"));
        const card = item.closest(".card");
        const cardIndex = allMainCards.indexOf(card);

        if (cardIndex !== -1) {
          delay = cardIndex * 80;
        }
      }

      item.style.transitionDelay = `${delay}ms`;
    });
  };

  const bindRevealAnimations = () => {
    const revealItems = document.querySelectorAll(".fade-in, .fade-up");

    if (!revealItems.length) return;

    setRevealDelays(revealItems);

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => {
        item.classList.add("show");
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  };

  const bindBlogEnhancements = () => {
    if (currentPage !== "blog" || reduceMotion) return;

    const storyArticles = document.querySelectorAll(
      "#story-collection ~ .card article"
    );

    storyArticles.forEach((story) => {
      const storyCard = story.closest(".card");
      if (!storyCard) return;

      storyCard.addEventListener("mouseenter", () => {
        storyCard.classList.add("is-hovered");
      });

      storyCard.addEventListener("mouseleave", () => {
        storyCard.classList.remove("is-hovered");
      });

      storyCard.addEventListener("focusin", () => {
        storyCard.classList.add("is-hovered");
      });

      storyCard.addEventListener("focusout", () => {
        if (!storyCard.contains(document.activeElement)) {
          storyCard.classList.remove("is-hovered");
        }
      });
    });
  };

  applySavedTheme();
  setActiveNavLink();
  bindExpandableContent();
  bindRevealAnimations();
  bindBlogEnhancements();
  updateHeaderState();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = !body.classList.contains("dark-mode");
      body.classList.toggle("dark-mode", isDark);
      setStoredTheme(isDark ? "dark" : "light");
      syncThemeButtonLabel();
    });
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu({ restoreFocus: true });
      } else {
        setMenuState(true, { moveFocus: isMobileViewport() });
      }
    });
  }

  if (moreToggle && navMore && moreMenu) {
    moreToggle.addEventListener("click", (event) => {
      event.preventDefault();

      const isOpen = moreToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMoreMenu({ restoreFocus: true });
      } else {
        setMoreMenuState(true, { moveFocus: true });
      }
    });
  }

  if (siteNav) {
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (isMobileViewport()) {
          closeMenu();
        } else {
          closeMoreMenu();
        }
      });
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (
      navMore &&
      moreToggle &&
      moreMenu &&
      target instanceof Node &&
      !navMore.contains(target)
    ) {
      closeMoreMenu();
    }

    if (
      isMobileViewport() &&
      siteNav &&
      menuToggle &&
      target instanceof Node &&
      !siteNav.contains(target) &&
      !menuToggle.contains(target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const moreOpen =
      moreToggle && moreToggle.getAttribute("aria-expanded") === "true";
    const menuOpen =
      menuToggle && menuToggle.getAttribute("aria-expanded") === "true";

    if (moreOpen) {
      closeMoreMenu({ restoreFocus: true });
      event.stopPropagation();
      return;
    }

    if (menuOpen) {
      closeMenu({ restoreFocus: true });
    }
  });

  if (typeof reduceMotionQuery.addEventListener === "function") {
    reduceMotionQuery.addEventListener("change", (event) => {
      reduceMotion = event.matches;
    });
  } else if (typeof reduceMotionQuery.addListener === "function") {
    reduceMotionQuery.addListener((event) => {
      reduceMotion = event.matches;
    });
  }

  const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemThemeChange = (event) => {
    const savedTheme = getStoredTheme();
    if (savedTheme === "dark" || savedTheme === "light") return;
    applyTheme(event.matches ? "dark" : "light");
  };

  if (typeof colorSchemeQuery.addEventListener === "function") {
    colorSchemeQuery.addEventListener("change", handleSystemThemeChange);
  } else if (typeof colorSchemeQuery.addListener === "function") {
    colorSchemeQuery.addListener(handleSystemThemeChange);
  }

  window.addEventListener(
    "scroll",
    () => {
      updateHeaderState();
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    updateHeaderState();

    if (!isMobileViewport()) {
      body.classList.remove("menu-open");

      if (siteNav) {
        siteNav.classList.remove("is-open");
      }

      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
      }
    }

    closeMoreMenu();
  });
});
