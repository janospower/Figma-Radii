//vars
const smoothingSelectValue = document.querySelector('#smoothingSelectValue');
const smoothingSelectValueContainer = document.querySelector('#smoothingSelectValueContainer');
const smoothingCustomValue = document.querySelector('#smoothingCustomValue');
const smoothingCustomValueContainer = document.querySelector('#smoothingCustomValueContainer');
const cornerSmoothingSwitch = document.querySelector('#cornerSmoothingSwitch');
const autoApply = document.querySelector('#autoApply');
const apply = document.querySelector('#apply');


//on load function
document.addEventListener("DOMContentLoaded", function() {
    formValidation();
});

//initialize select menu
selectMenu.init();

//event listeners
cornerSmoothingSwitch.onchange = () => { 
    smoothingSelectValueContainer.classList.toggle('hidden');
    smoothingCustomValueContainer.classList.toggle('hidden');
}






// old
const createShapesButton = document.querySelector('#createShapes');
const cancelButton = document.querySelector('#cancel');
const shapeMenu = document.querySelector('#shape');
const countInput = document.querySelector('#count');

//event listeners
countInput.oninput = () => { formValidation(); }
shapeMenu.onchange = () => { formValidation(); }
createShapesButton.onclick = () => { createShapes(); }
cancelButton.onclick = () => { cancel(); }

//form validation
var formValidation = function(event) {

    if (shapeMenu.value === '' || countInput.value === '') {
        createShapesButton.disabled = true;
    } else {
        createShapesButton.disabled = false;
    }
}



//functions
function createShapes() {
    parent.postMessage({ pluginMessage: { 
        'type': 'create-shapes', 
        'count': countInput.value,
        'shape': shapeMenu.value
    } }, '*');
}

function cancel() {
    parent.postMessage({ pluginMessage: { 'type': 'cancel' } }, '*')
}