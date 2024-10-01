import Konva from 'konva';

export const RenderTextEditArea = (editingText, stageRef, setEditingText, transformerRef) => {
  if (!editingText) return null;

  const stage = stageRef.current;
  const textNode = stage.findOne(`#${editingText.id}`);
  if (!textNode) return null;

  const tr = new Konva.Transformer({
    node: textNode,
    enabledAnchors: ['middle-left', 'middle-right'],
    boundBoxFunc: (newBox) => {
      newBox.width = Math.max(30, newBox.width);
      return newBox;
    },
  });

  textNode.on('transform', () => {
    textNode.setAttrs({
      width: textNode.width() * textNode.scaleX(),
      scaleX: 1,
    });
  });

  textNode.hide();
  tr.hide();

  const textPosition = textNode.absolutePosition();
  const areaPosition = {
    x: stage.container().offsetLeft + textPosition.x,
    y: stage.container().offsetTop + textPosition.y,
  };

  const textarea = document.createElement('textarea');
  const canvasContainer = document.getElementById('image-canvas');
  canvasContainer.appendChild(textarea);

  textarea.value = textNode.text();
  textarea.style.position = 'absolute';
  textarea.style.top = `${areaPosition.y}px`;
  textarea.style.left = `${areaPosition.x}px`;
  textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`;
  textarea.style.height = `${textNode.height() - textNode.padding() * 2 + 5}px`;
  textarea.style.fontSize = `${textNode.fontSize()}px`;
  textarea.style.border = 'none';
  textarea.style.padding = '0px';
  textarea.style.margin = '0px';
  textarea.style.overflow = 'hidden';
  textarea.style.background = 'none';
  textarea.style.outline = 'none';
  textarea.style.resize = 'none';
  textarea.style.lineHeight = textNode.lineHeight();
  textarea.style.fontFamily = textNode.fontFamily();
  textarea.style.textAlign = textNode.align();
  textarea.style.color = textNode.fill();

  const rotation = textNode.rotation();
  let transform = '';
  if (rotation) {
    transform += `rotateZ(${rotation}deg)`;
  }

  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
  if (isFirefox) {
    transform += `translateY(-${2 + Math.round(textNode.fontSize() / 20)}px)`;
  }

  textarea.style.transform = transform;

  const updateSizes = () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    textNode.width(textarea.offsetWidth);
    textNode.height(textarea.offsetHeight);
    textNode.getLayer().batchDraw();
  };

  textarea.addEventListener('input', updateSizes);
  textarea.style.height = `${textarea.scrollHeight + 3}px`;
  textarea.focus();

  const removeTextarea = () => {
    textarea.parentNode?.removeChild(textarea);
    window.removeEventListener('click', handleOutsideClick);
    textNode.show();
    if (tr) {
      tr.hide();
      tr.nodes([]); // Clear the transformer nodes
    }
  };
  

  const setTextareaWidth = (newWidth) => {
    if (!newWidth) {
      newWidth = textNode.placeholder.length * textNode.fontSize();
    }
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isEdge = !!document.documentMode || /Edge/.test(navigator.userAgent);
    if (isSafari || isFirefox || isEdge) {
      newWidth = Math.ceil(newWidth);
    }
    textarea.style.width = `${newWidth}px`;
  };

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      textNode.text(textarea.value);
      removeTextarea();
      setEditingText(null);
    }
    if (e.key === 'Escape') {
      removeTextarea();
      setEditingText(null);
    }
  });

  textarea.addEventListener('keydown', () => {
    const scale = textNode.getAbsoluteScale().x;
    setTextareaWidth(textNode.width() * scale);
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + textNode.fontSize()}px`;
  });

  const handleOutsideClick = (e) => {
    if (e.target !== textarea) {
      textNode.text(textarea.value);
      removeTextarea();
      setEditingText(null);
    }
  };

  setTimeout(() => {
    window.addEventListener('click', handleOutsideClick);
  });
};

export default RenderTextEditArea;