// create web audio api context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// are we on a mobile device?
let mobileDevice = false;
if (navigator.userAgent.toLowerCase().indexOf('mobile') > -1) {
    mobileDevice = true;
}

// keyboard
const angloContainer = document.getElementById("anglo-container");
const angloKeyboard = document.getElementById("anglo-keyboard");

// user-defined display options
const opt_layout = document.getElementById("layout");
const opt_drone = document.getElementById("drone");
const droneDiv = document.getElementById("drone-option");
const opt_pushpull = document.getElementById("pushpull");
const opt_push = document.getElementById("push");
const opt_pull = document.getElementById("pull");
let opt_bellows = ""; // stores the value of the selected bellows option from pushpull, push, or pull
const opt_sound = document.getElementById("sound");


// an array that contains all currently-displayed concertina buttons
let buttons = [];

// an array to keep track of all currently-displayed piano notes. Required for arrow key navigation.
const activeNotes = [];

// an array to hold the currently selected notes
const noteSelection = [];

// an array to hold the currently selected buttons
const buttonSelection = [];

// the key that should be selected if the user starts using arrow keys to navigate the keyboard. Not currently used.
let currentIndex = 1;


function renderAngloKeyboard() {
    let layoutnotes = [];
    let allnotes = Object.keys(notes);

    droneDiv.style.display = 'none';
    angloKeyboard.innerHTML = "";
    for (button of buttons) {
        layoutnotes.push(button.push);
        layoutnotes.push(button.pull);
        let pushLabel = button.push;
        let pullLabel = button.pull;
        if (button.drone) {
            droneDiv.style.display = 'block';
            droneclass = "drone";
        }
        if (button.newRow) {
            angloKeyboard.innerHTML += `<br>`;
        }
        if (!(button.drone && !opt_drone.checked)) {
            angloKeyboard.innerHTML += `<div class="button ${opt_bellows}" style="margin-left:${button.x}px"><div class="top ${"o" + noteNames[button.push].substr(-1)}"><button data-number="${button.number + "Push"}" data-note="${noteNames[button.push]}">${pushLabel}</button></div><div class="bottom ${"o" + noteNames[button.pull].substr(-1)}"><button data-number="${button.number + "Pull"}" data-note="${noteNames[button.pull]}">${pullLabel}</button></div></div>`;
        }
    }
    bindAngloButtons();

    // find the lowest and highest notes (may be useful later)
    let min = allnotes.indexOf(layoutnotes[0]);
    let max = allnotes.indexOf(layoutnotes[0]);
    for (let i = 1; i < layoutnotes.length; i++) {
        if (allnotes.indexOf(noteNames[layoutnotes[i]]) < min) {
            min = allnotes.indexOf(noteNames[layoutnotes[i]]);
        } else if (allnotes.indexOf(noteNames[layoutnotes[i]]) > max) {
            max = allnotes.indexOf(noteNames[layoutnotes[i]]);
        }
    }

    selectDrone();
}



function selectConcertinaButtons() {
    for (button of angloKeyboard.children) {
        for (div of button.children) {
            for (note of div.children) {
                if (noteSelection.includes(note.dataset.note)) {
                    note.classList.add("selected");
                } else {
                    note.classList.remove("selected");
                }
            }
        }
    }
}


function togglePushView() {
    renderAngloKeyboard();
    for (button of angloKeyboard.children) {
        button.classList.remove("pull-only");
        button.classList.add("push-only");
    }
    opt_bellows = "push-only";
}

function togglePullView() {
    renderAngloKeyboard();
    for (button of angloKeyboard.children) {
        button.classList.remove("push-only");
        button.classList.add("pull-only");
    }
    opt_bellows = "pull-only";
}

function resetView() {
    renderAngloKeyboard();
    for (button of angloKeyboard.children) {
        button.classList.remove("push-only");
        button.classList.remove("pull-only");
    }
    opt_bellows = "";
}

function selectDrone() {
    if (!opt_drone.checked && document.getElementsByClassName("drone")[0]) {
        document.getElementsByClassName("drone")[0].style.display = 'none';
    } else if (document.getElementsByClassName("drone")[0]) {
        document.getElementsByClassName("drone")[0].style.display = 'block';
    }
}


function updateNoteSelection(note) {
    if (!noteSelection.includes(note) && (noteSelection.length == 0)) {
        // console.log("selecting single note");
        noteSelection.push(note);
    } else if (!noteSelection.includes(note)) {
        // console.log("case 2");
        noteSelection.length = 0;
        noteSelection.push(note);
    } else {
        // console.log("removing note");
        noteSelection.splice(noteSelection.indexOf(note), 1);
    }
    selectConcertinaButtons();
}


function playNote(note) {
    if (opt_sound.checked) {
        let oscillator;
        let gainNode = audioCtx.createGain(); // prerequisite for making the volume adjustable
        let freq = notes[note];
        let fullVolume = 0;
        if (noteSelection.length) {
            fullVolume = -1 + 1 / noteSelection.length // avoid the utter cracklefest on webkit and mobile browsers
        }
        // console.debug(note + " (" + freq + " Hz)");
        oscillator = audioCtx.createOscillator(); // create Oscillator node
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz
        oscillator.connect(audioCtx.destination);
        oscillator.connect(gainNode); // connect the volume control to the oscillator
        gainNode.connect(audioCtx.destination);
        gainNode.gain.setValueAtTime(-1, audioCtx.currentTime); // set the volume to -1 when the note first starts playing
        gainNode.gain.linearRampToValueAtTime(fullVolume, audioCtx.currentTime + 0.01); // linearly increase to full volume in 0.1 seconds
        gainNode.gain.linearRampToValueAtTime(-1, audioCtx.currentTime + 0.5); // fade the volume all the way out in 0.5 seconds
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
    }
}

function playSelection() {
    noteSelection.forEach((note) => {
        playNote(note);
    });
}

function moveLeft() {
    if (currentIndex > 0 && currentMode == "view") {
        currentIndex--;
        noteSelection.length = 0;
        updateNoteSelection(activeNotes[currentIndex]);
        playNote(activeNotes[currentIndex]);
    }
}

function moveRight() {
    if (currentIndex < activeNotes.length - 1 && currentMode == "view") {
        currentIndex++;
        noteSelection.length = 0;
        updateNoteSelection(activeNotes[currentIndex]);
        playNote(activeNotes[currentIndex]);
    }
}


// should rewrite this to use proper event delegation at some point
function bindAngloButtons() {
    let touch = false; // helps detect long-presses
    let allbuttons = document.querySelectorAll("#anglo-keyboard button");

    allbuttons.forEach((button) => button.addEventListener((mobileDevice ? 'touchstart' : 'mousedown'), (e) => {
        touch = true
        setTimeout(() => {
            if (touch) {
                // multiselect.checked = true;
                if (!noteSelection.includes(e.target.dataset.note)) {
                    playNote(e.target.dataset.note);
                }
                currentIndex = activeNotes.indexOf(e.target.dataset.note);
                updateNoteSelection(e.target.dataset.note);
                // multiselect.checked = false;
                touch = false
            }
        }, "400");
    }));

    allbuttons.forEach((button) => button.addEventListener((mobileDevice ? 'touchend' : 'mouseup'), (e) => {
        if (touch) {
            touch = false;
            if (!noteSelection.includes(e.target.dataset.note)) {
                playNote(e.target.dataset.note);
            }
            currentIndex = activeNotes.indexOf(e.target.dataset.note);
            updateNoteSelection(e.target.dataset.note);
        }
    }));

    allbuttons.forEach((button) => {
        button.addEventListener((mobileDevice ? 'touchmove' : 'mouseout'), (e) => {
            touch = false;
        });
    });

}


function selectLayout() {
    buttons = LAYOUTS[opt_layout.value].layout;
    renderAngloKeyboard();
    opt_layout.blur();
}



opt_layout.addEventListener("change", () => {
    selectLayout();
});

opt_pushpull.addEventListener("change", () => {
    resetView();
});
opt_push.addEventListener("change", () => {
    togglePushView();
});
opt_pull.addEventListener("change", () => {
    togglePullView();
});

opt_drone.addEventListener("change", () => {
    renderAngloKeyboard();
});


document.addEventListener('keydown', function (e) {
    // console.log(e.code);
    if (e.code == "ArrowRight") {
        moveRight();
    } else if (e.code == "ArrowLeft") {
        moveLeft();
    } else if (e.code == "Escape") {
        closeModal();
    }
})



// about modal
document.getElementById("about").onclick = function () {
    document.getElementById("about-modal").style.display = "block";
}

// keyboard controls modal
document.getElementById("keyboardShortcutsBtn").onclick = function () {
    document.getElementById("keyboard-shortcuts-modal").style.display = "block";
}

function closeModal() {
    [...document.getElementsByClassName("modal")].forEach((element) => element.style.display = "none");
    [...document.querySelectorAll(".modal .error-text")].forEach((element) => element.style.visibility = "hidden");
    [...document.querySelectorAll(".modal .success-text")].forEach((element) => element.style.visibility = "hidden");
}

window.onclick = function (event) {
    if (event.target.className == "modal") {
        closeModal();
    }
}


// stuff to do when the page is loaded
function init() {
    if (!mobileDevice) {
        keyboardShortcutsBtn.style.display = "block"
    }
    selectLayout();
}

init();
