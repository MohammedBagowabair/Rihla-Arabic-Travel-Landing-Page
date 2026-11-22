(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    nodes.forEach(function (node) { node.classList.add("is-in"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  var planner = document.getElementById("planner");
  if (!planner) return;
  planner.addEventListener("submit", function (event) {
    event.preventDefault();
    var dest = planner.destination.value;
    var month = planner.month.value;
    var people = planner.travellers.value;
    var text = "مرحبًا، أود التخطيط لرحلة إلى " + dest + " في شهر " + month + "، وعدد المسافرين: " + people + ".";
    window.open("https://wa.me/967783964784?text=" + encodeURIComponent(text), "_blank", "noopener");
  });
})();
