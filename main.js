const url = "http://colormind.io/api/";
const data = {
	model : "default",
	input : ["N","N","N","N","N"]
}

const http = new XMLHttpRequest();
let isGettingData = false;

http.onreadystatechange = _ => {
	if (http.readyState == 4) {
        if (http.status == 200) {
            var palette = JSON.parse(http.responseText).result;

            // Otrzymujemy 5 kolorów
            for (let i = 1; i <= 5; i++) {
                const color = palette[i - 1];
                const hex = '#' + color.map(v => v.toString(16).padStart(2, '0')).join('');
                
                // Ustawiamy kontrast tekstu
                setTextContrast(document.querySelector(`.color-${i} span`), color);

                // Ustawiamy kolor i tekst
                document.querySelector(`.color-${i}`).style.backgroundColor = hex;
                document.querySelector(`.color-${i} span`).innerHTML = hex;
            }
            
            // Ustawiamy kontrast pozostałego tekstu
            setTextContrast( document.querySelector(`header`), palette[2]);
            setTextContrast( document.querySelector(`footer`), palette[2]);
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

    http.open("POST", url, true);
    http.send(JSON.stringify(data));
});

// Funkcja ustawiająca kolor tekstu dla danego RGB
function setTextContrast(target, rgb) {
    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round(((parseInt(rgb[0]) * 299) +
                        (parseInt(rgb[1]) * 587) +
                        (parseInt(rgb[2]) * 114)) / 1000);
    const textColor = (brightness > 125) ? 'black' : 'white';
    target.style.color = textColor;
}

// Pierwszy request (automatyczny)
isGettingData = true;
http.open("POST", url, true);
http.send(JSON.stringify(data));

// Tutorial
tutorialTimeout = setTimeout(_ => document.querySelector('.info').classList.add('show'), 600);