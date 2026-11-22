(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = document.querySelectorAll("[data-reveal]");

  if (reduce || !("IntersectionObserver" in window)) {
    nodes.forEach(function (node) {
      node.classList.add("is-in");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  var subject = document.querySelector(".hero__subject");
  var wide = window.matchMedia("(min-width: 861px)").matches;
  if (reduce || !subject || !wide) return;

  var frame = 0;
  window.addEventListener(
    "scroll",
    function () {
      if (frame) return;
      frame = window.requestAnimationFrame(function () {
        subject.style.transform = "translate3d(0," + window.scrollY * 0.12 + "px,0)";
        frame = 0;
      });
    },
    { passive: true }
  );
})();
