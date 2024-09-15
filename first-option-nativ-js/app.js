
import Konva from 'konva';


const uploadInput = document.getElementById('selectedImage');
const rectButton = document.getElementById('rectangle');
const circleButton = document.getElementById('circle');
const lineButton = document.getElementById('line');

const stage = new Konva.Stage({
  container: 'image_canvas',
  width: 800,
  height: 600,
});
const layer = new Konva.Layer();
stage.add(layer);

const transformer = new Konva.Transformer();
layer.add(transformer);

let scaleBy = 1.05;

stage.on('wheel', (e) => {
  e.evt.preventDefault();

  const oldScale = stage.scaleX();
  const pointer = stage.getPointerPosition();
  const direction = e.evt.deltaY < 0 ? 1 : -1;
  const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  stage.scale({ x: newScale, y: newScale });

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };

  stage.position(newPos);
  stage.batchDraw();
});

uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      const konvaImage = new Konva.Image({
        x: 50,
        y: 50,
        image: img,
        width: img.width / 2,
        height: img.height / 2,
        draggable: true,
      });
      layer.add(konvaImage);
      layer.draw();
    };
  };
  reader.readAsDataURL(file);
});

rectButton.addEventListener('click', () => {
  const rect = new Konva.Rect({
    x: 100,
    y: 100,
    width: 100,
    height: 50,
    fill: 'red',
    draggable: true,
  });
  layer.add(rect);
  layer.draw();

  rect.on('click', () => {
    transformer.nodes([rect]);
    layer.draw();
  });
});

circleButton.addEventListener('click', () => {
  const circle = new Konva.Circle({
    x: 200,
    y: 200,
    radius: 50,
    fill: 'blue',
    draggable: true,
  });
  layer.add(circle);
  layer.draw();

  circle.on('click', () => {
    transformer.nodes([circle]);
    layer.draw();
  });
});

lineButton.addEventListener('click', () => {
  const line = new Konva.Line({
    points: [50, 50, 150, 150],
    stroke: 'green',
    strokeWidth: 5,
    draggable: true,
  });
  layer.add(line);
  layer.draw();

  line.on('click', () => {
    transformer.nodes([line]);
    layer.draw();
  });
});

stage.on('click', (e) => {
  if (e.target === stage) {
    transformer.nodes([]);
    layer.draw();
  }
});
