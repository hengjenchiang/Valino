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
(() => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  let start;
  let position = new Vector2D(SELF_RADIUS + 10, SELF_RADIUS + 10);
  let accelerate = new Vector2D(0, 0);

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

  function step(timestamp) {
    if (!start) start = timestamp;
    const dt = (timestamp - start) * 0.001;
    start = timestamp;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    position = position.add(accelerate.scale(dt));

    if (position.x + SELF_RADIUS >= width || position.x <= 0) {
      dx = dx.x > 0 ? dxMinus : dxPlus;
      dvdColor = randomRgba();
    }
    if (position.y + SELF_RADIUS > height || position.y <= 0) {
      dy = dy.y > 0 ? dyMinus : dyPlus;
      dvdColor = randomRgba();
    }
    position = position.add(dx.scale(dt));
    position = position.add(dy.scale(dt));

    context.clearRect(0, 0, width, height);
    // drawCircle(context, position.x, position.y, SELF_RADIUS, '#999999');
    context.fillStyle = dvdColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'destination-in';
    context.drawImage(dvd, position.x, position.y, SELF_RADIUS, SELF_RADIUS);

    // renderPath2D(context, dvdLogo, 'blue');

    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);

  document.addEventListener('keydown', (event) => {
    if (event.code in DIRECTION_MAP) {
      accelerate = accelerate.add(DIRECTION_MAP[event.code]);
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.code in DIRECTION_MAP) {
      accelerate = accelerate.sub(DIRECTION_MAP[event.code]);
    }
  });
})();
