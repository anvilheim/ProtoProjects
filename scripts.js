const maxSavedColors = 10;

function letterToValue(letter) {
    if (letter === ' ') return 0;
    return letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
}

function nameToColor(firstName, middleName, lastName) {
    const getColorValue = (name) => {
        if (!name) return 0;
        return name.split('').reduce((acc, char) => acc + letterToValue(char), 0) % 256;
    }

    const red = (getColorValue(firstName) * 4) % 256;
    const green = (getColorValue(middleName) * 4) % 256;
    const blue = (getColorValue(lastName) * 4) % 256;

    return {
        color: `rgb(${red}, ${green}, ${blue})`,
        name: `rgb(${red}, ${green}, ${blue})`,
        rgb: `${red},${green},${blue}`,
        borderColor: {
            red: `rgb(${red}, 0, 0)`,
            green: `rgb(0, ${green}, 0)`,
            blue: `rgb(0, 0, ${blue})`
        },
        dripAmount: {
            red: red / 255,
            green: green / 255,
            blue: blue / 255
        }
    };
}

function updateColor() {
    const firstName = document.getElementById('first-name').value.trim();
    const middleName = document.getElementById('middle-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();

    if (!firstName && !lastName) {
        document.getElementById('color-box').style.backgroundColor = '#000';
        document.getElementById('color-name').textContent = '';
        resetDripEffects();
        return;
    }

    const { color, name, borderColor, dripAmount } = nameToColor(firstName, middleName, lastName);
    document.getElementById('color-box').style.backgroundColor = color;
    document.getElementById('color-name').textContent = name;
    document.getElementById('first-name').style.borderColor = borderColor.red;
    document.getElementById('middle-name').style.borderColor = borderColor.green;
    document.getElementById('last-name').style.borderColor = borderColor.blue;

    updateDripEffects('first-name-drip', dripAmount.red);
    updateDripEffects('middle-name-drip', dripAmount.green);
    updateDripEffects('last-name-drip', dripAmount.blue);

    document.getElementById('error-message').textContent = '';
}

function updateDripEffects(dripId, amount) {
    const dripEffect = document.getElementById(dripId);
    const drips = Math.ceil(amount * 10); // Number of drips based on the intensity

    dripEffect.innerHTML = '';
    for (let i = 0; i < drips; i++) {
        const drip = document.createElement('div');
        drip.className = 'drip';
        drip.style.left = `${Math.random() * 100}%`; // Random horizontal position
        drip.style.animationDuration = `${1 + Math.random()}s`; // Random animation duration
        dripEffect.appendChild(drip);
    }

    dripEffect.style.opacity = amount > 0 ? 1 : 0; // Show if there's any color intensity
}

function resetDripEffects() {
    document.getElementById('first-name-drip').innerHTML = '';
    document.getElementById('middle-name-drip').innerHTML = '';
    document.getElementById('last-name-drip').innerHTML = '';
}

function saveColor() {
    const firstName = document.getElementById('first-name').value.trim();
    const middleName = document.getElementById('middle-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();

    if (!firstName || !lastName) {
        document.getElementById('error-message').textContent = 'Please enter at least a first and last name.';
        return;
    }

    const { color, rgb } = nameToColor(firstName, middleName, lastName);
    let savedColors = JSON.parse(localStorage.getItem('savedColors')) || [];

    if (savedColors.length >= maxSavedColors) {
        savedColors.shift(); // Remove the oldest color if the limit is reached
    }

    savedColors.push({ color, rgb });
    localStorage.setItem('savedColors', JSON.stringify(savedColors));
    displaySavedColors();
}

function displaySavedColors() {
    const savedColors = JSON.parse(localStorage.getItem('savedColors')) || [];
    const savedColorsContainer = document.getElementById('saved-colors');
    savedColorsContainer.innerHTML = '';

    savedColors.forEach(({ color, rgb }) => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-item';
        colorDiv.style.backgroundColor = color;

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = `${rgb}`;
        colorDiv.appendChild(tooltip);

        savedColorsContainer.appendChild(colorDiv);
    });
}

document.getElementById('first-name').addEventListener('input', updateColor);
document.getElementById('middle-name').addEventListener('input', updateColor);
document.getElementById('last-name').addEventListener('input', updateColor);

// Initialize display on page load
displaySavedColors();
