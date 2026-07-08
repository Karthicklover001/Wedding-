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

// Auto play wedding song without button
const song = document.getElementById("weddingSong");

if (song) {
  song.loop = true;
  song.volume = 1;

  window.addEventListener("load", () => {
    song.play().catch(() => {});
  });

  function startSongAfterTouch() {
    song.play().catch(() => {});

    document.removeEventListener("click", startSongAfterTouch);
    document.removeEventListener("touchstart", startSongAfterTouch);
    document.removeEventListener("scroll", startSongAfterTouch);
  }

  document.addEventListener("click", startSongAfterTouch);
  document.addEventListener("touchstart", startSongAfterTouch);
  document.addEventListener("scroll", startSongAfterTouch);
}

// Premium scratch reveal - remember after scratched
document.querySelectorAll(".scratch-card").forEach((card, index) => {
  const canvas = card.querySelector(".scratch-canvas");
  const cover = card.querySelector(".scratch-cover");
  const ctx = canvas.getContext("2d");

  const scratchKey = `karthickWeddingScratchDone_${index}`;

  if (localStorage.getItem(scratchKey) === "yes") {
    canvas.style.display = "none";
    if (cover) cover.style.display = "none";
    return;
  }

  function drawScratchLayer() {
    const rect = card.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.globalCompositeOperation = "source-over";

    const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bg.addColorStop(0, "#4b0014");
    bg.addColorStop(0.35, "#8b1635");
    bg.addColorStop(0.7, "#c79a4b");
    bg.addColorStop(1, "#5b0018");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Golden shine lines
    ctx.strokeStyle = "rgba(255, 235, 170, 0.22)";
    ctx.lineWidth = 2;

    for (let i = -canvas.height; i < canvas.width; i += 34) {
      ctx.beginPath();
      ctx.moveTo(i, canvas.height);
      ctx.lineTo(i + canvas.height, 0);
      ctx.stroke();
    }

    // Glitter dots
    for (let i = 0; i < 140; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 2.2 + 0.6;

      ctx.beginPath();
      ctx.fillStyle =
        Math.random() > 0.45
          ? "rgba(255, 240, 190, 0.55)"
          : "rgba(255, 255, 255, 0.22)";
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border glow
    ctx.strokeStyle = "rgba(255, 225, 145, 0.75)";
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  }

  drawScratchLayer();
  window.addEventListener("resize", drawScratchLayer);

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
    ctx.arc(pos.x, pos.y, 34, 0, Math.PI * 2);
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

    if (percent > 28) {
      canvas.style.display = "none";
      if (cover) cover.style.display = "none";

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
