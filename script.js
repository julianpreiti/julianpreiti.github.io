document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  const layer = document.createElement("div");
  layer.id = "cursor-trail-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const MIN_DISTANCE = 22;
  let lastX = null;
  let lastY = null;

  window.addEventListener("mousemove", (event) => {
    const x = event.pageX;
    const y = event.pageY;

    if (lastX !== null) {
      const dx = x - lastX;
      const dy = y - lastY;
      if (Math.sqrt(dx * dx + dy * dy) < MIN_DISTANCE) return;
    }

    lastX = x;
    lastY = y;
    spawnCluster(x, y);
  });

  const MAX_RADIUS = 60;

  function spawnCluster(x, y) {
    spawnDot(x, y, 5 + Math.random() * 3, 0.24 + Math.random() * 0.06, 0);

    const satellites = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < satellites; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * MAX_RADIUS;
      const falloff = 1 - radius / (MAX_RADIUS + 10);
      const sx = x + Math.cos(angle) * radius;
      const sy = y + Math.sin(angle) * radius;
      const size = 2 + Math.random() * 3 * falloff + 1.5;
      const opacity = 0.05 + falloff * (0.14 + Math.random() * 0.06);
      const delay = Math.random() * 120;
      spawnDot(sx, sy, size, opacity, delay);
    }
  }

  function spawnDot(x, y, size, opacity, delay) {
    const dot = document.createElement("span");
    dot.className = "trail-dot";
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.animationDelay = `${delay}ms`;
    dot.style.setProperty("--dot-opacity", opacity.toFixed(2));

    layer.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove());
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const EMAIL = "julianpreiti@gmail.com";

  document.querySelectorAll(".copy-email").forEach((trigger) => {
    trigger.addEventListener("click", async (event) => {
      event.preventDefault();
      await copyToClipboard(EMAIL);
      showTooltip(trigger);
    });
  });

  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (err) {}
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (err) {}
    document.body.removeChild(textarea);
  }

  function showTooltip(trigger) {
    const tooltip = trigger.querySelector(".copy-tooltip");
    if (!tooltip) return;

    tooltip.classList.add("is-visible");
    clearTimeout(tooltip._hideTimer);
    tooltip._hideTimer = setTimeout(() => {
      tooltip.classList.remove("is-visible");
    }, 1600);
  }
});
