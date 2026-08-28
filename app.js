```javascript
const sky = document.getElementById("skyMap");
const skyCtx = sky.getContext("2d");

const camera = document.getElementById("camera");
const cameraCtx = camera.getContext("2d");

let telescope = {
  ra: 12,
  dec: 0,
  az: 180,
  alt: 45,
  tracking: false,
  target: "Deep Sky"
};

let stars = [];

function resizeCanvas() {
  const skyRect = sky.getBoundingClientRect();
  sky.width = skyRect.width * devicePixelRatio;
  sky.height = skyRect.height * devicePixelRatio;
  skyCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  const camRect = camera.getBoundingClientRect();
  camera.width = camRect.width * devicePixelRatio;
  camera.height = camRect.height * devicePixelRatio;
  cameraCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function createStars() {
  stars = [];

  const rect = sky.getBoundingClientRect();

  for (let i = 0; i < 220; i++) {
    stars.push({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      r: Math.random() * 1.7 + 0.2,
      a: Math.random() * .8 + .2
    });
  }
}

function drawSky() {
  const rect = sky.getBoundingClientRect();

  skyCtx.clearRect(0, 0, rect.width, rect.height);

  const gradient = skyCtx.createRadialGradient(
    rect.width / 2,
    rect.height / 2,
    10,
    rect.width / 2,
    rect.height / 2,
    rect.width
  );

  gradient.addColorStop(0, "#12233c");
  gradient.addColorStop(1, "#02050b");

  skyCtx.fillStyle = gradient;
  skyCtx.fillRect(0, 0, rect.width, rect.height);

  for (const star of stars) {
    skyCtx.beginPath();
    skyCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    skyCtx.fillStyle = `rgba(255,255,255,${star.a})`;
    skyCtx.fill();
  }

  // Horizon
  skyCtx.strokeStyle = "rgba(100,150,210,.15)";
  skyCtx.beginPath();
  skyCtx.moveTo(0, rect.height / 2);
  skyCtx.lineTo(rect.width, rect.height / 2);
  skyCtx.stroke();

  // Telescope target
  const x = rect.width / 2;
  const y = rect.height / 2;

  skyCtx.beginPath();
  skyCtx.arc(x, y, 8, 0, Math.PI * 2);
  skyCtx.strokeStyle = "#67a9ff";
  skyCtx.stroke();

  skyCtx.fillStyle = "#67a9ff";
  skyCtx.font = "11px Arial";
  skyCtx.fillText(telescope.target, x + 13, y - 12);
}

function drawCamera() {
  const rect = camera.getBoundingClientRect();

  cameraCtx.clearRect(0, 0, rect.width, rect.height);

  cameraCtx.fillStyle = "#010204";
  cameraCtx.fillRect(0, 0, rect.width, rect.height);

  // Simulated nebula
  const nebula = cameraCtx.createRadialGradient(
    rect.width / 2,
    rect.height / 2,
    10,
    rect.width / 2,
    rect.height / 2,
    180
  );

  nebula.addColorStop(0, "rgba(150,170,255,.35)");
  nebula.addColorStop(.35, "rgba(80,100,190,.18)");
  nebula.addColorStop(1, "rgba(0,0,0,0)");

  cameraCtx.fillStyle = nebula;
  cameraCtx.fillRect(0, 0, rect.width, rect.height);

  // Stars
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    const r = Math.random() * 1.3;

    cameraCtx.beginPath();
    cameraCtx.arc(x, y, r, 0, Math.PI * 2);
    cameraCtx.fillStyle = "rgba(255,255,255,.8)";
    cameraCtx.fill();
  }

  cameraCtx.fillStyle = "#b5c7e6";
  cameraCtx.font = "11px monospace";
  cameraCtx.fillText("CCD SIMULATION", 14, 24);
  cameraCtx.fillText(`TARGET: ${telescope.target}`, 14, 40);
}

function updateDisplay() {
  document.getElementById("ra").textContent =
    telescope.ra.toFixed(4) + "h";

  const sign = telescope.dec >= 0 ? "+" : "";

  document.getElementById("dec").textContent =
    sign + telescope.dec.toFixed(2) + "°";

  document.getElementById("az").textContent =
    telescope.az.toFixed(1) + "°";

  document.getElementById("alt").textContent =
    telescope.alt.toFixed(1) + "°";

  document.getElementById("trackingStatus").textContent =
    telescope.tracking ? "ON" : "OFF";
}

function move(direction) {
  const speed = .15;

  if (direction === "up") telescope.alt += speed;
  if (direction === "down") telescope.alt -= speed;
  if (direction === "left") telescope.az -= speed;
  if (direction === "right") telescope.az += speed;

  telescope.alt = Math.max(-90, Math.min(90, telescope.alt));

  if (telescope.az < 0) telescope.az += 360;
  if (telescope.az >= 360) telescope.az -= 360;

  updateDisplay();
  drawSky();
}

function stopTelescope() {
  telescope.tracking = false;
  updateDisplay();
}

function tracking() {
  telescope.tracking = !telescope.tracking;
  updateDisplay();
}

function gotoObject(object) {
  const targets = {
    Moon: {
      ra: 14.2,
      dec: -12.1,
      az: 130,
      alt: 52
    },

    Mars: {
      ra: 6.8,
      dec: 23.4,
      az: 210,
      alt: 38
    },

    Jupiter: {
      ra: 2.1,
      dec: 11.8,
      az: 265,
      alt: 47
    },

    Andromeda: {
      ra: .7,
      dec: 41.3,
      az: 82,
      alt: 61
    }
  };

  const target = targets[object];

  if (!target) return;

  telescope.ra = target.ra;
  telescope.dec = target.dec;
  telescope.az = target.az;
  telescope.alt = target.alt;
  telescope.target = object;

  updateDisplay();
  drawSky();
}

function updateClock() {
  const now = new Date();

  document.getElementById("skyTime").textContent =
    now.toLocaleTimeString();
}

function loop() {
  if (telescope.tracking) {
    telescope.ra += .00005;

    if (telescope.ra >= 24) {
      telescope.ra = 0;
    }

    updateDisplay();
  }

  drawSky();
  drawCamera();
  updateClock();

  requestAnimationFrame(loop);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createStars();
});

resizeCanvas();
createStars();
updateDisplay();
loop();
```
