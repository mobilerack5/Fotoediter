// 1. Elemek kinyerése a HTML-ből
const uploadInput = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const placeholder = document.getElementById('placeholder');
const sliderControls = document.getElementById('slider-controls');

const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const saturationSlider = document.getElementById('saturation');
const blurSlider = document.getElementById('blur');
const sepiaSlider = document.getElementById('sepia');
const grayscaleSlider = document.getElementById('grayscale');

const resetButton = document.getElementById('resetButton');
const downloadButton = document.getElementById('downloadButton');

// Globális változó az eredeti kép tárolására
let originalImage = null;

// 2. Eseményfigyelők
uploadInput.addEventListener('change', handleImageUpload);
brightnessSlider.addEventListener('input', applyFilters);
contrastSlider.addEventListener('input', applyFilters);
saturationSlider.addEventListener('input', applyFilters);
blurSlider.addEventListener('input', applyFilters);
sepiaSlider.addEventListener('input', applyFilters);
grayscaleSlider.addEventListener('input', applyFilters);
resetButton.addEventListener('click', resetImage);
downloadButton.addEventListener('click', downloadImage);


// 3. Fő funkciók

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = function(event) {
        originalImage = new Image();
        originalImage.onload = function() {
            canvas.width = originalImage.width;
            canvas.height = originalImage.height;
            
            placeholder.classList.add('hidden');
            canvas.classList.remove('hidden');
            sliderControls.classList.remove('hidden');

            console.log("Kép sikeresen betöltve."); // Hibakereső üzenet
            resetImage();
        }
        originalImage.src = event.target.result;
    }
    
    reader.readAsDataURL(file);
}

function applyFilters() {
    if (!originalImage) {
        console.log("Hiba: Nincs kép, amire szűrőt lehetne alkalmazni.");
        return;
    }

    // === HIBAKERESŐ ÜZENET ===
    // Ennek az üzenetnek minden csúszka-mozdításnál meg kell jelennie
    console.log("applyFilters() lefutott. Fényerő:", brightnessSlider.value);

    // Összeállítjuk a CSS filter string-et
    const brightness = `brightness(${brightnessSlider.value}%)`;
    const contrast = `contrast(${contrastSlider.value}%)`;
    const saturation = `saturate(${saturationSlider.value}%)`;
    const blur = `blur(${blurSlider.value}px)`;
    const sepia = `sepia(${sepiaSlider.value}%)`;
    const grayscale = `grayscale(${grayscaleSlider.value}%)`;

    // Töröljük a vásznat
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Alkalmazzuk a szűrőket a vászon kontextusára
    ctx.filter = `${brightness} ${contrast} ${saturation} ${blur} ${sepia} ${grayscale}`;
    
    // Újrarajzoljuk a képet a szűrőkkel
    ctx.drawImage(originalImage, 0, 0);
}

function resetImage() {
    if (!originalImage) return;

    // Csúszkák visszaállítása
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    blurSlider.value = 0;
    sepiaSlider.value = 0;
    grayscaleSlider.value = 0;

    // Szűrők törlése és kép újrarajzolása
    ctx.filter = 'none';
    ctx.drawImage(originalImage, 0, 0);
    console.log("Kép visszaállítva az eredetire."); // Hibakereső üzenet
}

function downloadImage() {
    if (!originalImage) return;
    const dataUrl = canvas.toDataURL('image/png');
    downloadButton.href = dataUrl;
}
