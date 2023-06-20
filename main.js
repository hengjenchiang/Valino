const SELF_RADIUS = 250.0;
const MOVE_SPEED = 600;
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
  let dvdPosition = new Vector2D(SELF_RADIUS + 10, SELF_RADIUS + 10);
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
    // should draw here TODO:
    console.log('load');
  };
  let dvdColor = randomRgba();

  let pressedKeys = new Set();

  function step(timestamp) {
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

    selfPosition = selfPosition.add(accelerate.scale(dt));

    if (dvdPosition.x + SELF_RADIUS >= width || dvdPosition.x <= 0) {
      dx = dx.x > 0 ? dxMinus : dxPlus;
      dvdColor = randomRgba();
    }
    if (dvdPosition.y + SELF_RADIUS > height || dvdPosition.y <= 0) {
      dy = dy.y > 0 ? dyMinus : dyPlus;
      dvdColor = randomRgba();
    }

    dvdPosition = dvdPosition.add(dx.scale(dt));
    dvdPosition = dvdPosition.add(dy.scale(dt));

    context.clearRect(0, 0, width, height);
    context.fillRect(0, 0, canvas.width, canvas.height, 'red');

    // TODO: refactor to separate function
    drawCircle(context, selfPosition.x, selfPosition.y, SELF_RADIUS, 'red');
    context.clip();
    // context.save();

    context.fillStyle = dvdColor;
    // context.globalCompositeOperation = 'destination-in';
    context.drawImage(
      dvd,
      dvdPosition.x,
      dvdPosition.y,
      SELF_RADIUS,
      SELF_RADIUS
    );

    // renderPath2D(context, dvdLogo, 'blue');

    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);

  document.addEventListener('keydown', (event) => {
    pressedKeys.add(event.code);
  });

  document.addEventListener('keyup', (event) => {
    pressedKeys.delete(event.code);
  });
})();
