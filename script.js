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
const grayscaleSlider = document.getElementById('grayscale'); // <-- ÚJ

const resetButton = document.getElementById('resetButton');
const downloadButton = document.getElementById('downloadButton');

// Globális változó az eredeti kép tárolására
let originalImage = null;

// 2. Eseményfigyelők

// Kép feltöltése
uploadInput.addEventListener('change', handleImageUpload);

// Csúszkák figyelése (az 'input' esemény azonnali frissítést ad)
brightnessSlider.addEventListener('input', applyFilters);
contrastSlider.addEventListener('input', applyFilters);
saturationSlider.addEventListener('input', applyFilters);
blurSlider.addEventListener('input', applyFilters);
sepiaSlider.addEventListener('input', applyFilters);
grayscaleSlider.addEventListener('input', applyFilters); // <-- ÚJ

// Gombok
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
            // Beállítjuk a vászon méretét a kép méretére
            canvas.width = originalImage.width;
            canvas.height = originalImage.height;
            
            // Eltüntetjük a placeholder szöveget
            placeholder.classList.add('hidden');
            canvas.classList.remove('hidden');

            // Megjelenítjük a csúszkákat
            sliderControls.classList.remove('hidden');

            // Alaphelyzetbe állítjuk a csúszkákat és kirajzoljuk a képet
            resetImage();
        }
        originalImage.src = event.target.result;
    }
    
    reader.readAsDataURL(file);
}

function applyFilters() {
    if (!originalImage) return;

    // Összeállítjuk a CSS filter string-et
    const brightness = `brightness(${brightnessSlider.value}%)`;
    const contrast = `contrast(${contrastSlider.value}%)`;
    const saturation = `saturate(${saturationSlider.value}%)`;
    const blur = `blur(${blurSlider.value}px)`;
    const sepia = `sepia(${sepiaSlider.value}%)`;
    const grayscale = `grayscale(${grayscaleSlider.value}%)`; // <-- ÚJ

    // Töröljük a vásznat
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Alkalmazzuk a szűrőket a vászon kontextusára
    ctx.filter = `${brightness} ${contrast} ${saturation} ${blur} ${sepia} ${grayscale}`; // <-- ÚJ
    
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
    grayscaleSlider.value = 0; // <-- ÚJ

    // Szűrők törlése és kép újrarajzolása
    ctx.filter = 'none';
    ctx.drawImage(originalImage, 0, 0);
}

function downloadImage() {
    if (!originalImage) return;

    // Létrehozunk egy linket a vászon tartalmából (adott állapotában)
    const dataUrl = canvas.toDataURL('image/png');
    
    // Beállítjuk a letöltő gomb (ami egy <a> tag) 'href' attribútumát
    // A böngésző innentől tudja, hogy a kattintás egy letöltés
    downloadButton.href = dataUrl;
}
