```javascript
/* =========================================================
   REZ TELESCOPE VM V2 PRO
   Main Simulator Engine
   ========================================================= */

let telescope = {
  ra: 12.0,
  dec: 0.0,
  az: 180.0,
  alt: 45.0,

  target: "Deep Sky",
  tracking: false,
  moving: false,

  zoom: 1
};

let stars = [];
let animationFrame;


/* =========================================================
   CANVAS
   ========================================================= */

const skyCanvas = document.getElementById("skyMap");
const skyCtx = skyCanvas.getContext("2d");

const cameraCanvas = document.getElementById("camera");
const cameraCtx = cameraCanvas.getContext("2d");


function resizeCanvas() {

  const skyRect = skyCanvas.getBoundingClientRect();

  skyCanvas.width = skyRect.width * devicePixelRatio;
  skyCanvas.height = skyRect.height * devicePixelRatio;

  skyCtx.setTransform(
    devicePixelRatio,
    0,
    0,
    devicePixelRatio,
    0,
    0
  );


  const cameraRect = cameraCanvas.getBoundingClientRect();

  cameraCanvas.width = cameraRect.width * devicePixelRatio;
  cameraCanvas.height = cameraRect.height * devicePixelRatio;

  cameraCtx.setTransform(
    devicePixelRatio,
    0,
    0,
    devicePixelRatio,
    0,
    0
  );
}


/* =========================================================
   STAR FIELD
   ========================================================= */

function generateStars() {

  stars = [];

  const rect = skyCanvas.getBoundingClientRect();

  for (let i = 0; i < 320; i++) {

    stars.push({

      x: Math.random() * rect.width,

      y: Math.random() * rect.height,

      size: Math.random() * 1.8 + 0.2,

      brightness: Math.random() * 0.8 + 0.2,

      twinkle: Math.random() * Math.PI * 2

    });

  }
}


/* =========================================================
   SKY MAP
   ========================================================= */

function drawSkyMap() {

  const rect = skyCanvas.getBoundingClientRect();

  const width = rect.width;
  const height = rect.height;

  skyCtx.clearRect(0, 0, width, height);


  /* Background */

  const background =
    skyCtx.createRadialGradient(
      width / 2,
      height / 2,
      10,
      width / 2,
      height / 2,
      width
    );

  background.addColorStop(0, "#10233d");
  background.addColorStop(0.55, "#050d1a");
  background.addColorStop(1, "#01040a");

  skyCtx.fillStyle = background;

  skyCtx.fillRect(
    0,
    0,
    width,
    height
  );


  /* Stars */

  const now = performance.now();

  for (const star of stars) {

    const twinkle =
      Math.sin(now / 600 + star.twinkle) * 0.15;

    const alpha =
      Math.max(
        0.1,
        star.brightness + twinkle
      );

    skyCtx.beginPath();

    skyCtx.arc(
      star.x,
      star.y,
      star.size * telescope.zoom,
      0,
      Math.PI * 2
    );

    skyCtx.fillStyle =
      `rgba(255,255,255,${alpha})`;

    skyCtx.fill();

  }


  /* Grid */

  skyCtx.strokeStyle =
    "rgba(90,150,220,.10)";

  skyCtx.lineWidth = 1;


  for (let x = 0; x < width; x += 60) {

    skyCtx.beginPath();

    skyCtx.moveTo(x, 0);
    skyCtx.lineTo(x, height);

    skyCtx.stroke();

  }


  for (let y = 0; y < height; y += 60) {

    skyCtx.beginPath();

    skyCtx.moveTo(0, y);
    skyCtx.lineTo(width, y);

    skyCtx.stroke();

  }


  /* Center target */

  const centerX = width / 2;
  const centerY = height / 2;


  skyCtx.beginPath();

  skyCtx.arc(
    centerX,
    centerY,
    10,
    0,
    Math.PI * 2
  );

  skyCtx.strokeStyle =
    "#58a6ff";

  skyCtx.stroke();


  skyCtx.beginPath();

  skyCtx.moveTo(
    centerX - 22,
    centerY
  );

  skyCtx.lineTo(
    centerX + 22,
    centerY
  );

  skyCtx.moveTo(
    centerX,
    centerY - 22
  );

  skyCtx.lineTo(
    centerX,
    centerY + 22
  );

  skyCtx.strokeStyle =
    "rgba(88,166,255,.7)";

  skyCtx.stroke();


  /* Target label */

  skyCtx.fillStyle =
    "#8fc4ff";

  skyCtx.font =
    "11px Arial";

  skyCtx.fillText(
    telescope.target,
    centerX + 16,
    centerY - 15
  );

}


/* =========================================================
   CAMERA SIMULATOR
   ========================================================= */

function drawCamera() {

  const rect =
    cameraCanvas.getBoundingClientRect();

  const width = rect.width;
  const height = rect.height;

  cameraCtx.clearRect(
    0,
    0,
    width,
    height
  );


  /* Black sensor */

  cameraCtx.fillStyle = "#000";

  cameraCtx.fillRect(
    0,
    0,
    width,
    height
  );


  /* Simulated glow */

  const glow =
    cameraCtx.createRadialGradient(
      width / 2,
      height / 2,
      5,
      width / 2,
      height / 2,
      190
    );

  glow.addColorStop(
    0,
    "rgba(180,205,255,.35)"
  );

  glow.addColorStop(
    .3,
    "rgba(80,120,220,.18)"
  );

  glow.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  cameraCtx.fillStyle = glow;

  cameraCtx.fillRect(
    0,
    0,
    width,
    height
  );


  /* Camera stars */

  for (let i = 0; i < 140; i++) {

    const x =
      Math.random() * width;

    const y =
      Math.random() * height;

    const radius =
      Math.random() * 1.4;

    cameraCtx.beginPath();

    cameraCtx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2
    );

    cameraCtx.fillStyle =
      "rgba(255,255,255,.75)";

    cameraCtx.fill();

  }


  /* Object glow */

  cameraCtx.beginPath();

  cameraCtx.arc(
    width / 2,
    height / 2,
    30,
    0,
    Math.PI * 2
  );

  cameraCtx.fillStyle =
    "rgba(150,180,255,.12)";

  cameraCtx.fill();


  /* HUD */

  cameraCtx.fillStyle =
    "#a8bad3";

  cameraCtx.font =
    "10px monospace";

  cameraCtx.fillText(
    "REZ CCD SENSOR",
    14,
    22
  );

  cameraCtx.fillText(
    "TARGET: " + telescope.target,
    14,
    38
  );

  cameraCtx.fillText(
    "EXPOSURE: 2.5s",
    14,
    54
  );

}


/* =========================================================
   DISPLAY
   ========================================================= */

function updateDisplay() {

  document.getElementById("ra").textContent =
    formatRA(telescope.ra);

  document.getElementById("dec").textContent =
    formatDEC(telescope.dec);

  document.getElementById("az").textContent =
    telescope.az.toFixed(2) + "°";

  document.getElementById("alt").textContent =
    telescope.alt.toFixed(2) + "°";


  document.getElementById(
    "trackingStatus"
  ).textContent =
    telescope.tracking
      ? "ON"
      : "OFF";


  document.getElementById(
    "currentTarget"
  ).textContent =
    telescope.target;


  document.getElementById(
    "cameraTarget"
  ).textContent =
    "TARGET: " +
    telescope.target;
}


function formatRA(hours) {

  let h = Math.floor(hours);

  let minutes =
    Math.floor((hours - h) * 60);

  let seconds =
    ((hours - h) * 60 - minutes) * 60;

  return (
    String(h).padStart(2, "0") +
    "h " +
    String(minutes).padStart(2, "0") +
    "m " +
    seconds.toFixed(1).padStart(4, "0") +
    "s"
  );
}


function formatDEC(value) {

  const sign =
    value >= 0 ? "+" : "-";

  const absolute =
    Math.abs(value);

  const degrees =
    Math.floor(absolute);

  const minutes =
    Math.floor(
      (absolute - degrees) * 60
    );

  const seconds =
    (
      ((absolute - degrees) * 60)
      - minutes
    ) * 60;

  return (
    sign +
    String(degrees).padStart(2, "0") +
    "° " +
    String(minutes).padStart(2, "0") +
    "′ " +
    seconds.toFixed(1) +
    "″"
  );
}


/* =========================================================
   TELESCOPE MOVEMENT
   ========================================================= */

function moveTelescope(direction) {

  telescope.moving = true;

  const speed = 0.35;


  if (direction === "up") {

    telescope.alt += speed;

  }

  if (direction === "down") {

    telescope.alt -= speed;

  }

  if (direction === "left") {

    telescope.az -= speed;

  }

  if (direction === "right") {

    telescope.az += speed;

  }


  telescope.alt =
    Math.max(
      -90,
      Math.min(
        90,
        telescope.alt
      )
    );


  if (telescope.az < 0) {

    telescope.az += 360;

  }

  if (telescope.az >= 360) {

    telescope.az -= 360;

  }


  updateDisplay();

}


function stopTelescope() {

  telescope.moving = false;

  telescope.tracking = false;

  updateDisplay();

}


/* =========================================================
   TRACKING
   ========================================================= */

function toggleTracking() {

  telescope.tracking =
    !telescope.tracking;

  updateDisplay();

}


/* =========================================================
   GOTO
   ========================================================= */

function gotoObject(id) {

  const object =
    getObjectById(id);

  if (!object) return;


  telescope.target =
    object.name;

  telescope.ra =
    object.ra;

  telescope.dec =
    object.dec;

  telescope.az =
    object.az;

  telescope.alt =
    object.alt;


  updateDisplay();

}


/* =========================================================
   OBJECT LIST
   ========================================================= */

function renderObjects(list) {

  const container =
    document.getElementById(
      "objectList"
    );

  container.innerHTML = "";


  list.forEach(object => {

    const item =
      document.createElement("div");

    item.className =
      "object-item";


    item.innerHTML = `

      <div>
        <div class="object-name">
          ${object.name}
        </div>

        <div class="object-type">
          ${object.type}
          • Mag ${object.magnitude}
        </div>
      </div>

      <button class="goto">
        GOTO
      </button>

    `;


    item
      .querySelector(".goto")
      .addEventListener(
        "click",
        event => {

          event.stopPropagation();

          gotoObject(object.id);

        }
      );


    item.addEventListener(
      "click",
      () => {

        gotoObject(object.id);

      }
    );


    container.appendChild(item);

  });

}


/* =========================================================
   SEARCH
   ========================================================= */

const search =
  document.getElementById(
    "objectSearch"
  );


search.addEventListener(
  "input",
  () => {

    const results =
      searchObjects(
        search.value
      );

    renderObjects(results);

  }
);


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

  const now =
    new Date();

  document.getElementById(
    "skyTime"
  ).textContent =
    now.toLocaleTimeString();

}


/* =========================================================
   TRACKING ENGINE
   ========================================================= */

function trackingEngine() {

  if (telescope.tracking) {

    telescope.ra += 0.00003;

    if (telescope.ra >= 24) {

      telescope.ra = 0;

    }

  }

}


/* =========================================================
   MAIN LOOP
   ========================================================= */

function mainLoop() {

  trackingEngine();

  updateDisplay();

  drawSkyMap();

  drawCamera();

  updateClock();

  animationFrame =
    requestAnimationFrame(
      mainLoop
    );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

window.addEventListener(
  "resize",
  () => {

    resizeCanvas();

    generateStars();

  }
);


resizeCanvas();

generateStars();

renderObjects(
  CELESTIAL_OBJECTS
);

updateDisplay();

mainLoop();
```
