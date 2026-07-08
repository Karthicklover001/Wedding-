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

// Song play / pause button
const song = document.getElementById("weddingSong");
const musicBtn = document.getElementById("musicBtn");

if (song) song.loop = true;

if (song && musicBtn) {
  musicBtn.addEventListener("click", async () => {
    try {
      if (song.paused) {
        await song.play();
        musicBtn.textContent = "⏸ Pause Song";
        musicBtn.classList.add("playing");
      } else {
        song.pause();
        musicBtn.textContent = "▶ Play Song";
        musicBtn.classList.remove("playing");
      }
    } catch (err) {
      musicBtn.textContent = "Tap Again to Play";
    }
  });
}

// Near auto-play: first tap anywhere starts song
function startWeddingSong() {
  if (song) {
    song
      .play()
      .then(() => {
        if (musicBtn) {
          musicBtn.textContent = "⏸ Pause Song";
          musicBtn.classList.add("playing");
        }
      })
      .catch(() => {});
  }

  document.removeEventListener("click", startWeddingSong);
  document.removeEventListener("touchstart", startWeddingSong);
}

document.addEventListener("click", startWeddingSong);
document.addEventListener("touchstart", startWeddingSong);

// Scratch to reveal event date and time
function setupScratchCards() {
  document.querySelectorAll(".scratch-card").forEach((card) => {
    const canvas = card.querySelector(".scratch-canvas");
    const text = card.querySelector(".scratch-text");
    if (!canvas || !text) return;

    const ctx = canvas.getContext("2d");
    let scratching = false;
    let revealed = false;

    function resizeCanvas() {
      if (revealed) return;

      const rect = card.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;

      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(rect.height * ratio);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#7b1028");
      gradient.addColorStop(0.5, "#c89b4d");
      gradient.addColorStop(1, "#3e0718");

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      for (let i = 0; i < 90; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * rect.width,
          Math.random() * rect.height,
          Math.random() * 2 + 1,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    function getPosition(e) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    function scratch(e) {
      if (!scratching || revealed) return;
      e.preventDefault();

      const pos = getPosition(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 26, 0, Math.PI * 2);
      ctx.fill();

      checkScratchAmount();
    }

    function checkScratchAmount() {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let cleared = 0;

      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) cleared++;
      }

      const percent = (cleared / (imageData.data.length / 4)) * 100;
      if (percent > 38) revealCard();
    }

    function revealCard() {
      revealed = true;
      canvas.style.transition = "opacity 0.45s ease";
      text.style.transition = "opacity 0.45s ease";
      canvas.style.opacity = "0";
      text.style.opacity = "0";
      setTimeout(() => {
        canvas.style.display = "none";
        text.style.display = "none";
      }, 460);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    canvas.addEventListener("mousedown", () => (scratching = true));
    window.addEventListener("mouseup", () => (scratching = false));
    canvas.addEventListener("mouseleave", () => (scratching = false));
    canvas.addEventListener("mousemove", scratch);

    canvas.addEventListener("touchstart", (e) => {
      scratching = true;
      scratch(e);
    }, { passive: false });
    canvas.addEventListener("touchend", () => (scratching = false));
    canvas.addEventListener("touchcancel", () => (scratching = false));
    canvas.addEventListener("touchmove", scratch, { passive: false });
  });
}

window.addEventListener("load", setupScratchCards);
