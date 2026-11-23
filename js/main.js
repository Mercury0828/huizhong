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

  /* ---------- Page router: one page per top-bar tab ---------- */
  var pages = document.querySelectorAll(".page");
  var tabLinks = document.querySelectorAll(".topbar__nav a[data-nav]");
  var mainEl = document.querySelector(".main");
  var DEFAULT_PAGE = "biography";
  // Old single-page anchors -> [page, section to scroll to]
  var LEGACY = {
    top: ["biography"], about: ["biography"], news: ["biography", "news"],
    education: ["biography", "education"], publications: ["research", "publications"],
    honors: ["service"], outside: ["contact", "outside"]
  };

  function resolve(hash) {
    var key = (hash || "").replace(/^#/, "");
    if (document.getElementById("page-" + key)) return [key];
    if (LEGACY[key]) return LEGACY[key];
    return [DEFAULT_PAGE];
  }

  function showPage(hash, isInitial) {
    var target = resolve(hash);
    var pageId = target[0];
    pages.forEach(function (p) {
      var on = p.getAttribute("data-page") === pageId;
      p.hidden = !on;
      if (on) {
        p.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
      }
    });
    tabLinks.forEach(function (a) {
      var on = a.getAttribute("data-nav") === pageId;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      if (on && a.scrollIntoView && window.innerWidth <= 920) {
        a.scrollIntoView({ block: "nearest", inline: "center" });
      }
    });
    var label = document.querySelector('.topbar__nav a[data-nav="' + pageId + '"]');
    document.title = (pageId === DEFAULT_PAGE || !label ? "" : label.textContent + " · ") +
      "Hui Zhong · Quantum Computing Systems, Privacy & Optimization";

    var sec = target[1] && document.getElementById(target[1]);
    if (sec) {
      sec.scrollIntoView();
    } else if (!isInitial) {
      // On narrow screens the profile card sits above the content: jump to the content.
      var y = window.innerWidth <= 920 && mainEl ? mainEl.getBoundingClientRect().top + window.scrollY - 60 : 0;
      window.scrollTo(0, Math.max(0, y));
    }
  }

  if (pages.length) {
    window.addEventListener("hashchange", function () { showPage(location.hash, false); });
    showPage(location.hash, true);
  }

  /* ---------- News: show the latest five, expand for the rest ---------- */
  var NEWS_VISIBLE = 5;
  var newsItems = document.querySelectorAll("#news-list .news__item");
  var newsBtn = document.getElementById("news-more");
  if (newsBtn && newsItems.length > NEWS_VISIBLE) {
    var hiddenCount = newsItems.length - NEWS_VISIBLE;
    var setNews = function (expanded) {
      newsItems.forEach(function (li, i) {
        li.classList.toggle("is-collapsed", !expanded && i >= NEWS_VISIBLE);
      });
      newsBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
      newsBtn.textContent = expanded ? "Show less ▴" : "Show " + hiddenCount + " more ▾";
    };
    newsBtn.hidden = false;
    setNews(false);
    newsBtn.addEventListener("click", function () {
      setNews(newsBtn.getAttribute("aria-expanded") !== "true");
    });
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
