const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const siteHeader = document.querySelector(".site-header");

let previousScrollY = window.scrollY;
let scrollUpdatePending = false;

function updateHeaderVisibility() {
  const currentScrollY = window.scrollY;
  const menuIsOpen = mainNav.classList.contains("is-open");

  if (currentScrollY <= siteHeader.offsetHeight || menuIsOpen) {
    siteHeader.classList.remove("is-hidden");
  } else if (currentScrollY > previousScrollY + 5) {
    siteHeader.classList.add("is-hidden");
  } else if (currentScrollY < previousScrollY - 5) {
    siteHeader.classList.remove("is-hidden");
  }

  previousScrollY = currentScrollY;
}

window.addEventListener("scroll", () => {
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  window.requestAnimationFrame(() => {
    updateHeaderVisibility();
    scrollUpdatePending = false;
  });
}, { passive: true });

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  mainNav.classList.toggle("is-open", !expanded);
  siteHeader.classList.remove("is-hidden");
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mainNav.classList.remove("is-open");
  }
});

document.querySelectorAll(".location-details details").forEach((item) => {
  item.addEventListener("toggle", () => {
    const symbol = item.querySelector("summary span");
    symbol.textContent = item.open ? "−" : "+";
  });
});

document.querySelectorAll(".site-search-input").forEach((input) => {
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    input.closest(".header-popover-panel").querySelectorAll("[data-search-result]").forEach((link) => {
      link.hidden = !link.textContent.toLowerCase().includes(query);
    });
  });
});

const backgroundVideos = [...document.querySelectorAll(".hero-video, .capability-video")];
const heroVideoToggle = document.querySelector(".hero-video-toggle");

if (backgroundVideos.length && heroVideoToggle) {
  const updateVideoToggle = () => {
    const action = backgroundVideos.some((video) => !video.paused) ? "Pause" : "Play";
    heroVideoToggle.textContent = `${action} video`;
    heroVideoToggle.setAttribute("aria-label", `${action} background video`);
  };

  backgroundVideos.forEach((video) => {
    video.addEventListener("play", updateVideoToggle);
    video.addEventListener("pause", updateVideoToggle);
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    backgroundVideos.forEach((video) => video.pause());
    updateVideoToggle();
  } else {
    backgroundVideos.forEach((video) => video.play().catch(updateVideoToggle));
  }

  heroVideoToggle.addEventListener("click", () => {
    if (backgroundVideos.some((video) => video.paused)) {
      backgroundVideos.forEach((video) => video.play().catch(updateVideoToggle));
    } else {
      backgroundVideos.forEach((video) => video.pause());
    }
  });
}

const revealItems = document.querySelectorAll(".product-card, .industry-card, .engineering-copy, .network-visual");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => {
    item.classList.add("reveal");
    revealObserver.observe(item);
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();
