const url = "https://www.thecolorapi.com/scheme?rgb={VALUE}&mode=analogic&count=5";

const http = new XMLHttpRequest();
let isGettingData = false;

http.onreadystatechange = _ => {
	if (http.readyState == 4) {
        if (http.status == 200) {
            var palette = JSON.parse(http.responseText).colors;

            // Otrzymujemy 5 kolorów
            for (let i = 1; i <= 5; i++) {
                const color = palette[i - 1];
                
                // Ustawiamy kontrast tekstu
                setTextContrast(document.querySelector(`.color-${i} span`), color.rgb);

                // Ustawiamy kolor i tekst
                document.querySelector(`.color-${i}`).style.backgroundColor = color.hex.value;
                document.querySelector(`.color-${i} span`).innerHTML = color.hex.value;
            }
            
            // Ustawiamy kontrast pozostałego tekstu
            setTextContrast(document.querySelector(`header`), palette[2].rgb);
            setTextContrast(document.querySelector(`footer`), palette[2].rgb);
        }

        isGettingData = false;
    } 
}

// Dodajemy event obsługujący wysłanie żądania do API na kliknięcie
document.querySelector('body').addEventListener('click', _ => {
    if (isGettingData) { return; }
    isGettingData = true;

    if (tutorialTimeout) {
        clearTimeout(tutorialTimeout);
        tutorialTimeout = undefined;
    }

    document.querySelector('.info').classList.remove('show')

    const targetUrl = url.replace('{VALUE}', getRandomColor());
    http.open("GET", targetUrl, true);
    http.send();
});

// Funkcja ustawiająca kolor tekstu dla danego RGB
function setTextContrast(target, rgb) {
    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round(((parseInt(rgb.r) * 299) +
                        (parseInt(rgb.g) * 587) +
                        (parseInt(rgb.b) * 114)) / 1000);
    const textColor = (brightness > 125) ? 'black' : 'white';
    target.style.color = textColor;
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `${r},${g},${b}`;
}

// Pierwszy request (automatyczny)
isGettingData = true;
const targetUrl = url.replace('{VALUE}', getRandomColor());
http.open("GET", targetUrl, true);
http.send();

// Tutorial
tutorialTimeout = setTimeout(_ => document.querySelector('.info').classList.add('show'), 600);