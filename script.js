document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }

  const readMoreButtons = document.querySelectorAll(".read-more-btn");

  readMoreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      if (!card) return;

      const hiddenText = card.querySelector(".toggle-text");
      if (!hiddenText) return;

      hiddenText.classList.toggle("hidden");
      button.textContent = hiddenText.classList.contains("hidden")
        ? "Read More"
        : "Show Less";
    });
  });

  const currentPage = document.body.dataset.page;
  const navLinks = document.querySelectorAll(".site-nav a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (
      (currentPage === "home" && href === "index.html") ||
      (currentPage === "about" && href === "about.html") ||
      (currentPage === "resources" && href === "resources.html") ||
      (currentPage === "contact" && href === "contact.html") ||
      (currentPage === "legalism" && href === "legalism.html") ||
      (currentPage === "healing" && href === "healing.html") ||
      (currentPage === "stories" && href === "stories.html") ||
      (currentPage === "faq" && href === "faq.html")
    ) {
      link.classList.add("active");
    }
  });
});
