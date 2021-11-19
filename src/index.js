import "regenerator-runtime/runtime";

const [canvas1, canvas2] = document.querySelectorAll("canvas");
const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");
const unitSize = 100;

function resize() {
  canvas1.width = window.innerWidth;
  canvas1.height = window.innerHeight;
  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;
  drawGrid();
}
addEventListener("resize", resize);
resize();

function drawGrid() {
  ctx1.strokeStyle = "#333333";
  ctx1.resetTransform();
  ctx1.translate(canvas1.width / 2, canvas1.height / 2);
  for (let x = 0; x < canvas1.width / 2; x += unitSize) {
    ctx1.beginPath();
    ctx1.moveTo(x, -canvas1.height / 2);
    ctx1.lineTo(x, canvas1.height / 2);
    ctx1.stroke();
    ctx1.beginPath();
    ctx1.moveTo(-x, -canvas1.height / 2);
    ctx1.lineTo(-x, canvas1.height / 2);
    ctx1.stroke();
  }
  for (let y = 0; y < canvas1.height / 2; y += unitSize) {
    ctx1.beginPath();
    ctx1.moveTo(-canvas1.width / 2, y);
    ctx1.lineTo(canvas1.width / 2, y);
    ctx1.stroke();
    ctx1.beginPath();
    ctx1.moveTo(-canvas1.width / 2, -y);
    ctx1.lineTo(canvas1.width / 2, -y);
    ctx1.stroke();
  }
}

function drawRectangle({ x, y }) {
  const width = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  const height = Math.pow(unitSize, 2) / width;
  const rads = Math.atan2(y, x);
  ctx2.resetTransform();
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  ctx2.translate(canvas1.width / 2, canvas1.height / 2);
  ctx2.rotate(rads);
  ctx2.strokeStyle = "white";
  ctx2.strokeWidth = 2;
  ctx2.fillStyle = "rgba(50, 50, 200, 0.3)";
  ctx2.beginPath();
  ctx2.rect(0, 0, width, height);
  ctx2.stroke();
  ctx2.fill();
  return {
    x: -Math.sin(rads) * height,
    y: Math.cos(rads) * height,
  };
}

async function* forGen(init, end, inc) {
  let i = init;
  while (i < end) {
    yield i;
    i += inc;
  }
}
const sleep = (t) => new Promise((r) => setTimeout(r, t));
async function draw() {
  ctx1.strokeStyle = "#CCCCCC";

  ctx1.beginPath();
  for await (let i of forGen(-20, 20, 1)) {
    const x = (i < 0 ? -Math.pow(1.5, -i) : Math.pow(1.5, i)) / 15;
    const y = -unitSize;
    const point = drawRectangle({ x: x * unitSize, y });
    ctx1.lineTo(point.x, point.y);
    ctx1.stroke();
    await sleep(100);
  }

  for await (let i of [0, -1, 1, -2, 2, -3, 3, -4, 4, -5]) {
    ctx1.beginPath();
    ctx1.arc(
      (i + 1 / 2) * unitSize,
      (-3 / 2) * unitSize,
      unitSize / 2,
      0,
      Math.PI * 2
    );
    ctx1.stroke();
    ctx1.beginPath();
    for await (let r of forGen(0, Math.PI * 2, 0.1)) {
      const x = (Math.sin(r) * unitSize) / 2 + (i + 1 / 2) * unitSize;
      const y = (Math.cos(r) * unitSize) / 2 + (-3 / 2) * unitSize;
      const point = drawRectangle({ x, y });
      ctx1.lineTo(point.x, point.y);
      ctx1.stroke();
      await sleep(10);
    }
  }

  for await (let i of [0, -1, 1, -2, 2, -3, 3, -4]) {
    ctx1.beginPath();
    ctx1.arc(
      (i + 1 / 2) * unitSize,
      (-5 / 2) * unitSize,
      unitSize / 2,
      0,
      Math.PI * 2
    );
    ctx1.stroke();
    ctx1.beginPath();
    for await (let r of forGen(0, Math.PI * 2, 0.1)) {
      const x = (Math.sin(r) * unitSize) / 2 + (i + 1 / 2) * unitSize;
      const y = (Math.cos(r) * unitSize) / 2 + (-5 / 2) * unitSize;
      const point = drawRectangle({ x, y });
      ctx1.lineTo(point.x, point.y);
      ctx1.stroke();
      await sleep(10);
    }
  }

  for await (let i of [0, -1, 1, -2, 2, -3, 3, -4]) {
    ctx1.beginPath();
    ctx1.arc(
      (i + 1 / 2) * unitSize,
      (-7 / 2) * unitSize,
      unitSize / 2,
      0,
      Math.PI * 2
    );
    ctx1.stroke();
    ctx1.beginPath();
    for await (let r of forGen(0, Math.PI * 2, 0.1)) {
      const x = (Math.sin(r) * unitSize) / 2 + (i + 1 / 2) * unitSize;
      const y = (Math.cos(r) * unitSize) / 2 + (-7 / 2) * unitSize;
      const point = drawRectangle({ x, y });
      ctx1.lineTo(point.x, point.y);
      ctx1.stroke();
      await sleep(10);
    }
  }

  addEventListener("mousemove", (event) => {
    drawRectangle({
      x: event.x - canvas2.width / 2,
      y: event.y - canvas2.height / 2,
    });
  });
}
draw();
