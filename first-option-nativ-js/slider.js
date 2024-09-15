class Slider {
    constructor(container) {
        this.container = container;
        this.slider = container.querySelector('.slider');
        this.sliderFill = container.querySelector('.slider-fill');
        this.sliderHandle = container.querySelector('.slider-handle');
        this.sliderValue = container.querySelector('.slider-value');
        
        this.min = parseInt(container.dataset.min);  // Берем min из data-атрибута
        this.max = parseInt(container.dataset.max);  // Берем max из data-атрибута
        
        this.isDragging = false;

        this.sliderHandle.addEventListener('mousedown', this.startDragging.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDragging.bind(this));

        // Обработка ввода в поле
        this.sliderValue.addEventListener('input', this.updateFromInput.bind(this));

        // Initialize slider with value from input
        const initialValue = parseInt(this.sliderValue.value);  // Берем начальное значение из input
        const initialPercentage = (initialValue - this.min) / (this.max - this.min);  // Рассчитываем процент
        this.updateSlider(initialPercentage);
    }

    startDragging(e) {
        this.isDragging = true;
        this.drag(e);
    }

    stopDragging() {
        this.isDragging = false;
    }

    drag(e) {
        if (!this.isDragging) return;

        const sliderRect = this.slider.getBoundingClientRect();
        const percentage = (e.clientX - sliderRect.left) / sliderRect.width;
        this.updateSlider(percentage);
    }

    updateSlider(percentage) {
        percentage = Math.max(0, Math.min(1, percentage));  // Ограничиваем процент между 0 и 1
        const range = this.max - this.min;
        const value = Math.round(this.min + percentage * range);

        this.sliderHandle.style.left = `${percentage * 100}%`;
        
        const middlePercentage = (0 - this.min) / range;
        
        if (percentage >= middlePercentage) {
            this.sliderFill.style.left = `${middlePercentage * 100}%`;
            this.sliderFill.style.width = `${(percentage - middlePercentage) * 100}%`;
        } else {
            this.sliderFill.style.left = `${percentage * 100}%`;
            this.sliderFill.style.width = `${(middlePercentage - percentage) * 100}%`;
        }

        // Обновляем значение в input
        this.sliderValue.value = value;

        // Обновляем настройки изображения
        updateSetting(this.sliderValue.id, value);
    }

    updateFromInput() {
        const value = parseInt(this.sliderValue.value);
        if (isNaN(value)) return;

        const range = this.max - this.min;
        const percentage = (value - this.min) / range;
        this.updateSlider(percentage);
    }
}
// Initialize all sliders after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.slider-container').forEach(container => new Slider(container));
});






const canvas2 = document.querySelector("#image_canvas");
const canvasCtx = canvas2.getContext("2d");
const settings = {};
let image2 = document.getElementById('image');


function updateSetting(key, value) {
    if (!image2) return;
    settings[key] = value;
    renderImage();
}
function generateFilter() {
    const { brightness, saturation, contrast, blur, inversion } = settings;

    return `brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%) blur(${blur}px) invert(${inversion}%)`;
}
function renderImage() {
    canvas2.width = image2.width;
    canvas2.height = image2.height;
    canvasCtx.filter = generateFilter();

     // Очищаем канвас и рисуем изображение
     canvasCtx.clearRect(0, 0, canvas2.width, canvas2.height);
     canvasCtx.drawImage(image2, 0, 0, canvas2.width, canvas2.height);
}

function resetAdjust() {
    settings.brightness = "100";
    settings.contrast = "100";
    settings.saturation = "100";
    settings.blur = "0";
    settings.inversion = "0";
    // brightnessInput.value = settings.brightness;
    // saturationInput.value = settings.saturation;
    // blurInput.value = settings.blur;
    // inversionInput.value = settings.inversion;
    document.getElementById('brightness').value = settings.brightness;
    document.getElementById('contrast').value = settings.contrast;
    document.getElementById('saturation').value = settings.saturation;
    document.getElementById('blur').value = settings.blur;
    document.getElementById('inversion').value = settings.inversion;

    // Программно обновляем слайдеры
    document.querySelectorAll('.slider-container').forEach(container => {
        const slider = new Slider(container);
        slider.updateFromInput();
    });
    
    renderImage();

}