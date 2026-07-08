const target = new Date("2026-10-25T04:00:00+05:30").getTime();

const ids = ["days", "hours", "minutes", "seconds"].map((id) =>
  document.getElementById(id)
);

function pad(n) {
  return String(n).padStart(2, "0");
}

function tick() {
  const diff = Math.max(0, target - Date.now());

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  if (ids[0]) ids[0].textContent = pad(d);
  if (ids[1]) ids[1].textContent = pad(h);
  if (ids[2]) ids[2].textContent = pad(m);
  if (ids[3]) ids[3].textContent = pad(s);
}

tick();
setInterval(tick, 1000);

// Reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Song auto play without button
const song = document.getElementById("weddingSong");

if (song) {
  song.loop = true;
  song.volume = 1;
  song.muted = false;
  song.setAttribute("playsinline", "true");

  function playWeddingSong() {
    song.muted = false;
    song.volume = 1;

    const playPromise = song.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // iPhone/Chrome may block until first user touch
      });
    }
  }

  // Try when website opens
  window.addEventListener("load", playWeddingSong);
  document.addEventListener("DOMContentLoaded", playWeddingSong);

  // Important: first user action will start song
  document.addEventListener("click", playWeddingSong, { once: true, capture: true });
  document.addEventListener("touchstart", playWeddingSong, { once: true, capture: true });
  document.addEventListener("pointerdown", playWeddingSong, { once: true, capture: true });
  document.addEventListener("scroll", playWeddingSong, { once: true, capture: true });
}

// Scratch to reveal date and time - old design + remember after scratched
document.querySelectorAll(".scratch-card").forEach((card, index) => {
  const canvas = card.querySelector(".scratch-canvas");
  const text = card.querySelector(".scratch-text");
  const ctx = canvas.getContext("2d");

  const scratchKey = `weddingScratchRevealed_${index}`;

  // Already scratched before? Then show directly
  if (localStorage.getItem(scratchKey) === "yes") {
    canvas.style.display = "none";
    text.style.display = "none";
    return;
  }

  function resizeCanvas() {
    const rect = card.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#7b1028");
    gradient.addColorStop(0.5, "#b88a44");
    gradient.addColorStop(1, "#4b0718");

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";

    for (let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2 + 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let scratching = false;

  function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;

    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

  function scratch(e) {
    if (!scratching) return;
    e.preventDefault();

    const pos = getPosition(e);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
    ctx.fill();

    checkScratchAmount();
  }

  function checkScratchAmount() {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;

    for (let i = 3; i < pixels.data.length; i += 4) {
      if (pixels.data[i] === 0) cleared++;
    }

    const percent = (cleared / (pixels.data.length / 4)) * 100;

    if (percent > 35) {
      canvas.style.display = "none";
      text.style.display = "none";

      // Same phone/browser-la next time scratch varadhu
      localStorage.setItem(scratchKey, "yes");
    }
  }

  canvas.addEventListener("mousedown", () => {
    scratching = true;
  });

  canvas.addEventListener("mouseup", () => {
    scratching = false;
  });

  canvas.addEventListener("mouseleave", () => {
    scratching = false;
  });

  canvas.addEventListener("mousemove", scratch);

  canvas.addEventListener("touchstart", () => {
    scratching = true;
  });

  canvas.addEventListener("touchend", () => {
    scratching = false;
  });

  canvas.addEventListener("touchmove", scratch);
});
  
