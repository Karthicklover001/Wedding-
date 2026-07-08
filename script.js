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

if (song) {
  song.loop = true;
}

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
