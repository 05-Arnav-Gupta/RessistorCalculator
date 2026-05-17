const colourValues = {
    0: {name: "Black", value: '#000000'},
    1: {name: "Brown", value: '#7e4b29'},
    2: {name: "Red", value: '#f80217'},
    3: {name: "Orange", value: '#fd9822'},
    4: {name: "Yellow", value: '#fefe30'},
    5: {name: "Green", value: '#11b053'},
    6: {name: "Blue", value: '#1050ce'},
    7: {name: "Violet", value: '#9910fb'},
    8: {name: "Grey", value: '#a7a6a4'},
    9: {name: "White", value: '#FFFFFF'},
    10: {name: "Gold", value: '#fed601'},
    11: {name: "Silver", value: '#C0C0C0'}
}

const toleranceValues = {
    1: "±1%",
    2: "±2%",
    3: "±0.5%",
    4: "±0.2%",
    5: "±0.5%",
    6: "±0.25%",
    7: "±0.1%",
    8: "±0.01%",
    10: "±5%",
    11: "±10%"
};

const digitColors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const multiplierColors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const toleranceColors = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11];

let selectedBand = null;
let bandValues = [null, null, null, null, null];

function toggleBand(bandNumber) {
    if(selectedBand && selectedBand !== bandNumber) document.getElementById(`ResBand${selectedBand}`).classList.remove("resistor-band-selected");
    if(selectedBand === bandNumber) {
        document.getElementById('colorSelector').classList.add("d-none");
        document.getElementById(`ResBand${bandNumber}`).classList.remove("resistor-band-selected");
        selectedBand = null;
        return;
    }
    selectedBand = bandNumber;
    document.getElementById(`ResBand${bandNumber}`).classList.add("resistor-band-selected");
    buildColorSelector();
    document.getElementById('colorSelector').classList.remove("d-none");
}

function selectColor(colorIndex) {
    bandValues[selectedBand - 1] = colorIndex;
    buildColorSelector();
    const band = document.getElementById(`ResBand${selectedBand}`)
    if(colorIndex != null) {
        band.style.backgroundColor = colourValues[colorIndex].value;
        band.classList.remove("resistor-transparent");
    }
    else {
        band.style.backgroundColor = '';
        band.classList.add("resistor-transparent");
    }
    displayResult();
    return;
}

function buildColorBox(index) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('text-center');

    const colorBox = document.createElement('div');
    colorBox.classList.add('color-box', 'border', 'border-white', 'border-3', 'rounded');
    if(index === bandValues[selectedBand - 1]) colorBox.classList.add('color-box-selected');
    colorBox.style.backgroundColor = colourValues[index].value;
    colorBox.onclick = () => selectColor(index);

    const textLabel = document.createElement('p');
    textLabel.classList.add('text-white', 'mt-2', 'mb-0');
    textLabel.textContent = colourValues[index].name;
    wrapper.appendChild(colorBox);
    wrapper.appendChild(textLabel);

    return wrapper;
}

function buildNoColorBox() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('text-center');

    const colorBox = document.createElement('div');
    colorBox.classList.add('color-box', 'border', 'border-white', 'border-3', 'rounded');
    if(bandValues[selectedBand - 1] === null) colorBox.classList.add('color-box-selected');
    // colorBox.style.width = '100%';
    // colorBox.style.height = '100%';
    colorBox.style.background = 'repeating-linear-gradient(45deg, transparent, transparent 6px, white 6px, white 12px)';
    colorBox.borderRadius = 'inherit';
    colorBox.onclick = () => selectColor(null);

    const textLabel = document.createElement('p');
    textLabel.classList.add('text-white', 'mt-2', 'mb-0');
    textLabel.textContent = 'None';
    wrapper.appendChild(colorBox);
    wrapper.appendChild(textLabel);

    return wrapper;
}

function buildColorSelector() {
    if(!selectedBand) return;
    const colorSelector = document.getElementById('colorSelector');
    colorSelector.innerHTML = '';
    let colorsToShow = [];
    if(selectedBand === 1 || selectedBand === 2) colorsToShow = digitColors;
    if(selectedBand === 3 && bandValues[3] === null) colorsToShow = multiplierColors;
    else if(selectedBand === 3) colorsToShow = digitColors;
    if(selectedBand === 4) colorsToShow = multiplierColors
    if(selectedBand === 5) colorsToShow = toleranceColors;

    colorSelector.appendChild(buildNoColorBox());
    colorsToShow.forEach(colorIndex => {
        const colorBox = buildColorBox(colorIndex);
        colorSelector.appendChild(colorBox);
    });
}

function calculateResistance() {
    if(bandValues[0] === null || bandValues[1] === null || bandValues[2] === null) return NaN;
    const baseValue = (bandValues[0] * 10) + bandValues[1];
    if(bandValues[3] === null) return baseValue * Math.pow(10, bandValues[2]);
    if(bandValues[2] > 9) return NaN;
    multiplier = Math.pow(10, bandValues[3]);
    return (baseValue * 10 + bandValues[2]) * multiplier;
}

function calculateTolerance() {
    if(bandValues[4] === null) return null;
    return toleranceValues[bandValues[4]];
}

function convertToUnits(value) {
    if (isNaN(value)) return '??';
    const units = ['Ω', 'kΩ', 'MΩ', 'GΩ'];
    let idx = 0;
    while (value >= 1000 && idx < units.length - 1) {
        value = value / 1000;
        idx++;
    }
    return value.toFixed(2) + ' ' + units[idx];
}

function displayResult() {
    const resistance = calculateResistance();
    const tolerance = calculateTolerance();

    const resistanceResult = document.getElementById('resistance-value');
    const toleranceResult = document.getElementById('tolerance-value');

    resistanceResult.textContent = convertToUnits(resistance);

    if (tolerance) toleranceResult.textContent = tolerance;
    else toleranceResult.textContent = '??';
}