/* ==========================================================================
   Elaria Basher — Portfolio
   Vanilla JS: navigation, reveals, counters, filters, form, theme, extras
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initPhotoFallback();
  initHeaderScroll();
  initMobileNav();
  initActiveNavLink();
  initScrollProgress();
  initScrollReveal();
  initStatCounters();
  initSkillFilters();
  initProjectFilters();
  initLoadMore();
  initContactForm();
  initBackToTop();
  initTypingRole();
  initHeroCanvas();
  initFooterYear();
  initEasterEgg();
  initDownloadCv();
});

/* --------------------------------------------------------------------------
   Theme toggle (persisted with localStorage)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  const stored = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");

  applyTheme(initial);

  toggle.addEventListener("click", () => {
    const current =
      root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("portfolio-theme", next);
  });

  function applyTheme(mode) {
    if (mode === "dark") {
      root.setAttribute("data-theme", "dark");
      toggle.setAttribute("aria-pressed", "true");
    } else {
      root.removeAttribute("data-theme");
      toggle.setAttribute("aria-pressed", "false");
    }
  }
}

/* --------------------------------------------------------------------------
   Fall back to initials if the profile photo file is missing
   -------------------------------------------------------------------------- */
function initPhotoFallback() {
  const pairs = [
    ["heroPhoto", "photoInitials"],
    ["aboutPhoto", "aboutPhotoInitials"],
  ];

  pairs.forEach(([imgId, fallbackId]) => {
    const img = document.getElementById(imgId);
    const fallback = document.getElementById(fallbackId);
    if (!img || !fallback) return;

    img.addEventListener("error", () => {
      img.hidden = true;
      fallback.hidden = false;
    });
  });
}

/* --------------------------------------------------------------------------
   Sticky header background on scroll
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  const toggleClass = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  toggleClass();
  window.addEventListener("scroll", toggleClass, { passive: true });
}

/* --------------------------------------------------------------------------
   Mobile hamburger menu
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    hamburger.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

/* --------------------------------------------------------------------------
   Highlight the nav link for the section currently in view
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        links.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${id}`,
          );
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   Thin scroll progress bar at the top of the page
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${percent}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

/* --------------------------------------------------------------------------
   Reveal elements as they scroll into view
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  items.forEach((item) => observer.observe(item));
}

/* --------------------------------------------------------------------------
   Animated stat counters, triggered once when visible
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const grid = document.getElementById("statsGrid");
  if (!grid) return;

  const numbers = grid.querySelectorAll(".stat-number");
  let hasRun = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          numbers.forEach(animateCount);
        }
      });
    },
    { threshold: 0.4 },
  );

  observer.observe(grid);

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }
}

/* --------------------------------------------------------------------------
   Skills category filtering
   -------------------------------------------------------------------------- */
function initSkillFilters() {
  const bar = document.getElementById("skillFilters");
  const grid = document.getElementById("skillsGrid");
  if (!bar || !grid) return;

  const buttons = bar.querySelectorAll(".filter-btn");
  const badges = grid.querySelectorAll(".skill-badge");

  bar.addEventListener("click", (event) => {
    const btn = event.target.closest(".filter-btn");
    if (!btn) return;

    buttons.forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", String(b === btn));
    });

    const filter = btn.dataset.filter;
    badges.forEach((badge) => {
      const categories = badge.dataset.category.split(" ");
      const show = filter === "all" || categories.includes(filter);
      badge.classList.toggle("is-hidden", !show);
    });
  });
}

/* --------------------------------------------------------------------------
   Project category filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const bar = document.getElementById("projectFilters");
  const grid = document.getElementById("projectsGrid");
  if (!bar || !grid) return;

  const buttons = bar.querySelectorAll(".filter-btn");

  bar.addEventListener("click", (event) => {
    const btn = event.target.closest(".filter-btn");
    if (!btn) return;

    buttons.forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", String(b === btn));
    });

    const filter = btn.dataset.filter;
    grid.querySelectorAll(".project-card").forEach((card) => {
      // Respect cards not yet revealed by "Load more"
      if (
        card.classList.contains("is-extra") &&
        !card.classList.contains("is-loaded")
      ) {
        return;
      }
      const matches = filter === "all" || card.dataset.category === filter;
      card.hidden = !matches;
    });
  });
}

/* --------------------------------------------------------------------------
   Reveal additional projects on demand
   -------------------------------------------------------------------------- */
function initLoadMore() {
  const button = document.getElementById("loadMoreBtn");
  if (!button) return;

  button.addEventListener("click", () => {
    const extras = document.querySelectorAll(".project-card.is-extra");
    extras.forEach((card) => {
      card.classList.add("is-loaded");
      card.hidden = false;
      card.classList.remove("is-visible");
      requestAnimationFrame(() => card.classList.add("is-visible"));
    });
    button.hidden = true;
  });
}

/* --------------------------------------------------------------------------
   Contact form: client-side validation + fake submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = document.getElementById("formStatus");
  const fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("nameError"),
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("emailError"),
    },
    subject: {
      input: document.getElementById("subject"),
      error: document.getElementById("subjectError"),
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("messageError"),
    },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    let isValid = true;

    isValid =
      validateField(
        "name",
        fields.name.input.value.trim().length > 0,
        "Please enter your name.",
      ) && isValid;
    isValid =
      validateField(
        "email",
        emailPattern.test(fields.email.input.value.trim()),
        "Please enter a valid email address.",
      ) && isValid;
    isValid =
      validateField(
        "subject",
        fields.subject.input.value.trim().length > 0,
        "Please enter a subject.",
      ) && isValid;
    isValid =
      validateField(
        "message",
        fields.message.input.value.trim().length >= 20,
        "Message should be at least 20 characters.",
      ) && isValid;

    if (!isValid) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("is-error");
      return;
    }

    // No backend is connected — simulate a submission for demo purposes.
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    status.textContent = "Sending...";

    setTimeout(() => {
      submitBtn.disabled = false;
      status.textContent =
        "Thanks — your message has been sent. I'll get back to you soon.";
      status.classList.add("is-success");
      form.reset();
    }, 900);
  });

  function validateField(key, condition, message) {
    const { input, error } = fields[key];
    const row = input.closest(".form-row");
    if (condition) {
      row.classList.remove("has-error");
      error.textContent = "";
      return true;
    }
    row.classList.add("has-error");
    error.textContent = message;
    return false;
  }
}

/* --------------------------------------------------------------------------
   Back-to-top button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  window.addEventListener(
    "scroll",
    () => {
      button.hidden = window.scrollY < 500;
    },
    { passive: true },
  );

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* --------------------------------------------------------------------------
   Hero typing animation, rotating through roles
   -------------------------------------------------------------------------- */
function initTypingRole() {
  const el = document.getElementById("typedRole");
  if (!el) return;

  const roles = [
    "web applications",
    "mobile apps with Flutter",
    "automated test suites",
  ];
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = false;

  const TYPE_SPEED = 55;
  const DELETE_SPEED = 30;
  const PAUSE = 1400;

  function tick() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(tick, isDeleting ? DELETE_SPEED : TYPE_SPEED);
  }

  setTimeout(tick, PAUSE);
}

/* --------------------------------------------------------------------------
   Subtle animated hero background — a soft, drifting particle field
   -------------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas || !canvas.getContext) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  let width, height, particles;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    const count = Math.max(18, Math.floor((width * height) / 60000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    ctx.fillStyle = isDark
      ? "rgba(124, 134, 255, 0.5)"
      : "rgba(74, 85, 224, 0.35)";

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);
}

/* --------------------------------------------------------------------------
   Footer year
   -------------------------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
   Hidden developer easter egg — Konami-style key sequence
   -------------------------------------------------------------------------- */
function initEasterEgg() {
  const egg = document.getElementById("easterEgg");
  if (!egg) return;

  const sequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let position = 0;

  window.addEventListener("keydown", (event) => {
    const expected = sequence[position];
    if (event.key === expected) {
      position++;
      if (position === sequence.length) {
        position = 0;
        egg.hidden = false;
        setTimeout(() => {
          egg.hidden = true;
        }, 4000);
      }
    } else {
      position = event.key === sequence[0] ? 1 : 0;
    }
  });
}

/* --------------------------------------------------------------------------
   Download CV placeholder — swap the href once a CV file is added
   -------------------------------------------------------------------------- */
function initDownloadCv() {
  const link = document.getElementById("downloadCv");
  if (!link) return;

  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") === "#") {
      event.preventDefault();
      alert(
        "Add your CV file and update the Download CV link's href to enable this button.",
      );
    }
  });
}
