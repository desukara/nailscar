document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.getElementById("siteNav");
  const moreToggle = document.querySelector(".more-toggle");
  const navMore = document.querySelector(".nav-more");
  const currentPage = body.dataset.page || "";
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const STORAGE_KEY = "nailscar-theme";

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

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  if (pageClassMap[currentPage]) {
    body.classList.add(pageClassMap[currentPage]);
  }

  const closeMoreMenu = () => {
    if (!navMore || !moreToggle) return;
    navMore.classList.remove("is-open");
    moreToggle.setAttribute("aria-expanded", "false");
  };

  const closeMenu = () => {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    body.classList.remove("menu-open");
    closeMoreMenu();
  };

  const syncThemeButtonLabel = () => {
    if (!themeToggle) return;

    const isDark = body.classList.contains("dark-mode");
    const iconSpan = themeToggle.querySelector("span");

    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    if (iconSpan) {
      iconSpan.textContent = isDark ? "☀" : "☾";
    }
  };

  const applySavedTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }

    syncThemeButtonLabel();
  };

  const setActiveNavLink = () => {
    const navLinks = document.querySelectorAll(".site-nav a");
    const activeHref = pageHrefMap[currentPage];

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

  const getPageMoodColors = () => {
    const isDark = body.classList.contains("dark-mode");

    const palettes = {
      default: isDark
        ? {
            glowA: "rgba(208, 154, 117, 0.22)",
            glowB: "rgba(255, 230, 205, 0.08)",
            glowC: "rgba(120, 82, 60, 0.14)",
            gradient:
              "linear-gradient(180deg, #201915 0%, #18120f 42%, #15100d 72%, #1d1713 100%)",
          }
        : {
            glowA: "rgba(244, 208, 183, 0.34)",
            glowB: "rgba(229, 188, 160, 0.26)",
            glowC: "rgba(183, 145, 117, 0.14)",
            gradient:
              "linear-gradient(180deg, #fbf7f3 0%, #f6efe7 36%, #f3ece4 68%, #f7f1eb 100%)",
          },

      legalism: isDark
        ? {
            glowA: "rgba(166, 116, 92, 0.18)",
            glowB: "rgba(104, 73, 64, 0.12)",
            glowC: "rgba(208, 154, 117, 0.08)",
            gradient:
              "linear-gradient(180deg, #1d1714 0%, #171210 42%, #140f0d 72%, #191412 100%)",
          }
        : {
            glowA: "rgba(215, 184, 167, 0.28)",
            glowB: "rgba(191, 161, 148, 0.2)",
            glowC: "rgba(172, 140, 123, 0.12)",
            gradient:
              "linear-gradient(180deg, #faf6f3 0%, #f4ede8 36%, #efe7e1 68%, #f6f0ea 100%)",
          },

      healing: isDark
        ? {
            glowA: "rgba(222, 171, 131, 0.24)",
            glowB: "rgba(255, 238, 219, 0.1)",
            glowC: "rgba(160, 115, 87, 0.12)",
            gradient:
              "linear-gradient(180deg, #201915 0%, #18120f 42%, #15110d 72%, #1e1712 100%)",
          }
        : {
            glowA: "rgba(244, 214, 184, 0.36)",
            glowB: "rgba(234, 197, 171, 0.24)",
            glowC: "rgba(195, 159, 129, 0.14)",
            gradient:
              "linear-gradient(180deg, #fcf8f3 0%, #f7f0e8 36%, #f4ece3 68%, #f8f2eb 100%)",
          },

      stories: isDark
        ? {
            glowA: "rgba(190, 142, 116, 0.22)",
            glowB: "rgba(255, 231, 214, 0.08)",
            glowC: "rgba(116, 84, 71, 0.12)",
            gradient:
              "linear-gradient(180deg, #1f1815 0%, #18120f 42%, #15100d 72%, #1d1714 100%)",
          }
        : {
            glowA: "rgba(237, 206, 186, 0.34)",
            glowB: "rgba(226, 190, 170, 0.24)",
            glowC: "rgba(183, 149, 129, 0.12)",
            gradient:
              "linear-gradient(180deg, #fbf7f4 0%, #f6efe8 36%, #f3ebe4 68%, #f7f1eb 100%)",
          },

      blog: isDark
        ? {
            glowA: "rgba(214, 160, 126, 0.24)",
            glowB: "rgba(255, 238, 225, 0.09)",
            glowC: "rgba(132, 95, 74, 0.12)",
            gradient:
              "linear-gradient(180deg, #201915 0%, #18120f 42%, #15100d 72%, #1d1713 100%)",
          }
        : {
            glowA: "rgba(243, 211, 189, 0.36)",
            glowB: "rgba(233, 193, 166, 0.26)",
            glowC: "rgba(184, 146, 118, 0.14)",
            gradient:
              "linear-gradient(180deg, #fbf7f3 0%, #f7f0e8 36%, #f4ece4 68%, #f8f2eb 100%)",
          },
    };

    return palettes[currentPage] || palettes.default;
  };

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

  const updateDynamicBackground = () => {
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const viewportHeight = window.innerHeight;
    const maxScrollable = Math.max(scrollHeight - viewportHeight, 1);
    const scrollRatio = clamp(window.scrollY / maxScrollable, 0, 1);
    const palette = getPageMoodColors();

    const posAX = 12 + scrollRatio * 8;
    const posAY = 16 + scrollRatio * 7;
    const posBX = 86 - scrollRatio * 10;
    const posBY = 14 + scrollRatio * 8;
    const posCY = 110 - scrollRatio * 14;

    body.style.background = `
      radial-gradient(circle at ${posAX}% ${posAY}%, ${palette.glowA}, transparent 24%),
      radial-gradient(circle at ${posBX}% ${posBY}%, ${palette.glowB}, transparent 28%),
      radial-gradient(circle at 50% ${posCY}%, ${palette.glowC}, transparent 40%),
      ${palette.gradient}
    `;
  };

  let ticking = false;

  const runScrollEffects = () => {
    updateHeaderState();
    updateDynamicBackground();
    ticking = false;
  };

  const requestScrollEffects = () => {
    if (ticking) return;

    window.requestAnimationFrame(runScrollEffects);
    ticking = true;
  };

  const animateHeight = (element, expand) => {
    if (reduceMotion) {
      element.classList.toggle("hidden", !expand);
      element.classList.toggle("show", expand);
      element.style.height = "";
      element.style.opacity = "";
      element.style.overflow = "";
      element.style.transition = "";
      return;
    }

    element.style.overflow = "hidden";
    element.style.transition = "height 420ms ease, opacity 320ms ease";

    if (expand) {
      element.classList.remove("hidden");
      element.style.height = "0px";
      element.style.opacity = "0";

      const targetHeight = element.scrollHeight;

      requestAnimationFrame(() => {
        element.style.height = `${targetHeight}px`;
        element.style.opacity = "1";
      });

      const onExpandEnd = (event) => {
        if (event.propertyName !== "height") return;

        element.classList.add("show");
        element.style.height = "auto";
        element.style.overflow = "";
        element.removeEventListener("transitionend", onExpandEnd);
      };

      element.addEventListener("transitionend", onExpandEnd);
      return;
    }

    const currentHeight = element.scrollHeight;
    element.style.height = `${currentHeight}px`;
    element.style.opacity = "1";

    requestAnimationFrame(() => {
      element.style.height = "0px";
      element.style.opacity = "0";
    });

    const onCollapseEnd = (event) => {
      if (event.propertyName !== "height") return;

      element.classList.remove("show");
      element.classList.add("hidden");
      element.style.height = "";
      element.style.opacity = "";
      element.style.overflow = "";
      element.removeEventListener("transitionend", onCollapseEnd);
    };

    element.addEventListener("transitionend", onCollapseEnd);
  };

  const bindExpandableContent = () => {
    const buttons = document.querySelectorAll(".read-more-btn");

    buttons.forEach((button) => {
      const card = button.closest(".card");
      if (!card) return;

      const hiddenText = card.querySelector(".toggle-text");
      if (!hiddenText) return;

      button.addEventListener("click", (event) => {
        event.preventDefault();

        const isHidden =
          hiddenText.classList.contains("hidden") ||
          !hiddenText.classList.contains("show");

        animateHeight(hiddenText, isHidden);
        button.textContent = isHidden ? "Show Less" : "Read More";
        button.setAttribute("aria-expanded", String(isHidden));
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
        const allMainCards = Array.from(
          document.querySelectorAll("main .card")
        );
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

    if (!("IntersectionObserver" in window)) {
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

          const nestedPathCards = entry.target.querySelectorAll(".path-card");
          nestedPathCards.forEach((card, index) => {
            if (reduceMotion) {
              card.style.opacity = "1";
              card.style.transform = "none";
              return;
            }

            card.style.opacity = "0";
            card.style.transform = "translateY(18px)";
            card.style.transition =
              "opacity 560ms ease, transform 560ms ease, box-shadow 220ms ease, border-color 220ms ease";

            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 90 * index);
          });

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
    if (currentPage !== "blog") return;

    const storyArticles = document.querySelectorAll(
      "#story-collection ~ .card article"
    );

    storyArticles.forEach((story) => {
      const storyCard = story.closest(".card");
      if (!storyCard) return;

      story.setAttribute("tabindex", "0");

      if (!reduceMotion) {
        storyCard.style.transition =
          "transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease";
      }

      storyCard.addEventListener("mouseenter", () => {
        if (reduceMotion) return;
        storyCard.style.transform = "translateY(-4px)";
      });

      storyCard.addEventListener("mouseleave", () => {
        storyCard.style.transform = "";
      });

      const quote = story.querySelector("blockquote");
      if (!quote || reduceMotion) return;

      quote.style.transition = "transform 280ms ease, opacity 280ms ease";
      quote.style.opacity = "0.95";

      storyCard.addEventListener("mouseenter", () => {
        quote.style.transform = "translateX(3px)";
        quote.style.opacity = "1";
      });

      storyCard.addEventListener("mouseleave", () => {
        quote.style.transform = "translateX(0)";
        quote.style.opacity = "0.95";
      });
    });

    const submitSection = document.getElementById("submit-story");
    if (!submitSection || reduceMotion) return;

    const emailLinks = submitSection.querySelectorAll('a[href^="mailto:"]');

    emailLinks.forEach((link) => {
      link.style.display = "inline-block";
      link.style.transition = "transform 180ms ease, color 180ms ease";

      link.addEventListener("mouseenter", () => {
        link.style.transform = "translateY(-1px)";
      });

      link.addEventListener("mouseleave", () => {
        link.style.transform = "";
      });
    });
  };

  applySavedTheme();
  setActiveNavLink();
  bindExpandableContent();
  bindRevealAnimations();
  bindBlogEnhancements();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");

      const isDark = body.classList.contains("dark-mode");
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");

      syncThemeButtonLabel();
      updateDynamicBackground();
    });
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );
      body.classList.toggle("menu-open", isOpen);

      if (!isOpen) {
        closeMoreMenu();
      }
    });
  }

  if (moreToggle && navMore) {
    moreToggle.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        const isOpen = navMore.classList.toggle("is-open");
        moreToggle.setAttribute("aria-expanded", String(isOpen));
      }
    });
  }

  if (siteNav) {
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 900) {
          closeMenu();
        }
      });
    });
  }

  document.addEventListener("click", (event) => {
    if (!navMore || !moreToggle) return;
    if (window.innerWidth > 900) return;

    const clickedInsideMore = navMore.contains(event.target);
    if (!clickedInsideMore) {
      closeMoreMenu();
    }
  });

  window.addEventListener("scroll", requestScrollEffects, { passive: true });
  window.addEventListener("resize", () => {
    requestScrollEffects();

    if (window.innerWidth > 900) {
      body.classList.remove("menu-open");
      if (siteNav) {
        siteNav.classList.remove("is-open");
      }
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
      }
      closeMoreMenu();
    }
  });

  requestScrollEffects();
});
