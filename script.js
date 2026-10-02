/* =====================================================
   WEDDING COUNTDOWN
   Muhurtham: 25 October 2026 - 06:00 AM IST
===================================================== */

const target = new Date(
  "2026-10-25T06:00:00+05:30"
).getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function pad(number) {
  return String(number).padStart(2, "0");
}

function tick() {

  const now = Date.now();

  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / 86400000);

  const hours = Math.floor(
    (diff % 86400000) / 3600000
  );

  const minutes = Math.floor(
    (diff % 3600000) / 60000
  );

  const seconds = Math.floor(
    (diff % 60000) / 1000
  );

  if (daysEl) {
    daysEl.textContent = pad(days);
  }

  if (hoursEl) {
    hoursEl.textContent = pad(hours);
  }

  if (minutesEl) {
    minutesEl.textContent = pad(minutes);
  }

  if (secondsEl) {
    secondsEl.textContent = pad(seconds);
  }
}

tick();

setInterval(tick, 1000);


/* =====================================================
   SCROLL REVEAL ANIMATION
===================================================== */

const revealObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add("show");

        revealObserver.unobserve(entry.target);
      }

    });

  },
  {
    threshold: 0.12
  }
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => {

    revealObserver.observe(element);

  });


/* =====================================================
   WEDDING MUSIC
   Browsers may block autoplay until user interaction.
===================================================== */

const song = document.getElementById("weddingSong");

if (song) {

  song.loop = true;

  song.volume = 1;

  song.muted = false;

  song.setAttribute("playsinline", "");

  async function playWeddingSong() {

    try {

      song.muted = false;

      await song.play();

    } catch (error) {

      /*
        Mobile browsers such as iPhone Safari
        may block unmuted autoplay.

        The first user interaction will try again.
      */

    }

  }

  window.addEventListener(
    "load",
    playWeddingSong
  );

  document.addEventListener(
    "DOMContentLoaded",
    playWeddingSong
  );

  /*
    First interaction fallback.
  */

  const startMusic = () => {

    playWeddingSong();

  };

  document.addEventListener(
    "click",
    startMusic,
    { once: true, capture: true }
  );

  document.addEventListener(
    "touchstart",
    startMusic,
    { once: true, capture: true }
  );

  document.addEventListener(
    "pointerdown",
    startMusic,
    { once: true, capture: true }
  );

  document.addEventListener(
    "scroll",
    startMusic,
    { once: true, capture: true }
  );
}


/* =====================================================
   SCRATCH TO REVEAL
===================================================== */

const scratchCards =
  document.querySelectorAll(".scratch-card");

scratchCards.forEach((card, index) => {

  const canvas =
    card.querySelector(".scratch-canvas");

  const scratchText =
    card.querySelector(".scratch-text");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const scratchKey =
    `weddingScratchRevealed_${index}`;

  let scratching = false;

  let lastX = 0;
  let lastY = 0;

  let revealed = false;


  /* -----------------------------------------------
     REVEAL CARD
  ------------------------------------------------ */

  function revealCard() {

    if (revealed) return;

    revealed = true;

    canvas.style.transition =
      "opacity 0.5s ease";

    scratchText.style.transition =
      "opacity 0.4s ease";

    canvas.style.opacity = "0";

    scratchText.style.opacity = "0";

    setTimeout(() => {

      canvas.style.display = "none";
      scratchText.style.display = "none";

    }, 500);

    localStorage.setItem(
      scratchKey,
      "yes"
    );
  }


  /* -----------------------------------------------
     CREATE SCRATCH SURFACE
  ------------------------------------------------ */

  function drawScratchSurface() {

    const rect =
      card.getBoundingClientRect();

    const width =
      Math.max(1, Math.floor(rect.width));

    const height =
      Math.max(1, Math.floor(rect.height));

    const oldCanvas =
      document.createElement("canvas");

    oldCanvas.width = canvas.width;
    oldCanvas.height = canvas.height;

    if (
      canvas.width > 0 &&
      canvas.height > 0
    ) {

      oldCanvas
        .getContext("2d")
        .drawImage(canvas, 0, 0);

    }

    canvas.width = width;
    canvas.height = height;

    ctx.globalCompositeOperation =
      "source-over";


    /* Royal gold/maroon scratch layer */

    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        width,
        height
      );

    gradient.addColorStop(
      0,
      "#3b0715"
    );

    gradient.addColorStop(
      0.45,
      "#9c6a24"
    );

    gradient.addColorStop(
      0.55,
      "#c99a42"
    );

    gradient.addColorStop(
      1,
      "#4a091b"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );


    /* Gold texture */

    for (let i = 0; i < 180; i++) {

      const x =
        Math.random() * width;

      const y =
        Math.random() * height;

      const radius =
        Math.random() * 1.8 + 0.5;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        Math.random() > 0.5
          ? "rgba(255,240,190,0.16)"
          : "rgba(40,0,10,0.13)";

      ctx.fill();

    }


    /* Decorative scratch surface text */

    ctx.fillStyle =
      "rgba(255,244,205,0.10)";

    ctx.font =
      "600 14px Poppins, sans-serif";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
      "SCRATCH",
      width / 2,
      height / 2 - 10
    );

    ctx.font =
      "11px Poppins, sans-serif";

    ctx.fillText(
      "TO REVEAL",
      width / 2,
      height / 2 + 14
    );

  }


  /* -----------------------------------------------
     POSITION
  ------------------------------------------------ */

  function getPosition(event) {

    const rect =
      canvas.getBoundingClientRect();

    let clientX;
    let clientY;

    if (event.touches && event.touches.length) {

      clientX =
        event.touches[0].clientX;

      clientY =
        event.touches[0].clientY;

    } else {

      clientX = event.clientX;
      clientY = event.clientY;

    }

    return {

      x: clientX - rect.left,

      y: clientY - rect.top

    };

  }


  /* -----------------------------------------------
     SCRATCH
  ------------------------------------------------ */

  function scratch(event) {

    if (!scratching || revealed) return;

    event.preventDefault();

    const position =
      getPosition(event);

    const x = position.x;
    const y = position.y;


    ctx.globalCompositeOperation =
      "destination-out";


    /*
      Smooth scratch line
    */

    ctx.beginPath();

    ctx.moveTo(
      lastX,
      lastY
    );

    ctx.lineTo(
      x,
      y
    );

    ctx.lineWidth = 45;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    ctx.stroke();


    /*
      Scratch circle
    */

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      24,
      0,
      Math.PI * 2
    );

    ctx.fill();


    lastX = x;
    lastY = y;


    checkScratchAmount();

  }


  /* -----------------------------------------------
     CHECK REVEAL %
  ------------------------------------------------ */

  let lastCheck = 0;

  function checkScratchAmount() {

    const now = Date.now();

    /*
      Don't run expensive pixel checking
      on every mouse movement.
    */

    if (now - lastCheck < 250) return;

    lastCheck = now;

    const pixels =
      ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

    let cleared = 0;

    const total =
      pixels.data.length / 4;

    /*
      Check every 4th pixel for performance.
    */

    for (
      let i = 3;
      i < pixels.data.length;
      i += 16
    ) {

      if (pixels.data[i] === 0) {

        cleared++;

      }

    }

    const sampledTotal =
      total / 4;

    const percent =
      (cleared / sampledTotal) * 100;


    /*
      Reveal after 35%.
    */

    if (percent >= 35) {

      revealCard();

    }

  }


  /* -----------------------------------------------
     MOUSE
  ------------------------------------------------ */

  canvas.addEventListener(
    "mousedown",
    (event) => {

      scratching = true;

      const position =
        getPosition(event);

      lastX = position.x;
      lastY = position.y;

      scratch(event);

    }
  );

  canvas.addEventListener(
    "mousemove",
    scratch
  );

  canvas.addEventListener(
    "mouseup",
    () => {

      scratching = false;

    }
  );

  canvas.addEventListener(
    "mouseleave",
    () => {

      scratching = false;

    }
  );


  /* -----------------------------------------------
     TOUCH
  ------------------------------------------------ */

  canvas.addEventListener(
    "touchstart",
    (event) => {

      event.preventDefault();

      scratching = true;

      const position =
        getPosition(event);

      lastX = position.x;
      lastY = position.y;

      scratch(event);

    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    scratch,
    { passive: false }
  );

  canvas.addEventListener(
    "touchend",
    () => {

      scratching = false;

    }
  );


  /* -----------------------------------------------
     RESIZE
  ------------------------------------------------ */

  let resizeTimer;

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {

        /*
          Don't redraw after the card
          has already been revealed.
        */

        if (!revealed) {

          drawScratchSurface();

        }

      }, 200);

    }
  );


  /* -----------------------------------------------
     INITIALIZE
  ------------------------------------------------ */

  if (
    localStorage.getItem(scratchKey) === "yes"
  ) {

    revealed = true;

    canvas.style.display = "none";

    scratchText.style.display = "none";

  } else {

    drawScratchSurface();

  }

});
