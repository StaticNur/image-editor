let upload_img_box = document.querySelector('.upload_img_box');
let selectedImage = document.querySelector('#selectedImage');
let choose_image = document.querySelector('.choose_image');

let image_holder = document.querySelector('.image_holder');
let image = document.querySelector('#image');

let img_btn = document.querySelector('img_btn');

let canvas = document.querySelector('#image_canvas');
const context = canvas.getContext('2d');

let File_Name;
let Edited = false;


// Open (upload) foto in main page
let dropArea = document.getElementById('drop-area');
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault(); // Отменить поведение по умолчанию (например, открытие файла)
    dropArea.classList.add('dragover');
});
dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});
dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('dragover');

    const file = event.dataTransfer.files[0];
    if (file) {
        const reader = new FileReader();
        File_Name = file.name;

        document.querySelector('.choose_image').style.display = "none";
        document.querySelector('.image_holder').style.display = "block";

        reader.addEventListener("load", function () {
            document.getElementById('image').setAttribute("src", this.result);
        });

        reader.readAsDataURL(file);
        // document.getElementById('img_btn').style.display = "block";
    }
});


/*handle choose image event*/
upload_img_box.addEventListener("click", function () {
    selectedImage.click();
});
/*choose image event*/
selectedImage.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        File_Name = file.name;

        choose_image.style.display = "none";
        image_holder.style.display = "block";

        reader.addEventListener("load", function () {
            image.setAttribute("src", this.result);
        });

        reader.readAsDataURL(file);
        // img_btn.style.display = "block";
    }
    if (Edited === false) {
        Edited = true;
    }
});


/* Possible actions after downloading the foto */
const refreshButton = document.getElementById('refresh');
const editButton = document.getElementById('edit');
const removeButton = document.getElementById('remove');

function selectImage() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg, image/png';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                document.getElementById('image').src = reader.result;
                document.querySelector('.choose_image').style.display = 'none';
                document.querySelector('.image_holder').style.display = 'block';
                // img_btn.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

function removeImage() {
    document.getElementById('image').src = '';
    document.querySelector('.choose_image').style.display = 'block';
    document.querySelector('.image_holder').style.display = 'none';
    // img_btn.style.display = 'none';
}

function editImage() {
    const mainImageSrc = document.getElementById('image').src;
    document.getElementById('editOverlay').style.display = 'block';

    // Set the src of the image inside the edit form to the uploaded image
    drawImageOnCanvas();
    showTool('crop');
}

refreshButton.addEventListener('click', selectImage);
removeButton.addEventListener('click', removeImage);
editButton.addEventListener('click', editImage);


function drawImageOnCanvas() {
    const imageInForm = document.querySelector('.image-in-form');
    const rect = imageInForm.getBoundingClientRect(); // Получаем размеры родительского контейнера
    console.log("rect " + rect);
    const aspectRatio = image.width / image.height;
    console.log("aspectRatio " + aspectRatio);

    const padding = 20; // Отступы сверху и снизу (в пикселях)

    // Рассчитываем размеры канваса с учетом отступов
    if ((rect.width / (rect.height - 2 * padding)) > aspectRatio) {
        canvas.height = rect.height - 2 * padding; // высота с учетом отступов
        canvas.width = canvas.height * aspectRatio; // ширина рассчитывается на основе соотношения сторон
    } else {
        canvas.width = rect.width; // ширина равна ширине контейнера
        canvas.height = canvas.width / aspectRatio; // высота рассчитывается на основе соотношения сторон
    }

    console.log("canvas.width " + canvas.width);
    console.log("canvas.height " + canvas.height);

    // Сохраняем оригинальные размеры canvas и параметры обрезки
    if (!defaultWidth || !defaultHeight) {
        defaultWidth = canvas.width;
        defaultHeight = canvas.height;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
}


/* close form */
function hideEditForm() {
    document.getElementById('editOverlay').style.display = 'none';
}


/*handle each option click even*/
const options = document.querySelectorAll('.option');
const imageId = document.getElementById('image');

options.forEach((option, index) => {
    option.addEventListener('click', function () {
        if (imageId.getAttribute('src') === "") {
            alert("Choose Image First");
            return;
        }

        // Убираем активный класс со всех опций
        options.forEach(opt => opt.classList.remove('active_option'));
        // Добавляем активный класс на выбранную опцию
        this.classList.add('active_option');

        // Пример действий для каждой опции
        switch (index) {
            case 0:
                activateCropTool();
                break;
            case 1:
                activateResizeTool();
                break;
            case 2:
                activateRotateTool();
                break;
            case 3:
                activateAdjustTool();
                break;
            case 4:
                activateFilterTool();
                break;
            case 5:
                activateTextTool();
                break;
            case 6:
                activateElementTool();
                break;
            default:
                console.log('No tool for this option.');
        }
    });
});
// ------------------------------------------------------------------------

// Пример функций для каждой опции
function activateCropTool() {
    console.log("Crop tool activated.");
    showTool('crop');
}
document.getElementById('crop').addEventListener('change', function () {
    const aspectRatio = this.value; // получаем выбранное соотношение
    let newWidth, newHeight;

    // Вычисляем размеры на основе выбранного соотношения
    const originalWidth = image.width;
    const originalHeight = image.height;
    switch (aspectRatio) {
        case '1:1':
            newWidth = Math.min(originalWidth, originalHeight);
            newHeight = newWidth;
            break;
        case '4:3':
            newWidth = originalWidth;
            newHeight = (originalWidth / 4) * 3;
            if (newHeight > originalHeight) {
                newHeight = originalHeight;
                newWidth = (originalHeight / 3) * 4;
            }
            break;
        case '16:9':
            newWidth = originalWidth;
            newHeight = (originalWidth / 16) * 9;
            if (newHeight > originalHeight) {
                newHeight = originalHeight;
                newWidth = (originalHeight / 9) * 16;
            }
            break;
        case '3:2':
            newWidth = originalWidth;
            newHeight = (originalWidth / 3) * 2;
            if (newHeight > originalHeight) {
                newHeight = originalHeight;
                newWidth = (originalHeight / 2) * 3;
            }
            break;

        case '5:4':
            newWidth = originalWidth;
            newHeight = (originalWidth / 5) * 4;
            if (newHeight > originalHeight) {
                newHeight = originalHeight;
                newWidth = (originalHeight / 4) * 5;
            }
            break;

        case '21:9':
            newWidth = originalWidth;
            newHeight = (originalWidth / 21) * 9;
            if (newHeight > originalHeight) {
                newHeight = originalHeight;
                newWidth = (originalHeight / 9) * 21;
            }
            break;

        case '9:16':
            newWidth = originalWidth;
            newHeight = (originalWidth / 9) * 16;
            if (newHeight > originalHeight) {
                newHeight = originalHeight;
                newWidth = (originalHeight / 16) * 9;
            }
            break;
        default:
            newWidth = originalWidth;
            newHeight = originalHeight;
            break;
    }

    // Настраиваем размеры канваса
    canvas.width = newWidth;
    canvas.height = newHeight;
    console.log("newWidth=" + newWidth + " newHeight=" + newHeight);
    // Очищаем канвас и рисуем изображение с новыми размерами
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, newWidth, newHeight);
});
let defaultWidth;
let defaultHeight;
function resetCrop() {
    canvas.width = defaultWidth;
    canvas.height = defaultHeight;
    context.clearRect(0, 0, defaultWidth, defaultHeight);
    context.drawImage(image, 0, 0, defaultWidth, defaultHeight);
}
// -------------------------------------------------------------------------------

// Change size
function activateResizeTool() {
    console.log("Resize tool activated.");
    document.getElementById('cropper').style.display = 'block';
    showTool('resize');
    defaultSizeCrop();
}
const cropper = document.getElementById('cropper');
const applyCropButton = document.getElementById('applyCropButton');
const resetCropButton = document.getElementById('resetCropButton');
const cropWidthInput = document.getElementById('width');
const cropHeightInput = document.getElementById('height');
const resizeHandles = document.querySelectorAll('.resize-handle');

let isDragging = false;
let isResizing = false;
let resizeDirection;
let startX, startY, startWidth, startHeight;
let cropperX, cropperY;
let originalImageData;
let canvasRect;

cropper.addEventListener('mousedown', onCropperMouseDown);
resizeHandles.forEach(handle => handle.addEventListener('mousedown', onResizeHandleMouseDown));
applyCropButton.addEventListener('click', applyCrop);
resetCropButton.addEventListener('click', resetCrop);
cropWidthInput.addEventListener('change', updateCropperSize);
cropHeightInput.addEventListener('change', updateCropperSize);

function updateCanvasRect() {
    canvasRect = canvas.getBoundingClientRect();
}

function onCropperMouseDown(event) {
    if (!event.target.classList.contains('resize-handle')) {
        startX = event.clientX;
        startY = event.clientY;
        cropperX = event.clientX - cropper.getBoundingClientRect().left;
        cropperY = event.clientY - cropper.getBoundingClientRect().top;
        isDragging = true;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
}

function onResizeHandleMouseDown(event) {
    startX = event.clientX;
    startY = event.clientY;
    startWidth = parseInt(getComputedStyle(cropper).width, 10);
    startHeight = parseInt(getComputedStyle(cropper).height, 10);
    cropperX = cropper.getBoundingClientRect().left;
    cropperY = cropper.getBoundingClientRect().top;
    resizeDirection = event.target.classList[1];
    isResizing = true;
    document.addEventListener('mousemove', onResizeMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(event) {
    if (isDragging) {
        let newX = event.clientX - cropperX;
        let newY = event.clientY - cropperY;

        // Ограничиваем движение рамки внутри изображения
        newX = Math.max(0, Math.min(newX, canvasRect.width - parseInt(getComputedStyle(cropper).width, 10)));
        newY = Math.max(0, Math.min(newY, canvasRect.height - parseInt(getComputedStyle(cropper).height, 10)));

        cropper.style.left = `${newX}px`;
        cropper.style.top = `${newY}px`;
    }
}

function onResizeMouseMove(event) {
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = parseInt(getComputedStyle(cropper).left, 10);
    let newTop = parseInt(getComputedStyle(cropper).top, 10);

    if (resizeDirection.includes('right')) {
        newWidth = startWidth + dx;
    }
    if (resizeDirection.includes('bottom')) {
        newHeight = startHeight + dy;
    }
    if (resizeDirection.includes('left')) {
        newWidth = startWidth - dx;
        newLeft = cropperX + dx;
    }
    if (resizeDirection.includes('top')) {
        newHeight = startHeight - dy;
        newTop = cropperY + dy;
    }

    // Ограничиваем размеры рамки обрезки в пределах изображения
    newWidth = Math.max(10, Math.min(newWidth, canvasRect.width - newLeft));
    newHeight = Math.max(10, Math.min(newHeight, canvasRect.height - newTop));

    // Обновляем стили рамки обрезки
    cropper.style.width = `${newWidth}px`;
    cropper.style.height = `${newHeight}px`;
    cropper.style.left = `${newLeft}px`;
    cropper.style.top = `${newTop}px`;

    cropWidthInput.value = newWidth;
    cropHeightInput.value = newHeight;
}

function onMouseUp() {
    isDragging = false;
    isResizing = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mousemove', onResizeMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

function applyCrop() {
    const rect = cropper.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const scaleX = image.width / canvas.width;
    const scaleY = image.height / canvas.height;

    const cropX = (rect.left - canvasRect.left) * scaleX;
    const cropY = (rect.top - canvasRect.top) * scaleY;
    const cropWidth = rect.width * scaleX;
    const cropHeight = rect.height * scaleY;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
        image,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, canvas.width, canvas.height
    );
}

function defaultSizeCrop() {
    // Устанавливаем размеры рамки обрезки равными размерам изображения
    cropper.style.width = `${canvas.width}px`;
    cropper.style.height = `${canvas.height}px`;

    // Устанавливаем положение рамки в центре изображения
    //cropper.style.left = `0px`;
    //cropper.style.top = `0px`;

    cropWidthInput.value = canvas.width;
    cropHeightInput.value = canvas.height;
    updateCanvasRect();
    updateCropperSize();
}
function updateCropperSize() {
    cropper.style.width = `${cropWidthInput.value}px`;
    cropper.style.height = `${cropHeightInput.value}px`;
}

// -------------------------------------------------------------------------------

// rotate
function activateRotateTool() {
    console.log("Rotate tool activated.");
    showTool('rotate-flip');
}
document.getElementById('rotate-left').addEventListener('click', rotateImageLeft);
document.getElementById('rotate-right').addEventListener('click', rotateImageRight);
document.getElementById('flip-horizontal').addEventListener('click', mirrorImageHorizontal);
document.getElementById('flip-vertical').addEventListener('click', mirrorImageVertical);

function rotateImageLeft() {
    const angle = -90;
    rotateImage(angle);
}

function rotateImageRight() {
    const angle = 90;
    rotateImage(angle);
}
// Общая функция для поворота
async function rotateImage(angle) {
    const canvasData = canvas.toDataURL(); // Получаем текущее изображение в формате base64
    const rotatedImageBase64 = await rotate(canvasData, angle, "#ffffff"); // Вызываем функцию поворота
    const img = new Image();

    img.src = rotatedImageBase64;
    img.onload = function () {
        canvas.width = img.width; // Обновляем ширину канваса под новое изображение
        canvas.height = img.height; // Обновляем высоту канваса

        // Отображаем обновленное изображение на канвасе
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
    };
}
const rotate = async (base64, angle, color) => {
    const img = new Image();
    img.setAttribute('src', base64);

    // Ждём, пока изображение загрузится
    await new Promise((resolve) => { img.onload = resolve; });

    const radians = (angle * Math.PI) / 180;
    const width = img.width;
    const height = img.height;

    // Вычисляем новый размер канваса после поворота
    const newWidth = Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians));
    const newHeight = Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians));

    // Создаём канвас с новыми размерами
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;

    const ctx = canvas.getContext("2d");

    // Заливаем фон указанным цветом
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Перемещаем начало координат в центр нового канваса
    ctx.translate(newWidth / 2, newHeight / 2);

    // Поворачиваем канвас на заданный угол
    ctx.rotate(radians);

    // Рисуем изображение, сместив его координаты на половину ширины и высоты
    ctx.drawImage(img, -width / 2, -height / 2);

    // Возвращаем результат в формате base64
    return canvas.toDataURL('image/png');
};

function mirrorImageHorizontal() {
    mirrorImage(true, false);
}

function mirrorImageVertical() {
    mirrorImage(false, true);
}

function mirrorImage(horizontal, vertical) {
    image.src = canvas.toDataURL(); // Get the current image data
    image.onload = function () {
        // Save the current canvas state
        context.save();

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Flip horizontally or vertically
        if (horizontal) {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
        }
        if (vertical) {
            context.translate(0, canvas.height);
            context.scale(1, -1);
        }

        // Draw the image
        context.drawImage(image, 0, 0);

        // Restore the canvas state
        context.restore();
    };
}

// ------------------------------------------------------------------------------
function activateAdjustTool() {
    console.log("Adjust tool activated.");
    showTool('adjust');
}
function activateFilterTool() {
    console.log("Filter tool activated.");
    showTool('filter');
}


// Text
function activateTextTool() {
    console.log("Text tool activated.");
    showTool('text');
}
const toggleTextModeButton = document.getElementById('toggleTextModeButton');
const undoButton = document.getElementById('prev');
const redoButton = document.getElementById('next');

let textMode = false;
let textPosition = { x: 0, y: 0 };
let currentText = "";

let actions = []; // Стек действий
let redoStack = []; // Стек для возврата действий
const maxHistory = 20; // Максимальное количество действий для хранения

// Переключаем режим текста
toggleTextModeButton.addEventListener('click', () => {
    textMode = !textMode;
    if (textMode) {
        document.querySelector('#toggleTextModeButton img').src = 'icon-t-active.png';
        toggleTextModeButton.style.border = '3px solid #12A3F8';
    } else {
        if(currentText){
            // Добавляем текущее действие в историю
            addAction(currentText, textPosition.x, textPosition.y);
        }
            redrawCanvas();  // Обновляем холст с новым текстом

        document.querySelector('#toggleTextModeButton img').src = 'icon-t.png';
        toggleTextModeButton.style.border = '2px solid #dfdfdf';
    }
});

// При клике на canvas, сохраняем позицию для текста
canvas.addEventListener('click', (event) => {
    if (textMode) {
        const rect = canvas.getBoundingClientRect();
        textPosition.x = event.clientX - rect.left;
        textPosition.y = event.clientY - rect.top;
        currentText = "";
    }
});

// Ввод текста через клавиатуру
document.addEventListener('keydown', (event) => {
    if (textMode && textPosition.x && textPosition.y) {
        if (event.key === "Enter") {
            textMode = false;

            // Add current text with styling to history
            addAction(currentText, textPosition.x, textPosition.y, fontFamily, fontSize, fontStyle, textAlign, textColor);
            
            document.querySelector('#toggleTextModeButton img').src = 'icon-t.png';
            toggleTextModeButton.style.border = '2px solid #dfdfdf';
        } else {
            currentText += event.key;
            redrawCanvas();  // Update canvas with new text

            document.querySelector('#toggleTextModeButton img').src = 'icon-t-active.png';
            toggleTextModeButton.style.border = '3px solid #12A3F8';
        }
    }
});


// Функция добавления действия в историю
function addAction(text, x, y, fontFamily, fontSize, fontStyle, textAlign, textColor) {
    if (actions.length >= maxHistory) {
        actions.shift(); // Remove the oldest action
    }
    actions.push({ text, x, y, fontFamily, fontSize, fontStyle, textAlign, textColor });
    redoStack = []; // Clear redo stack after new action
}


// Отменить последнее действие
undoButton.addEventListener('click', undoAction);

// Вернуть последнее отмененное действие
redoButton.addEventListener('click', redoAction);

function undoAction() {
    if (actions.length > 0) {
        const lastAction = actions.pop();
        redoStack.push(lastAction);
        redrawCanvas();
    }
}

function redoAction() {
    if (redoStack.length > 0) {
        const lastRedo = redoStack.pop();
        actions.push(lastRedo);
        redrawCanvas();
    }
}

// Перерисовка канваса
function redrawCanvas() {
    const image = new Image();

    image.src = canvas.toDataURL();

    image.onload = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0); // Draw the image first
    
        // Draw all text actions with their respective styles
        actions.forEach(action => {
            context.font = `${action.fontStyle} ${action.fontSize}px ${action.fontFamily}`;
            context.fillStyle = action.textColor;
            context.textAlign = action.textAlign;
            context.fillText(action.text, action.x, action.y);
    
            // Draw underline if necessary
            if ((action.fontStyle || "").includes("underline")) {
                drawUnderline(action.text, action.x, action.y);
            }
        });
    
        // Display the current text with the applied settings
        if (textMode) {
            context.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
            context.fillStyle = textColor;
            context.textAlign = textAlign;
            context.fillText(currentText, textPosition.x, textPosition.y);
        }
    };
    
}

function drawUnderline(text, x, y) {
    const metrics = context.measureText(text);
    context.beginPath();
    context.moveTo(x, y + 5);
    context.lineTo(x + metrics.width, y + 5);
    context.strokeStyle = textColor;
    context.stroke();
}



// settings text
let fontFamily = "Avenir Next";
let fontSize = "8";
let fontStyle = ""; // Will store combinations like 'bold', 'italic'
let textAlign = "left";
let textColor = "#FFFF00";

// Event listeners for text customization inputs
document.getElementById('font').addEventListener('change', (e) => {
    fontFamily = e.target.value;
});

document.getElementById('size').addEventListener('change', (e) => {
    fontSize = e.target.value;
});

document.querySelector('.b').addEventListener('click', () => {
    fontStyle = fontStyle.includes("bold") ? fontStyle.replace("bold", "") : fontStyle + " bold";
});

document.querySelector('.i').addEventListener('click', () => {
    fontStyle = fontStyle.includes("italic") ? fontStyle.replace("italic", "") : fontStyle + " italic";
});

document.querySelector('.u').addEventListener('click', () => {
    fontStyle = fontStyle.includes("underline") ? fontStyle.replace("underline", "") : fontStyle + " underline";
});

document.querySelector('.s').addEventListener('click', () => {
    fontStyle = fontStyle.trim(); // Убираем лишние пробелы
    if (fontStyle.includes("line-through")) {
        fontStyle = fontStyle.replace("line-through", "").trim(); // Убираем зачёркивание и чистим пробелы
    } else {
        fontStyle += " line-through"; // Добавляем зачёркивание
    }
    document.querySelector('.text').style.fontStyle = fontStyle; // Применяем стиль к тексту
});

document.querySelectorAll('.alignment button').forEach((btn, index) => {
    btn.addEventListener('click', () => {
        textAlign = ["left", "center", "right", "justify"][index];
    });
});

document.getElementById('color').addEventListener('change', (e) => {
    textColor = e.target.value;
    document.getElementById('color-text').value = textColor;
});
document.getElementById('color-text').addEventListener('change', (text) => {
    textColor = document.getElementById('color-text').value;
    document.getElementById('color').value = textColor;
});


// -------------------------------------------------------------------------------
function activateElementTool() {
    console.log("Element tool activated.");
    showTool('decorate');
}
function showTool(toolClass) {
    const tools = document.querySelectorAll('.tool');
    tools.forEach(tool => {
        tool.style.display = 'none';
    });

    const selectedTool = document.querySelector(`.${toolClass}`);
    if (selectedTool) {
        selectedTool.style.display = 'block';
    }
}
