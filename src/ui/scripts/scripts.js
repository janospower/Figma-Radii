//vars
const tabSmooth = document.querySelector('#tabSmooth');
const tabSelect = document.querySelector('#tabSelect');

const smoothingSelectValue = document.querySelector('#smoothingSelectValue');
const smoothingSelectValueContainer = document.querySelector('#smoothingSelectValueContainer');
const smoothingCustomValue = document.querySelector('#smoothingCustomValue');
const smoothingCustomValueContainer = document.querySelector('#smoothingCustomValueContainer');

const customvalueSwitch = document.querySelector('#customvalueSwitch');

const smoothingApplyToSelection = document.querySelector('#smoothingApplyToSelection');
const smoothingApply = document.querySelector('#smoothingApply');

var selection = false;
var validInput = true;
var applicable = true;


//on load function
document.addEventListener("DOMContentLoaded", function() {
    formValidation();
});

//initialize select menu
selectMenu.init();
checkApply();


//event listeners
onmessage = (event) => {
    switch (event.data.pluginMessage.type) {
        case 'selectionChange':
            event.data.pluginMessage.value ? selection = true : selection = false;
            checkApply();
            break;
    
        default:
            break;
    }
}

customvalueSwitch.onchange = () => { 
    smoothingSelectValueContainer.classList.toggle('hidden');
    smoothingCustomValueContainer.classList.toggle('hidden');

    customvalueSwitch.checked ? formValidation() : validInput = true;

    checkApply();
}

smoothingApplyToSelection.onchange = () => { checkApply(); }

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
    checkApply();
}



//functions

function checkApply() {
    applicable = selection && validInput || !smoothingApplyToSelection.checked && validInput
    smoothingApply.disabled = !applicable;

    parent.postMessage({ pluginMessage: { 
        'type': 'applicable', 
        'value': applicable
    } }, '*');

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