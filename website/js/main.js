// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Nav background on scroll
const nav = document.getElementById("nav");
const onScroll = () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 8);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Active nav link via IntersectionObserver
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav__links a");
const linkById = new Map(
  Array.from(navLinks).map((a) => [a.getAttribute("href").slice(1), a])
);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("is-active"));
        const link = linkById.get(entry.target.id);
        if (link) link.classList.add("is-active");
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
);
sections.forEach((s) => navObserver.observe(s));

// Reveal-on-scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
