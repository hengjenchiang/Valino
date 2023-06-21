const SELF_RADIUS = 70.0;
const DVD_RADIUS = 350.0;
const MOVE_SPEED = 600;
const TEXT_LINE_HEIGHT = 18.0;
class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(that) {
    return new Vector2D(this.x + that.x, this.y + that.y);
  }

  sub(that) {
    return new Vector2D(this.x - that.x, this.y - that.y);
  }

  scale(s) {
    return new Vector2D(this.x * s, this.y * s);
  }
}

const DIRECTION_MAP = Object.freeze({
  KeyS: new Vector2D(0, MOVE_SPEED),
  KeyW: new Vector2D(0, -MOVE_SPEED),
  KeyA: new Vector2D(-MOVE_SPEED, 0),
  KeyD: new Vector2D(MOVE_SPEED, 0),
});

function drawCircle(context, x, y, radius, color = 'red') {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0.0, 2 * Math.PI);
  context.stroke();
  context.fill();

  context.font = '20px Arial';
  context.fillStyle = 'blue';
  context.textAlign = 'center';
  context.fillText('W A S D', x, y);
  context.fillText('to move', x, y + TEXT_LINE_HEIGHT);
}
function renderPath2D(context, path, color = 'blue') {
  context.fillStyle = color;
  context.fill(path);
}

// TODO: Construct a Color class
function randomRgba() {
  return `rgba(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  })`;
}
let canvas;
(() => {
  canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  let start;
  let dvdPosition = new Vector2D(DVD_RADIUS + 10, DVD_RADIUS + 10);
  let selfPosition = new Vector2D(SELF_RADIUS + 10, SELF_RADIUS + 10);

  let dvd = new Image();
  dvd.src = 'DVD_logo.svg';
  const dxPlus = new Vector2D(MOVE_SPEED, 0);
  const dxMinus = new Vector2D(-MOVE_SPEED, 0);
  let dx = dxPlus;
  const dyPlus = new Vector2D(0, MOVE_SPEED);
  const dyMinus = new Vector2D(0, -MOVE_SPEED);
  let dy = dyPlus;
  dvd.onload = function () {
    // should draw here TODO: put animate here
    console.log('load');
  };
  let dvdColor = randomRgba();

  let pressedKeys = new Set();

  function animate(timestamp) {
    if (!start) start = timestamp;
    const dt = (timestamp - start) * 0.001;
    start = timestamp;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let accelerate = new Vector2D(0, 0);
    for (const key of pressedKeys) {
      if (key in DIRECTION_MAP) {
        accelerate = accelerate.add(DIRECTION_MAP[key]);
      }
    }

    // selfPosition = selfPosition.add(accelerate.scale(dt));

    if (
      selfPosition.x + SELF_RADIUS + dt * MOVE_SPEED <= width &&
      selfPosition.x - SELF_RADIUS - dt * MOVE_SPEED >= 0 &&
      selfPosition.y + SELF_RADIUS + dt * MOVE_SPEED <= height &&
      selfPosition.y - SELF_RADIUS - dt * MOVE_SPEED >= 0
    )
      selfPosition = selfPosition.add(accelerate.scale(dt));
    else
      selfPosition = new Vector2D(
        selfPosition.x + SELF_RADIUS + dt * MOVE_SPEED > width
          ? selfPosition.x - 1
          : selfPosition.x + 1,
        selfPosition.y + SELF_RADIUS + dt * MOVE_SPEED > height
          ? selfPosition.y - 1
          : selfPosition.y + 1
      );

    // adding dx.x * dt prevents border shaking
    if (
      dvdPosition.x + DVD_RADIUS + dx.x * dt >= width ||
      dvdPosition.x + dx.x * dt <= 0
    ) {
      dx = dx.x > 0 ? dxMinus : dxPlus;
      dvdColor = randomRgba();
    }
    if (
      dvdPosition.y + DVD_RADIUS + dy.y * dt > height ||
      dvdPosition.y + dy.y * dt <= 0
    ) {
      dy = dy.y > 0 ? dyMinus : dyPlus;
      dvdColor = randomRgba();
    }

    dvdPosition = dvdPosition.add(dx.scale(dt));
    dvdPosition = dvdPosition.add(dy.scale(dt));

    context.clearRect(0, 0, width, height);

    // TODO: refactor to separate function

    context.drawImage(
      dvd,
      dvdPosition.x,
      dvdPosition.y,
      DVD_RADIUS,
      DVD_RADIUS
    );
    context.fillStyle = dvdColor;
    context.globalCompositeOperation = 'source-in';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.globalCompositeOperation = 'source-over';
    drawCircle(context, selfPosition.x, selfPosition.y, SELF_RADIUS, 'red');
    window.requestAnimationFrame(animate);
  }
  window.requestAnimationFrame(animate);

  document.addEventListener('keydown', (event) => {
    pressedKeys.add(event.code);
  });

  document.addEventListener('keyup', (event) => {
    pressedKeys.delete(event.code);
  });
})();
