/* ==========================================
   GENESIS PRIMARY SCHOOL — MAIN JS
   ========================================== */

(function () {
  "use strict";

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    const onScroll = () =>
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ── Mobile nav toggle ── */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.classList.toggle("active", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close on any link click
    navMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove("open");
        navToggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Toggle hamburger icon animation
    navToggle.addEventListener("click", () => {
      const spans = navToggle.querySelectorAll("span");
      if (navToggle.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
      } else {
        spans.forEach((s) => {
          s.style.transform = "";
          s.style.opacity = "";
        });
      }
    });
  }

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ── Gallery Filter ── */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.dataset.cat;
      galleryItems.forEach((item) => {
        if (cat === "all" || item.dataset.cat === cat) {
          item.style.display = "";
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "";
          }, 10);
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(.92)";
          setTimeout(() => {
            item.style.display = "none";
          }, 350);
        }
      });
    });
  });

  /* ── Lightbox ── */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCaption = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  if (lightbox && galleryItems.length) {
    let currentIdx = 0;
    const items = Array.from(galleryItems).filter(
      (i) => i.style.display !== "none",
    );

    function openLightbox(idx) {
      const visible = Array.from(galleryItems).filter(
        (i) => i.offsetParent !== null,
      );
      currentIdx = idx;
      const item = visible[idx];
      const img = item.querySelector("img");
      const cap = item.dataset.caption || "";
      lbImg.src = img ? img.src : "";
      lbImg.alt = img ? img.alt : "";
      lbCaption.textContent = "";
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    function navigate(dir) {
      const visible = Array.from(galleryItems).filter(
        (i) => i.offsetParent !== null,
      );
      currentIdx = (currentIdx + dir + visible.length) % visible.length;
      const item = visible[currentIdx];
      const img = item.querySelector("img");
      lbImg.style.opacity = "0";
      setTimeout(() => {
        lbImg.src = img ? img.src : "";
        lbImg.alt = img ? img.alt : "";
        lbCaption.textContent = "";
        lbImg.style.opacity = "1";
      }, 200);
    }

    galleryItems.forEach((item, idx) => {
      item.addEventListener("click", () => openLightbox(idx));
    });

    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", () => navigate(-1));
    lbNext.addEventListener("click", () => navigate(1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    });
  }

  /* ── Contact Form ── */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("#name").value.trim();
      const email = form.querySelector("#email").value.trim();
      const subject = form.querySelector("#subject").value;
      const message = form.querySelector("#message").value.trim();

      if (!name || !email || !subject || !message) {
        showNotification("Please fill in all required fields.", "error");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification("Please enter a valid email address.", "error");
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = "Sending…";
      btn.disabled = true;

      setTimeout(() => {
        showNotification(
          `Thank you! Your message has been received. We'll be in touch soon.', 'success`,
        );
        form.reset();
        btn.textContent = "Send Message";
        btn.disabled = false;
      }, 1200);
    });
  }

  function showNotification(msg, type) {
    const existing = document.querySelector(".form-notification");
    if (existing) existing.remove();

    const div = document.createElement("div");
    div.className = "form-notification";
    div.style.cssText = `
      position: fixed; bottom: 2rem; right: 2rem;
      background: ${type === "success" ? "#2d9142" : "#c75b38"};
      color: white; padding: 1rem 1.5rem;
      border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,.2);
      font-family: 'DM Sans', sans-serif; font-size: .95rem;
      z-index: 9999; max-width: 360px; line-height: 1.5;
      animation: slideNotif .3s ease;
    `;
    div.textContent = msg;
    document.body.appendChild(div);

    const style = document.createElement("style");
    style.textContent = `@keyframes slideNotif { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }`;
    document.head.appendChild(style);

    setTimeout(() => {
      div.style.opacity = "0";
      div.style.transition = "opacity .4s";
      setTimeout(() => div.remove(), 400);
    }, 5000);
  }

  /* ── Smooth scroll for hash links ── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
