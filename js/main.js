/* =========================================================
   Hui Zhong — Academic Homepage · interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Theme (dark / light) ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var stored = null;
  try { stored = localStorage.getItem("hz-theme"); } catch (e) {}

  var prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  var initial = stored || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("hz-theme", next); } catch (e) {}
    });
  }

  /* ---------- Top bar shadow on scroll + back-to-top ---------- */
  var topbar = document.querySelector(".topbar");
  var toTop = document.getElementById("to-top");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (topbar) topbar.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("is-visible", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Active section in side navigation ---------- */
  var navLinks = document.querySelectorAll(".sidenav__link");
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("data-target");
    var sec = document.getElementById(id);
    if (sec) sections.push({ link: link, sec: sec });
  });

  if (sections.length && "IntersectionObserver" in window) {
    var current = null;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          current = entry.target.id;
          sections.forEach(function (s) {
            s.link.classList.toggle("is-active", s.sec.id === current);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s.sec); });
  }

  /* ---------- Publication filter ---------- */
  var filterBtns = document.querySelectorAll(".pub-filter__btn");
  var pubs = document.querySelectorAll(".pub");
  var groups = document.querySelectorAll(".pub-group");

  function applyFilter(type) {
    pubs.forEach(function (p) {
      var match = type === "all" || p.getAttribute("data-type") === type;
      p.classList.toggle("is-hidden", !match);
    });
    // Hide a group heading + list if it has no visible items
    groups.forEach(function (g) {
      var list = g.nextElementSibling;
      if (!list || !list.classList.contains("pub-list")) return;
      var visible = list.querySelectorAll(".pub:not(.is-hidden)").length;
      g.style.display = visible ? "" : "none";
      list.style.display = visible ? "" : "none";
    });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      applyFilter(btn.getAttribute("data-filter"));
    });
  });
})();
