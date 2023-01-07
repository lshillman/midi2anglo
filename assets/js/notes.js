// note frequencies in HZ
const notes = {
    "D2": 73.42, "D#2": 77.78, "E2": 82.41, "F2": 87.31, "F#2": 92.5, "G2": 98, "G#2": 103.83, "A2": 110, "Bb2": 116.54, "B2": 123.47, "C3": 130.81, "C#3": 138.59, "D3": 146.83, "D#3": 155.56, "E3": 164.81, "F3": 174.61, "F#3": 185, "G3": 196, "G#3": 207.65, "A3": 220, "Bb3": 233.08, "B3": 246.94, "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63, "F4": 349.23, "F#4": 369.99, "G4": 392, "G#4": 415.3, "A4": 440, "Bb4": 466.16, "B4": 493.88, "C5": 523.25, "C#5": 554.37, "D5": 587.33, "D#5": 622.25, "E5": 659.25, "F5": 698.46, "F#5": 739.99, "G5": 783.99, "G#5": 830.61, "A5": 880, "Bb5": 932.33, "B5": 987.77, "C6": 1046.5, "C#6": 1108.73, "D6": 1174.66, "D#6": 1244.51, "E6": 1318.51, "F6": 1396.91, "F#6": 1479.98, "G6": 1567.98, "G#6": 1661.22, "A6": 1760, "Bb6": 1864.66, "B6": 1975.53, "C7": 2093, "C#7": 2217.46, "D7": 2349.32
};

const noteNames = {
    "D2": "D2", "D#2": "D#2", "E2": "E2", "F2": "F2", "F#2": "F#2", "G2": "G2", "G#2": "G#2", "A2": "A2", "Bb2": "Bb2", "B2": "B2", "C3": "C3", "C#3": "C#3", "D3": "D3", "D#3": "D#3", "E3": "E3", "F3": "F3", "F#3": "F#3", "G3": "G3", "G#3": "G#3", "A3": "A3", "Bb3": "Bb3", "B3": "B3", "C4": "C4", "C#4": "C#4", "D4": "D4", "D#4": "D#4", "E4": "E4", "F4": "F4", "F#4": "F#4", "G4": "G4", "G#4": "G#4", "A4": "A4", "Bb4": "Bb4", "B4": "B4", "C5": "C5", "C#5": "C#5", "D5": "D5", "D#5": "D#5", "E5": "E5", "F5": "F5", "F#5": "F#5", "G5": "G5", "G#5": "G#5", "A5": "A5", "Bb5": "Bb5", "B5": "B5", "C6": "C6", "C#6": "C#6", "D6": "D6", "D#6": "D#6", "E6": "E6", "F6": "F6", "F#6": "F#6", "G6": "G6", "G#6": "G#6", "A6": "A6", "Bb6": "Bb6", "B6": "B6", "C7": "C7", "C#7": "C#7", "D7": "D7", "Eb2": "D#2", "Gb2": "F#2", "Ab2": "G#2", "A#2": "Bb2", "Db3": "C#3", "Eb3": "D#3", "Gb3": "F#3", "Ab3": "G#3", "A#3": "Bb3", "Db4": "C#4", "Eb4": "D#4", "Gb4": "F#4", "Ab4": "G#4", "A#4": "Bb4", "Db5": "C#5", "Eb5": "D#5", "Gb5": "F#5", "Ab5": "G#5", "A#5": "Bb5", "Db6": "C#6", "Eb6": "D#6", "Gb6": "F#6", "Ab6": "G#6", "A#6": "Bb6", "Db7": "C#7"
};