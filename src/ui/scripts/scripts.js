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
            event.data.pluginMessage.val ? selection = true : selection = false;
            smoothingCheckApply();
            snapCheckApply();
            break;

        case 'modeChange':
            activateTab( document.querySelector( `#${event.data.pluginMessage.val}` ) );
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
let radiusvals = [];
let radiusvalsPopulated = false;

snapApplyToSelection.onchange = () => { snapCheckApply() };

snapApply.onclick = () => {
    parent.postMessage({ pluginMessage: { 
        'type': 'snap', 
        'selection': snapApplyToSelection.checked,
        'vals': radiusvals
    } }, '*');
}

addRadiusButton.onclick = () => {
    addRadius();
    snapCheckApply();
}

function addRadius() {
    radiusvalsPopulated = true;

    let currentCount = count;
    radiusvals.push('0');
    let radiusNew = radiusOriginal.cloneNode( true );
    radiusNew.setAttribute( 'id', `radius-${currentCount}` );
    radiusNew.classList.remove('hidden');
    radii.append(radiusNew);

    let input = radiusNew.querySelector('input');
    input.oninput = () => {
        radiusvals[currentCount] = input.val;

        snapCheckApply();
    }

    let remove = radiusNew.querySelector('.remove-button');
    remove.onclick = () => {
        radiusvals[currentCount] = false;
        radii.querySelector(`#radius-${currentCount}`).remove();


        radiusvalsPopulated = false;
        radiusvals.forEach(val => {
            radiusvalsPopulated = radiusvalsPopulated || val;
        });

        snapCheckApply();
    }

    count++;
}

function snapCheckApply() {
    snapApplicable = radiusvalsPopulated && !snapApplyToSelection.checked || radiusvalsPopulated && selection;
    snapApply.disabled = !snapApplicable;
}

// smoothing

//vars
const smoothingSelectval = document.querySelector('#smoothingSelectval');
const smoothingSelectvalContainer = document.querySelector('#smoothingSelectvalContainer');
const smoothingCustomval = document.querySelector('#smoothingCustomval');
const smoothingCustomvalContainer = document.querySelector('#smoothingCustomvalContainer');

const customvalSwitch = document.querySelector('#customvalSwitch');

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


customvalSwitch.onchange = () => { 
    smoothingSelectvalContainer.classList.toggle('hidden');
    smoothingCustomvalContainer.classList.toggle('hidden');

    customvalSwitch.checked ? formValidation() : validInput = true;

    smoothingCheckApply();
}

smoothingApplyToSelection.onchange = () => { smoothingCheckApply(); }

smoothingCustomval.oninput = () => { formValidation(); }

smoothingCustomval.addEventListener('blur', (event) => {
    smoothingCustomval.val = fixval(smoothingCustomval.val);
});

smoothingCustomval.addEventListener('keydown', (event) => {
    if ( event.key === 'Enter' ) {
        sendSmoothing();
        smoothingCustomval.val = fixval(smoothingCustomval.val);
    }
});

smoothingApply.onclick = () => { 
    sendSmoothing();
}


//form validation
var formValidation = function(event) {
    if ( 0 <= smoothingCustomval.val && smoothingCustomval.val <= 100 ) {
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

function fixval(val, min = 0, max = 100) {
    if ( val < min || isNaN(val) ) {
        val = min
    }
    else if ( val > max ) {
        val = max
    }
    return val;
}

function sendSmoothing() {
    var val = customvalSwitch.checked ? smoothingCustomval.val : smoothingSelectval.val
    val = fixval(val);
    if (val === '') {
        val = 0;
    }

    parent.postMessage({ pluginMessage: { 
        'type': 'smooth', 
        'selection': smoothingApplyToSelection.checked,
        'val': val
    } }, '*');
}