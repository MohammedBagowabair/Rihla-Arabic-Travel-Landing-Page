(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    document.querySelectorAll("animateMotion").forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
  }
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

  var places = {
    kl: ["كوالالمبور", "أبراج، حدائق، وأسواق يمكن جمعها في يوم هادئ.", "img/klcc-520.webp", "img/klcc-520.webp 520w, img/klcc-960.webp 960w", "حديقة وأبراج في كوالالمبور.", "https://wa.me/967783964784?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%AA%D8%AE%D8%B7%D9%8A%D8%B7%20%D9%84%D8%B2%D9%8A%D8%A7%D8%B1%D8%A9%20%D9%83%D9%88%D8%A7%D9%84%D8%A7%D9%84%D9%85%D8%A8%D9%88%D8%B1."],
    lang: ["لنكاوي", "بحر وجزر وتلفريك، مناسبة لمن يريد إيقاعًا أبطأ.", "img/langkawi-520.webp", "img/langkawi-520.webp 520w, img/langkawi-960.webp 960w", "ساحل لنكاوي من الجو.", "https://wa.me/967783964784?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%AA%D8%AE%D8%B7%D9%8A%D8%B7%20%D9%84%D8%B2%D9%8A%D8%A7%D8%B1%D8%A9%20%D9%84%D9%86%D9%83%D8%A7%D9%88%D9%8A."],
    penang: ["بينانغ", "جورج تاون للمشي: جداريات، مقاهٍ، ورصيف على الماء.", "img/penang-520.webp", "img/penang-520.webp 520w, img/penang-960.webp 960w", "شارع في جورج تاون.", "https://wa.me/967783964784?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%AA%D8%AE%D8%B7%D9%8A%D8%B7%20%D9%84%D8%B2%D9%8A%D8%A7%D8%B1%D8%A9%20%D8%A8%D9%8A%D9%86%D8%A7%D9%86%D8%BA."],
    genting: ["جنتينغ", "مرتفع أبرد من المدينة، والصعود بالتلفريك.", "img/genting-520.webp", "img/genting-520.webp 520w, img/genting-960.webp 960w", "معبد في مرتفعات جنتينغ.", "https://wa.me/967783964784?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%AA%D8%AE%D8%B7%D9%8A%D8%B7%20%D9%84%D8%B2%D9%8A%D8%A7%D8%B1%D8%A9%20%D8%AC%D9%86%D8%AA%D9%8A%D9%86%D8%BA."],
    cameron: ["كاميرون", "تلال شاي وخضرة، وتحتاج طبقة دافئة.", "img/cameron-520.webp", "img/cameron-520.webp 520w, img/cameron-960.webp 960w", "تلال الشاي في كاميرون.", "https://wa.me/967783964784?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%AA%D8%AE%D8%B7%D9%8A%D8%B7%20%D9%84%D8%B2%D9%8A%D8%A7%D8%B1%D8%A9%20%D9%85%D8%B1%D8%AA%D9%81%D8%B9%D8%A7%D8%AA%20%D9%83%D8%A7%D9%85%D9%8A%D8%B1%D9%88%D9%86."],
    malacca: ["ملاكا", "بلدة نهرية قديمة تناسب المشي بعد الظهر.", "img/malacca-480.webp", "img/malacca-480.webp 480w, img/malacca-800.webp 800w", "بيوت على نهر ملاكا.", "https://wa.me/967783964784?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%AA%D8%AE%D8%B7%D9%8A%D8%B7%20%D9%84%D8%B2%D9%8A%D8%A7%D8%B1%D8%A9%20%D9%85%D9%84%D8%A7%D9%83%D8%A7."]
  };
  var mapPhoto = document.getElementById("map-photo");
  var mapName = document.getElementById("map-name");
  var mapText = document.getElementById("map-text");
  var mapWa = document.getElementById("map-wa");
  function showPlace(id) {
    var data = places[id];
    if (!data || !mapPhoto) return;
    mapName.textContent = data[0];
    mapText.textContent = data[1];
    mapPhoto.src = data[2];
    mapPhoto.srcset = data[3];
    mapPhoto.alt = data[4];
    mapWa.href = data[5];
    document.querySelectorAll("[data-pin]").forEach(function (pin) {
      var on = pin.getAttribute("data-pin") === id;
      pin.classList.toggle("is-on", on);
      pin.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  document.querySelectorAll("[data-pin]").forEach(function (pin) {
    pin.addEventListener("click", function () { showPlace(pin.getAttribute("data-pin")); });
    pin.addEventListener("mouseenter", function () { showPlace(pin.getAttribute("data-pin")); });
    pin.addEventListener("focus", function () { showPlace(pin.getAttribute("data-pin")); });
  });

  var moodData = {
    relax: ["٤ أيام · استرخاء", "بحر لنكاوي على مهل", ["الوصول والشاطئ القريب من السكن.", "تلفريك سكاي كاب من غير استعجال.", "جولة جزر قصيرة والعودة قبل العصر.", "صباح حر ثم المغادرة."], "https://wa.me/967783964784?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%B1%D8%AD%D9%84%D8%A9%20%D8%A8%D9%85%D8%B2%D8%A7%D8%AC%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B1%D8%AE%D8%A7%D8%A1."],
    adventure: ["٤ أيام · مغامرة", "مرتفعات ثم بحر", ["صباح في كهوف باتو.", "سكاي واي جنتينغ.", "تلال الشاي في كاميرون.", "تلفريك لنكاوي في اليوم الأخير."], "https://wa.me/967783964784?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%B1%D8%AD%D9%84%D8%A9%20%D8%A8%D9%85%D8%B2%D8%A7%D8%AC%20%D8%A7%D9%84%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A9."],
    family: ["٥ أيام · عائلة", "مدينة ثم مرتفع", ["كوالالمبور بهدوء وحديقة المدينة.", "كهوف باتو بخطوات على مهل.", "جنتينغ نهارًا والعودة مبكرًا.", "بينانغ للمشي القصير.", "يوم حر قبل السفر."], "https://wa.me/967783964784?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%B1%D8%AD%D9%84%D8%A9%20%D8%A8%D9%85%D8%B2%D8%A7%D8%AC%20%D8%A7%D9%84%D8%B9%D8%A7%D8%A6%D9%84%D8%A9."],
    honeymoon: ["٥ أيام · شهر عسل", "لنكاوي لشخصين", ["وصول وشاطئ.", "يوم بحر بلا برنامج مزدحم.", "سكاي كاب عند المساء.", "عشاء هادئ قرب السكن.", "صباح أخير على الرمل."], "https://wa.me/967783964784?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%B1%D8%AD%D9%84%D8%A9%20%D8%A8%D9%85%D8%B2%D8%A7%D8%AC%20%D8%B4%D9%87%D8%B1%20%D8%A7%D9%84%D8%B9%D8%B3%D9%84."],
    shop: ["٣ أيام · تسوق", "كوالالمبور للأسواق", ["وسط المدينة والمجمعات.", "شارع للمشغولات والتذكارات.", "صباح خفيف ثم المغادرة."], "https://wa.me/967783964784?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%B1%D8%AD%D9%84%D8%A9%20%D8%A8%D9%85%D8%B2%D8%A7%D8%AC%20%D8%A7%D9%84%D8%AA%D8%B3%D9%88%D9%82."],
    food: ["٤ أيام · أكل", "بينانغ وملاكا", ["جورج تاون ووجبات الشارع.", "يوم ثانٍ في المقاهي القديمة.", "الانتقال إلى ملاكا.", "مشي على النهر ثم السفر."], "https://wa.me/967783964784?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%B1%D8%AD%D9%84%D8%A9%20%D8%A8%D9%85%D8%B2%D8%A7%D8%AC%20%D8%A7%D9%84%D8%A3%D9%83%D9%84."]
  };
  var moodKicker = document.getElementById("mood-kicker");
  var moodName = document.getElementById("mood-name");
  var moodDays = document.getElementById("mood-days");
  var moodWa = document.getElementById("mood-wa");
  document.querySelectorAll("[data-mood]").forEach(function (tile) {
    tile.addEventListener("click", function () {
      var data = moodData[tile.getAttribute("data-mood")];
      if (!data) return;
      document.querySelectorAll("[data-mood]").forEach(function (other) {
        var on = other === tile;
        other.classList.toggle("is-on", on);
        other.setAttribute("aria-pressed", on ? "true" : "false");
      });
      moodKicker.textContent = data[0];
      moodName.textContent = data[1];
      moodDays.textContent = "";
      data[2].forEach(function (line, index) {
        var li = document.createElement("li");
        var strong = document.createElement("strong");
        strong.textContent = "اليوم " + "١٢٣٤٥".charAt(index) + " ";
        li.appendChild(strong);
        li.appendChild(document.createTextNode(line));
        moodDays.appendChild(li);
      });
      moodWa.href = data[3];
    });
  });

  var revealNodes = document.querySelectorAll(".reveal");
  var routeBox = document.getElementById("route-line");
  if (reduce || !("IntersectionObserver" in window)) {
    revealNodes.forEach(function (node) { node.classList.add("is-in"); });
    if (routeBox) routeBox.classList.add("is-drawn");
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.16 });
    revealNodes.forEach(function (node) { revealObserver.observe(node); });
    if (routeBox) {
      var routeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          routeBox.classList.add("is-drawn");
          routeObserver.disconnect();
        });
      }, { threshold: 0.25 });
      routeObserver.observe(routeBox);
    }
  }
})();
