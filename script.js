/* ============================================
   RINGSEND TECH CENTRE — script.js
   Features:
   - EmailJS business notifications
   - Customer auto-reply emails
   - Dynamic WhatsApp links
   - Navbar effects
   - Reveal animations
   - FAQ accordion
   - Product filters
============================================ */

/* ============================================================
   EMAILJS CONFIG
   ============================================================ */

/*
HOW TO SETUP:

1. Create EmailJS account:
   https://www.emailjs.com/

2. Create Email Service
   → Connect ringsendmobiles@gmail.com

3. Create TWO templates:

   TEMPLATE 1 = Business notification
   TEMPLATE 2 = Customer auto-reply

4. Replace IDs below with your real IDs
*/

const EMAILJS_SERVICE_ID = "service_lgy6uh9";
const EMAILJS_TEMPLATE_ID = "template_tpdkya5";
const EMAILJS_AUTOREPLY_TEMPLATE_ID = "template_uv2tkv8";

/* ============================================================
   WHATSAPP NUMBER
   ============================================================ */

const WA_NUMBER = "353852022335";

/* ============================================================
   DYNAMIC WHATSAPP LINK
   ============================================================ */

function buildWALink() {
  const name = document.getElementById("fname")?.value.trim() || "";
  const phone = document.getElementById("fphone")?.value.trim() || "";
  const service = document.getElementById("fservice")?.value || "";
  const message = document.getElementById("fmsg")?.value.trim() || "";

  let text =
    "Hi Ringsend Tech Centre 👋 I found your website and I'd like to get in touch.";

  if (name) text += `\n\n*Name:* ${name}`;
  if (phone) text += `\n*My Number:* ${phone}`;
  if (service) text += `\n*Service:* ${service}`;
  if (message) text += `\n*Details:* ${message}`;

  text += "\n\nCould you please help? 🙏";

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

function syncWALinks() {
  const link = buildWALink();

  document
    .querySelectorAll(".fab-whatsapp, .wa-form-btn, [data-wa]")
    .forEach((el) => {
      el.href = link;
    });
}

["fname", "fphone", "fservice", "fmsg"].forEach((id) => {
  const el = document.getElementById(id);

  if (el) {
    el.addEventListener("input", syncWALinks);
  }
});

document.addEventListener("DOMContentLoaded", syncWALinks);

/* ============================================================
   EMAILJS FORM SUBMISSION
   ============================================================ */

const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");
const formError = document.getElementById("formError");
const submitBtn = document.getElementById("submitBtn");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("fname").value.trim();
    const phone = document.getElementById("fphone").value.trim();
    const email = document.getElementById("femail").value.trim();
    const message = document.getElementById("fmsg").value.trim();

    if (!name || !phone || !email || !message) {
      alert("Please fill in your Name, Phone, Email and Message.");
      return;
    }

    // Loading State
    submitBtn.querySelector(".btn-text").style.display = "none";
    submitBtn.querySelector(".btn-spinner").style.display = "inline";
    submitBtn.disabled = true;

    formSuccess.style.display = "none";
    formError.style.display = "none";

    const templateParams = {
      from_name: name,
      from_email: email,
      from_phone: phone,
      service:
        document.getElementById("fservice").value || "Not specified",
      message: message,
      reply_to: email,
    };

    try {

      // =========================================
      // SEND EMAIL TO BUSINESS
      // =========================================

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      // =========================================
      // SEND AUTO-REPLY TO CUSTOMER
      // =========================================

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_AUTOREPLY_TEMPLATE_ID,
        templateParams
      );

      // =========================================
      // SUCCESS
      // =========================================

      formSuccess.style.display = "block";

      contactForm.reset();

      syncWALinks();

      setTimeout(() => {
        formSuccess.style.display = "none";
      }, 8000);

    } catch (err) {

      console.error("EmailJS error:", err);

      formError.style.display = "block";

      setTimeout(() => {
        formError.style.display = "none";
      }, 8000);

    } finally {

      submitBtn.querySelector(".btn-text").style.display = "inline";

      submitBtn.querySelector(".btn-spinner").style.display = "none";

      submitBtn.disabled = false;
    }
  });
}

/* ============================================================
   NAVBAR SCROLL EFFECT
   ============================================================ */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);

  highlightActiveNav();
});

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id], .hero[id]");

function highlightActiveNav() {
  let current = "";

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`
    );
  });
}

/* ============================================================
   HAMBURGER MENU
   ============================================================ */

const hamburger = document.getElementById("hamburger");
const navLinksEl = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinksEl.classList.toggle("open");
});

navLinksEl.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinksEl.classList.remove("open");
  });
});

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */

const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll(".reveal")
      );

      entry.target.style.transitionDelay = `${
        Math.min(siblings.indexOf(entry.target) * 80, 400)
      }ms`;

      entry.target.classList.add("visible");

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
  }
);

revealEls.forEach((el) => revealObserver.observe(el));

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    setTimeout(() => {
      el.style.transitionDelay = "0ms";
      el.classList.add("visible");
    }, 200 + i * 150);
  });
});

/* ============================================================
   PRODUCT FILTER
   ============================================================ */

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".filter-btn").forEach((b) => {
      b.classList.remove("active");
    });

    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    document.querySelectorAll(".product-card").forEach((card) => {

      const show =
        filter === "all" ||
        card.getAttribute("data-cat") === filter;

      card.classList.toggle("hidden", !show);

      if (show) {
        card.classList.remove("visible");

        setTimeout(() => {
          card.classList.add("visible");
        }, 50);
      }
    });
  });
});

/* ============================================================
   FAQ ACCORDION
   ============================================================ */

document.querySelectorAll(".faq-item").forEach((item) => {

  item.querySelector(".faq-q").addEventListener("click", () => {

    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((faq) => {
      faq.classList.remove("open");

      faq
        .querySelector(".faq-q")
        .setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");

      item
        .querySelector(".faq-q")
        .setAttribute("aria-expanded", "true");
    }
  });
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {

  anchor.addEventListener("click", (e) => {

    const target = document.querySelector(
      anchor.getAttribute("href")
    );

    if (!target) return;

    e.preventDefault();

    window.scrollTo({
      top:
        target.getBoundingClientRect().top +
        window.scrollY -
        68,
      behavior: "smooth",
    });
  });
});

/* ============================================================
   ENQUIRE BUTTONS
   ============================================================ */

document.querySelectorAll(".btn-enquire").forEach((btn) => {

  btn.addEventListener("click", (e) => {

    e.preventDefault();

    const serviceSelect =
      document.getElementById("fservice");

    if (serviceSelect) {
      serviceSelect.value = "Buy a Phone";
    }

    const contact = document.getElementById("contact");

    if (contact) {

      window.scrollTo({
        top:
          contact.getBoundingClientRect().top +
          window.scrollY -
          68,
        behavior: "smooth",
      });

      setTimeout(() => {
        document.getElementById("fname")?.focus();
      }, 600);
    }
  });
});
