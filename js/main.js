(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA = "https://wa.me/967783964784?text=";
  var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
  var blocks = Array.prototype.slice.call(document.querySelectorAll("[data-block]"));
  var inputs = Array.prototype.slice.call(document.querySelectorAll(".js-q"));
  var empty = document.getElementById("empty");
  var status = document.getElementById("search-status");
  var catButtons = Array.prototype.slice.call(document.querySelectorAll("[data-cat]"));
  var jumpLinks = Array.prototype.slice.call(document.querySelectorAll("[data-jump]"));
  var currentCat = "";
  var scrollTimer = 0;

  function apply() {
    var q = "";
    inputs.some(function (input) {
      if (input.value.trim()) q = input.value.trim();
      return false;
    });
    if (document.activeElement && document.activeElement.classList.contains("js-q")) {
      q = document.activeElement.value.trim();
    }
    var needle = q.toLowerCase();
    cards.forEach(function (card) {
      var hay = (card.getAttribute("data-q") || "").toLowerCase();
      var okCat = !currentCat || card.getAttribute("data-cat") === currentCat;
      var okQ = !needle || hay.indexOf(needle) !== -1;
      card.hidden = !(okCat && okQ);
    });
    blocks.forEach(function (block) {
      block.hidden = !block.querySelector(".card:not([hidden])");
    });
    var count = cards.filter(function (card) { return !card.hidden; }).length;
    if (status) status.textContent = count ? "ظهرت " + count + " أنشطة" : "لا توجد نتائج مطابقة";
    if (empty) empty.hidden = count !== 0;
  }

  function scrollToResults() {
    var target = document.querySelector("[data-block]:not([hidden])") || document.getElementById("activities");
    if (!target) return;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function syncCatUi() {
    catButtons.forEach(function (btn) {
      var on = currentCat !== "" && btn.getAttribute("data-cat") === currentCat;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    jumpLinks.forEach(function (link) {
      link.classList.toggle("is-on", currentCat !== "" && link.getAttribute("data-jump") === currentCat);
    });
  }

  inputs.forEach(function (input) {
    input.addEventListener("input", function () {
      inputs.forEach(function (other) {
        if (other !== input) other.value = input.value;
      });
      apply();
      if (input.value.trim().length < 2) return;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(scrollToResults, 280);
    });
  });

  document.querySelectorAll(".js-find").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var field = form.querySelector(".js-q");
      var q = field ? field.value.trim() : "";
      inputs.forEach(function (el) { el.value = q; });
      apply();
      var first = document.querySelector(".card:not([hidden])");
      if (first) scrollToResults();
      else if (q) window.open(WA + encodeURIComponent("مرحبًا، أبحث عن: " + q), "_blank", "noopener");
    });
  });

  catButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-cat");
      currentCat = currentCat === cat ? "" : cat;
      syncCatUi();
      apply();
      scrollToResults();
    });
  });

  jumpLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      currentCat = link.getAttribute("data-jump");
      syncCatUi();
      apply();
      scrollToResults();
    });
  });

  var favKey = "rihla-favs";
  function readFavs() {
    try { return JSON.parse(localStorage.getItem(favKey) || "[]"); }
    catch (error) { return []; }
  }
  function paintFavs() {
    var favs = readFavs();
    document.querySelectorAll("[data-fav]").forEach(function (btn) {
      var on = favs.indexOf(btn.getAttribute("data-fav")) !== -1;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  document.querySelectorAll("[data-fav]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-fav");
      var favs = readFavs().filter(function (item) { return item !== id; });
      if (!btn.classList.contains("is-on")) favs.push(id);
      localStorage.setItem(favKey, JSON.stringify(favs));
      paintFavs();
    });
  });
  paintFavs();

  document.querySelectorAll("[data-rail]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var rail = document.getElementById(btn.getAttribute("data-rail"));
      if (!rail) return;
      var dir = Number(btn.getAttribute("data-dir")) || 1;
      var amount = Math.round(rail.clientWidth * 0.78) * dir;
      var left = document.documentElement.dir === "rtl" ? -amount : amount;
      rail.scrollBy({ left: left, behavior: reduce ? "auto" : "smooth" });
    });
  });

  var plan = document.getElementById("plan-form");
  var planWa = document.getElementById("plan-wa");
  if (plan && planWa) {
    planWa.addEventListener("click", function () {
      var name = plan.traveler.value.trim() || "مسافر";
      var dest = plan.destination.value.trim() || "ماليزيا";
      var date = plan.date.value || "موعد مرن";
      var people = plan.people.value;
      var text = "مرحبًا، أنا " + name + "، أود ترتيب رحلة إلى " + dest + " بتاريخ " + date + "، وعدد المسافرين: " + people + ".";
      window.open(WA + encodeURIComponent(text), "_blank", "noopener");
    });
  }
})();
