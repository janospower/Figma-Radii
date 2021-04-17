// Global
const tabs = document.querySelectorAll('.tabs .section-title');
const Smoothing = document.querySelector('#smoothing');
const Snap = document.querySelector('#snap');

tabs.forEach(tab => {
    tab.addEventListener('mousedown', e => {
        activateTab(tab);
    });
});

function activateTab(tab) {
    tabs.forEach(element => {
        element.classList.add('inactive');
        document.querySelector(`#${element.id}-container`).classList.add('hidden');
    });
    tab.classList.remove('inactive');
    document.querySelector(`#${tab.id}-container`).classList.remove('hidden');
}

onmessage = (event) => {
    switch (event.data.pluginMessage.type) {
        case 'selectionChange':
            event.data.pluginMessage.value ? selection = true : selection = false;
            smoothingCheckApply();
            snapCheckApply();
            break;

        case 'modeChange':
            activateTab( document.querySelector( `#${event.data.pluginMessage.value}` ) );
            break;
    
        default:
            break;
    }
}

// snapping
const radii = document.querySelector('#radii');
const radiusOriginal = document.querySelector('#radius-original');
const addRadiusButton = document.querySelector('#add-radius');

const snapApply = document.querySelector('#snapApply');
const snapApplyToSelection = document.querySelector('#snapApplyToSelection');

let count = 0;
let radiusValues = [];
let radiusValuesPopulated = false;

snapApplyToSelection.onchange = () => { snapCheckApply() };

snapApply.onclick = () => {
    parent.postMessage({ pluginMessage: { 
        'type': 'snap', 
        'selection': snapApplyToSelection.checked,
        'values': radiusValues
    } }, '*');
}

addRadiusButton.onclick = () => {
    addRadius();
    snapCheckApply();
}

function addRadius() {
    radiusValuesPopulated = true;

    let currentCount = count;
    radiusValues.push('0');
    let radiusNew = radiusOriginal.cloneNode( true );
    radiusNew.setAttribute( 'id', `radius-${currentCount}` );
    radiusNew.classList.remove('hidden');
    radii.append(radiusNew);

    let input = radiusNew.querySelector('input');
    input.oninput = () => {
        radiusValues[currentCount] = input.value;

        snapCheckApply();
    }

    let remove = radiusNew.querySelector('.remove-button');
    remove.onclick = () => {
        radiusValues[currentCount] = false;
        radii.querySelector(`#radius-${currentCount}`).remove();


        radiusValuesPopulated = false;
        radiusValues.forEach(value => {
            radiusValuesPopulated = radiusValuesPopulated || value;
        });

        snapCheckApply();
    }

    count++;
}

function snapCheckApply() {
    snapApplicable = radiusValuesPopulated && !snapApplyToSelection.checked || radiusValuesPopulated && selection;
    snapApply.disabled = !snapApplicable;
}

// smoothing

//vars
const smoothingSelectValue = document.querySelector('#smoothingSelectValue');
const smoothingSelectValueContainer = document.querySelector('#smoothingSelectValueContainer');
const smoothingCustomValue = document.querySelector('#smoothingCustomValue');
const smoothingCustomValueContainer = document.querySelector('#smoothingCustomValueContainer');

const customvalueSwitch = document.querySelector('#customvalueSwitch');

const smoothingApplyToSelection = document.querySelector('#smoothingApplyToSelection');
const smoothingApply = document.querySelector('#smoothingApply');

var selection = false;
var validInput = true;
var smoothingApplicable = true;


//on load function
document.addEventListener("DOMContentLoaded", function() {
    formValidation();
});

//initialize select menu
selectMenu.init();
smoothingCheckApply();


//event listeners


customvalueSwitch.onchange = () => { 
    smoothingSelectValueContainer.classList.toggle('hidden');
    smoothingCustomValueContainer.classList.toggle('hidden');

    customvalueSwitch.checked ? formValidation() : validInput = true;

    smoothingCheckApply();
}

smoothingApplyToSelection.onchange = () => { smoothingCheckApply(); }

smoothingCustomValue.oninput = () => { formValidation(); }

smoothingCustomValue.addEventListener('blur', (event) => {
    smoothingCustomValue.value = fixValue(smoothingCustomValue.value);
});

smoothingCustomValue.addEventListener('keydown', (event) => {
    if ( event.key === 'Enter' ) {
        sendSmoothing();
        smoothingCustomValue.value = fixValue(smoothingCustomValue.value);
    }
});

smoothingApply.onclick = () => { 
    sendSmoothing();
}


//form validation
var formValidation = function(event) {
    if ( 0 <= smoothingCustomValue.value && smoothingCustomValue.value <= 100 ) {
        validInput = true;
    } else {
        validInput = false;
    }
    smoothingCheckApply();
}



//functions

function smoothingCheckApply() {
    smoothingApplicable = selection && validInput || !smoothingApplyToSelection.checked && validInput
    smoothingApply.disabled = !smoothingApplicable;
}

function fixValue(val, min = 0, max = 100) {
    if ( val < min || isNaN(val) ) {
        val = min
    }
    else if ( val > max ) {
        val = max
    }
    return val;
}

function sendSmoothing() {
    var value = customvalueSwitch.checked ? smoothingCustomValue.value : smoothingSelectValue.value
    value = fixValue(value);
    if (value === '') {
        value = 0;
    }

    parent.postMessage({ pluginMessage: { 
        'type': 'smooth', 
        'selection': smoothingApplyToSelection.checked,
        'value': value
    } }, '*');
}