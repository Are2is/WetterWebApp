const apiKey = '1164ef953db441c9d825bcf97e529b7f';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

document.addEventListener('DOMContentLoaded', () => {
    async function fetchWeather(city, country) {
        try {
            const response = await fetch(`${apiUrl}?q=${city},${country}&units=metric&lang=de&appid=${apiKey}`);
            const data = await response.json();

            if (!data || data.cod !== 200) {
                throw new Error("Fehler beim Abrufen der Wetterdaten.");
            }

            const location = `${data.name}, ${data.sys.country}`;
            const temperature = Math.round(data.main.temp);
            const description = data.weather[0].description;
            const icon = data.weather[0].icon;
            const sunset = data.sys.sunset;
            const currentTime = Math.floor(Date.now() / 1000);
            const isDay = currentTime < sunset;
            const darkness = isDay ? 'Tag' : 'Nacht';

            const iconMap = {
                'klarer Himmel': 'icons/clear-day.jpg',
                'bewölkt': 'icons/cloudy.jpg',
                'leichter Regen': 'icons/rainy.jpg',
                'Regen': 'icons/rainy.jpg',
                'Schnee': 'icons/snowy.jpg',
            };
            const customIcon = iconMap[description] || 'icons/default.jpg';

            updateUI(location, temperature, description, darkness, customIcon);
        } catch (error) {
            console.error('Fehler beim Abrufen der Wetterdaten:', error);
            alert('Es gab ein Problem beim Abrufen der Wetterdaten. Bitte versuche es später erneut.');
        }
    }

    function updateUI(location, temperature, description, darkness, customIcon) {
        const locationElement = document.getElementById('location');
        const temperatureElement = document.getElementById('temperature');
        const descriptionElement = document.getElementById('description');
        const darknessElement = document.getElementById('darkness');
        const weatherIcon = document.getElementById('weather-icon');

        if (locationElement) locationElement.textContent = location;
        if (temperatureElement) temperatureElement.textContent = `${temperature}°`;
        if (descriptionElement) descriptionElement.textContent = description;
        if (darknessElement) darknessElement.textContent = `Es ist momentan ${darkness}.`;
        if (weatherIcon) {
            weatherIcon.setAttribute('src', customIcon);
            weatherIcon.onerror = () => {
                console.error("Das Bild konnte nicht geladen werden:", customIcon);
                weatherIcon.setAttribute('src', 'icons/default.jpg');
            };
        }
    }

    fetchWeather('Karlsruhe', 'DE');

    document.getElementById('getWeather').addEventListener('click', () => {
        const city = document.getElementById('city').value;
        const country = document.getElementById('country').value;

        if (city && country) {
            fetchWeather(city, country);
        } else {
            alert('Bitte gib sowohl die Stadt als auch das Land ein.');
        }
    });

    setInterval(() => {
        const jetzt = new Date();
        const stunden = String(jetzt.getHours()).padStart(2, '0');
        const minuten = String(jetzt.getMinutes()).padStart(2, '0');
        document.getElementById('uhrzeit').textContent = `${stunden}:${minuten} Uhr`;
    }, 1000);

    function zeigeDatum() {
        const jetzt = new Date();
        const wochentage = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
        const wochenTag = wochentage[jetzt.getDay()];

        const tag = jetzt.getDate();
        const monat = jetzt.getMonth();
        const jahre = jetzt.getFullYear();
        const monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
        const datumString = `${tag}. ${monate[monat]} ${jahre}`;

        document.getElementById("wochentag").textContent = wochenTag;
        document.getElementById("datum").textContent = datumString;
    }

    zeigeDatum();
});
