/*
Pitch Circles
Copyright (C) 2024 Josias Matschulat

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
"use strict";

// CONSTANTS
const AVAILABLE_TRANSLATIONS = ["en","es","pt"];

const COLOR_BTN_MASK_ON = "#00ff77";
const COLOR_BTN_MASK_OFF = "#ffffdd";

const ANIMATE_NOTE_NAMES = true;


// FIXED CONSTANTS

const ANGLE_SEMITONE = 30;
const ANGLE_FIFTH = ANGLE_SEMITONE * 7;

const translatable_strings = new Map([
    ["title", "Pitch Circles"],
    ["midi-denied", "Sorry, the browser denied access to MIDI."],
    ["midi-unavailable", "Sorry, there are no MIDI devices available."],
    ["midi-available-ports", "These are the available MIDI ports:"],
    ["midi-ask-port", "Please, type the number of the port to use:"],
    ["midi-granted", "Access to MIDI input port \"%s\" granted."],
    ["midi-invalid-port", "Sorry, you typed an invalid port number!"]
]);


// GLOBAL VARIABLES

var language = "en";

var vertical_screen = false;

var visible_mask = null;

var chromatic_transposition = 0;
var fifths_transposition = 0;

var chromatic_mask_rotation = 0;
var fifths_mask_rotation = 0;

var black_keys_visible = true;
var dark_background = false;

var note_names_key = "auto";
var automatic_names = true;

var played_notes = Array(12).fill(0);

var control_panel_visible = true;

const svg_root = document.getElementById("svg1");


/*
Dynamic Names Data Structure:
key: a data row, representing the amount of fifths transposed
value: array, where:
    index 0: array with 12 items, each representing a pitch class from 0 to 11
        (n = natural, s = sharp, f = flat, ss = double sharp, 
         ff = double flat, e = show enharmonics).
    index 1: array with 3 items, where:
        first : index to go when transposing up an half step (semitone);
        second: index to go when transposing down a half step (semitone).
    index 2: array with 3 items, where:
        first : index to go when transposing up a whole step;
        second: index to go when transposing down a whole step.
    index 3: array with 3 items, where:
        first : index to go when transposing up a perfect fifth;
        second: index to go when transposing down a perfect fifth.
    index 4: index of enharmonic equivalent.
*/

const note_names_diatonic = new Map([
    // C Major/Minor
    [0, [["n","f","n","f","n","n","s","n","f","n","f","n"],  [ 7, 5], [ 2,-2], [ 1,-1], 12]],
    // G Major/Minor
    [1, [["n","s","n","f","n","n","s","n","f","n","f","n"],  [ 8,-6], [ 3,-1], [ 2, 0], 13]],
    // D Major/Minor
    [2, [["n","s","n","f","n","n","s","n","s","n","f","n"],  [ 9,-5], [ 4, 0], [ 3, 1], 14]],
    // A Major/Minor
    [3, [["n","s","n","s","n","n","s","n","s","n","f","n"],  [10,-4], [ 5, 1], [ 4, 2], -9]],
    // E Major/Minor
    [4, [["n","s","n","s","n","n","s","n","s","n","s","n"],  [-1,-3], [ 6, 2], [ 5, 3], -8]],
    // B Major/Minor
    [5, [["n","s","n","s","n","s","s","n","s","n","s","n"],  [ 0,-2], [ 7, 3], [ 6, 4], -7]],
    // F# Major/Minor
    [6, [["s","s","n","s","n","s","s","n","s","n","s","n"],  [ 1,-1], [ 8, 4], [ 7, 5], -6]],
    // C# Major/Minor
    [7, [["s","s","n","s","n","s","s","ss","s","n","s","n"], [ 2, 0], [ 9, 5], [ 8, 6], -5]],
    // G# Major/Minor
    [8, [["s","s","ss","s","n","s","s","ss","s","n","s","n"], [ 3, 1], [10, 6], [ 9, 7], -4]],
    // D# Major/Minor
    [9, [["s","s","ss","s","n","s","s","ss","s","ss","s","n"], [ 4, 2], [11, 7], [10, 8], -3]],
    // A# Major/Minor
    [10, [["s","s","ss","s","ss","s","s","ss","s","ss","s","n"], [ 5, 3], [12, 8], [11, 9], -2]],
    // E# Major/Minor
    [11, [["s","s","ss","s","ss","s","s","ss","s","ss","s","ss"], [ 6, 4], [13, 9], [12,10], -1]],
    // B# Major/Minor
    [12, [["s","s","ss","s","ss","s","ss","ss","s","ss","s","ss"], [ 7, 5], [14,10], [13,11], -12]],
    // F## Major/Minor
    [13, [["s","s","ss","s","ss","s","ss","ss","s","ss","s","ss"], [ 8, 6], [ 3,11], [14,12], -11]],
    // C## Major/Minor
    [14, [["s","ss","ss","s","ss","s","ss","ss","s","ss","s","ss"], [ 9, 7], [ 4,12], [ 3,13], -10]],
    // F Major/Minor
    [-1, [["n","f","n","f","n","n","s","n","f","n","f","n"],  [ 6, 4], [ 1,-3], [ 0,-2], 11]],
    // Bb Major/Minor
    [-2, [["n","f","n","f","n","n","f","n","f","n","f","n"],  [ 5, 3], [ 0,-4], [-1,-3], 10]],
    // Eb Major/Minor
    [-3, [["n","f","n","f","n","n","f","n","f","n","f","f"],  [ 4, 2], [-1,-5], [-2,-4], 9]],
    // Ab Major/Minor
    [-4, [["n","f","n","f","f","n","f","n","f","n","f","f"],  [ 3, 1], [-2,-6], [-3,-5], 8]],
    // Db Major/Minor
    [-5, [["n","f","n","f","f","n","f","n","f","ff","f","f"],  [ 2, 0], [-3,-7], [-4,-6], 7]],
    // Gb Major/Minor
    [-6, [["n","f","ff","f","f","n","f","n","f","ff","f","f"],  [ 1, -1], [-4,-8], [-5,-7], 6]],
    // Cb Major/Minor
    [-7, [["n","f","ff","f","f","n","f","ff","f","ff","f","f"],  [ 0, -1], [-5,-9], [-6,-8], 5]],
    // Fb Major/Minor
    [-8, [["ff","f","ff","f","f","n","f","ff","f","ff","f","f"],  [-1, -2], [-6,-10], [-7,-9], 4]],
    // Bbb Major/Minor
    [-9, [["ff","f","ff","f","f","ff","f","ff","f","ff","f","f"],  [-2, -3], [-7,-11], [-8,-10], 3]],
    // Ebb Major/Minor
    [-10, [["ff","f","ff","f","f","ff","f","ff","f","ff","ff","f"],  [-3, -4], [-8,-12], [-9,-11], 2]],
    // Abb Major/Minor
    [-11, [["ff","f","ff","ff","f","ff","f","ff","f","ff","ff","f"],  [-4, -5], [-9, 0], [-10,-12], 1]],
    // Dbb Major
    [-12, [["ff","f","ff","ff","f","ff","f","ff","f","ff","ff","f"],  [-5, -6], [-10,-2], [-11,-1], 0]]
]);

const note_names_major_thirds = new Map([
    // C aug
    [0, [["n","s","n","s","n","n","s","n","s","n","f","n"],  [ 7, 5], [ 2,-2], [ 1,-1], -12]],
    // G aug
    [1, [["n","s","n","s","n","n","s","n","s","n","s","n"],  [ 8,-6], [ 3,-1], [ 2, 0], -11]],
    // D aug
    [2, [["n","s","n","s","n","s","s","n","s","n","s","n"],  [ 9,-5], [ 4, 0], [ 3, 1], -10]],
    // A aug
    [3, [["s","s","n","s","n","s","s","n","s","n","s","n"],  [10,-4], [ 5, 1], [ 4, 2], -9]],
    // E aug
    [4, [["s","s","n","s","n","s","s","ss","s","n","s","n"],  [-1,-3], [ 6, 2], [ 5, 3], -8]],
    // B aug
    [5, [["s","s","ss","s","n","s","s","ss","s","n","s","n"],  [ 0,-2], [ 7, 3], [ 6, 4], -7]],
    // F# aug
    [6, [["s","s","ss","s","n","s","s","ss","s","ss","s","n"],  [ 1,-1], [ 8, 4], [ 7, 5], -6]],
    // C# aug
    [7, [["s","s","ss","s","ss","s","s","ss","s","ss","s","n"], [ 2, 0], [ 9, 5], [ 8, 6], -5]],
    // G# aug
    [8, [["s","s","ss","s","ss","s","s","ss","s","ss","s","ss"], [ 3, 1], [10, 6], [ 9, 7], -4]],
    // D# aug
    [9, [["s","s","ss","s","ss","s","ss","ss","s","ss","s","ss"], [ 4, 2], [11, 7], [10, 8], -3]],
    // A# aug
    [10, [["s","ss","ss","s","ss","s","ss","ss","s","ss","s","ss"], [ 5, 3], [ 0, 8], [11, 9], -2]],
    // E# aug
    [11, [["s","ss","ss","s","ss","s","ss","ss","s","ss","s","ss"], [ 6, 4], [ 1, 9], [ 0,10], -1]],
    // F aug
    [-1, [["n","s","n","s","n","n","s","n","s","n","f","n"],  [ 6, 4], [ 1,-3], [ 0,-2], 11]],
    // Bb aug
    [-2, [["n","s","n","f","n","n","s","n","s","n","f","n"],  [ 5, 3], [ 0,-4], [-1,-3], 10]],
    // Eb aug
    [-3, [["n","s","n","f","n","n","s","n","f","n","f","n"],  [ 4, 2], [-1,-5], [-2,-4], 9]],
    // Ab aug
    [-4, [["n","f","n","f","n","n","s","n","f","n","f","n"],  [ 3, 1], [-2,-6], [-3,-5], 8]],
    // Db aug
    [-5, [["n","f","n","f","n","n","f","n","f","n","f","n"],  [ 2, 0], [-3,-7], [-4,-6], 7]],
    // Gb aug
    [-6, [["n","f","n","f","n","n","f","n","f","n","f","f"],  [ 1, -1], [-4,-8], [-5,-7], 6]],
    // Cb aug
    [-7, [["n","f","n","f","f","n","f","n","f","n","f","f"],  [ 0, -1], [-5,-9], [-6,-8], 5]],
    // Fb aug
    [-8, [["n","f","n","f","f","n","f","n","f","ff","f","f"],  [-1, -2], [-6,-10], [-7,-9], 4]],
    // Bbb aug
    [-9, [["n","f","ff","f","f","n","f","n","f","ff","f","f"],  [-2, -3], [-7,-11], [-8,-10], 3]],
    // Ebb aug
    [-10, [["n","f","ff","f","f","n","f","ff","f","ff","f","f"],  [-3, -4], [-8,-12], [-9,-11], 2]],
    // Abb aug
    [-11, [["ff","f","ff","f","f","n","f","ff","f","ff","f","f"],  [-4, -5], [-9,-13], [-10,-12], 1]],
    // Dbb aug
    [-12, [["ff","f","ff","f","f","ff","f","ff","f","ff","f","f"],  [-5, -6], [-10,-14], [-11,-13], 0]],
    // Gbb aug
    [-13, [["ff","f","ff","f","f","ff","f","ff","f","ff","ff","f"],  [-6, -7], [-11,-15], [-12,-14], -1]],
    // Cbb aug
    [-14, [["ff","f","ff","ff","f","ff","f","ff","f","ff","ff","f"],  [-7, -8], [-12,-4], [-13,-15], -2]],
    // Fbb aug
    [-15, [["ff","f","ff","ff","f","ff","f","ff","f","ff","ff","f"],  [-8, -9], [-13,-5], [-14,-4], -3]]
]);

const note_names_minor_thirds = new Map([
    // C Dim
    [0, [["n","f","n","f","f","n","f","n","f","ff","f","f"],  [ 7, 5], [ 2,-2], [ 1,-1], 12]],
    // G Dim
    [1, [["n","f","n","f","f","n","f","n","f","n","f","f"],  [ 8,-6], [ 3,-1], [ 2, 0], 1]],
    // D Dim
    [2, [["n","f","n","f","n","n","f","n","f","n","f","f"],  [ 9,-5], [ 4, 0], [ 3, 1], 2]],
    // A Dim
    [3, [["n","f","n","f","n","n","f","n","f","n","f","n"],  [10,-4], [ 5, 1], [ 4, 2], 3]],
    // E Dim
    [4, [["n","f","n","f","n","n","s","n","f","n","f","n"],  [-1,-3], [ 6, 2], [ 5, 3], -8]],
    // B Dim
    [5, [["n","s","n","f","n","n","s","n","f","n","f","n"],  [ 0,-2], [ 7, 3], [ 6, 4], -7]],
    // F# Dim
    [6, [["n","s","n","f","n","n","s","n","s","n","f","n"],  [ 1,-1], [ 8, 4], [ 7, 5], -6]],
    // C# Dim
    [7, [["n","s","n","s","n","n","s","n","s","n","f","n"], [ 2, 0], [ 9, 5], [ 8, 6], -5]],
    // G# Dim
    [8, [["n","s","n","s","n","n","s","n","s","n","s","n"], [ 3, 1], [10, 6], [ 9, 7], -4]],
    // D# Dim
    [9, [["n","s","n","s","n","s","s","n","s","n","s","n"], [ 4, 2], [11, 7], [10, 8], -3]],
    // A# Dim
    [10, [["s","s","n","s","n","s","s","n","s","n","s","n"], [ 5, 3], [12, 8], [11, 9], -2]],
    // E# Dim
    [11, [["s","s","n","s","n","s","s","ss","s","n","s","n"], [ 6, 4], [13, 9], [12,10], -1]],
    // B# Dim
    [12, [["s","s","ss","s","n","s","s","ss","s","n","s","n"], [ 7, 5], [14,10], [13,11], 0]],
    // F## Dim
    [13, [["s","s","ss","s","n","s","s","ss","s","ss","s","n"], [ 8, 6], [15,11], [14,12], 1]],
    // C## Dim
    [14, [["s","s","ss","s","ss","s","s","ss","s","ss","s","n"], [ 9, 7], [16,12], [15,13], 2]],
    // G## Dim
    [15, [["s","s","ss","s","ss","s","s","ss","s","ss","s","ss"], [10, 8], [17,13], [16,14], 3]],
    // D## Dim
    [16, [["s","s","ss","s","ss","s","ss","ss","s","ss","s","ss"], [-1, 9], [18,14], [17,15], 4]],
    // A## Dim
    [17, [["s","ss","ss","s","ss","s","ss","ss","s","ss","s","ss"], [ 0,10], [19,15], [18,16], 5]],
    // E## Dim
    [18, [["s","ss","ss","s","ss","s","ss","ss","s","ss","s","ss"], [ 1,-1], [-4,16], [19,17], 6]],
    // B## Dim
    [19, [["s","ss","ss","s","ss","s","ss","ss","s","ss","s","ss"], [ 2, 0], [-3,17], [-4,18], 7]],
    // F Dim
    [-1, [["n","f","ff","f","f","n","f","n","f","ff","f","f"], [ 6, 4], [ 1,-3], [ 0,-2], 11]],
    // Bb Dim
    [-2, [["n","f","ff","f","f","n","f","ff","f","ff","f","f"], [ 5, 3], [ 0,-4], [-1,-3], 10]],
    // Eb Dim
    [-3, [["ff","f","ff","f","f","n","f","ff","f","ff","f","f"], [ 4, 2], [-1,-5], [-2,-4], 9]],
    // Ab Dim
    [-4, [["ff","f","ff","f","f","ff","f","ff","f","ff","f","f"], [ 3, 1], [-2,-6], [-3,-5], 8]],
    // Db Dim
    [-5, [["ff","f","ff","f","f","ff","f","ff","f","ff","ff","f"], [ 2, 0], [-3, 5], [-4,-6], 7]],
    // Gb Dim
    [-6, [["ff","f","ff","ff","f","ff","f","ff","f","ff","ff","f"], [ 1, -1], [-4, 7], [-5, 5], 6]]
]);

const note_names_enharmonics1 = ["n","e","n","e","n","n","e","n","e","n","e","n"];
const note_names_enharmonics2 = ["e","e","n","e","e","e","e","n","e","n","e","e"];
const note_names_numbers      = Array(12).fill("p");;

const masks = new Map([
    ["Pentatonic"   , null],
    ["Diatonic"     , null],
    ["HarmonicMinor", null],
    ["MelodicMinor" , null],
    ["WholeTones"   , null],
    ["Octatonic"    , null],
    ["MajorThirds"  , null],
    ["MinorThirds"  , null],
    ["Chromatic"    , null]
]);

function getCaseInsensitiveMaskName(cimask) {
    for ( let mask_key of masks.keys() ) {
        if ( cimask.toLowerCase() == mask_key.toLowerCase() )
            return mask_key;
    }
    return null;
}

const control_groups = [
    "ControlsMasks",
    "ControlsTranspose",
    "ControlsOptions"
]

const tabs = [
    "TabMasks",
    "TabTranspose",
    "TabOptions"
];

const masks_buttons = [
    "BtnMaskPentatonic",
    "BtnMaskDiatonic",
    "BtnMaskHarmonicMinor",
    "BtnMaskMelodicMinor",
    "BtnMaskWholeTones",
    "BtnMaskChromatic",
    "BtnMaskOctatonic",
    "BtnMaskMajorThirds",
    "BtnMaskMinorThirds"
];

const transpose_buttons = [
    "g51", "g52", "g115", "g117", "g133", "g135"
];

const options_names_switches = [ 
    "SwitchNamesEnharmony1", "SwitchNamesEnharmony2",
    "SwitchNamesPitchClasses", "SwitchNamesDynamic"
];

const options_clickables = options_names_switches.concat(
    ["ChkBlackKeys", "ChkDarkBackground", "BtnSwapEnharmonics"]);

const clickable_elements = tabs.concat(masks_buttons, transpose_buttons, options_clickables);

/*****************************
 *                           *
 *  Initialization routines  *
 *                           *
 *****************************/

function initializeMasks() {
    // Initialize masks with the following structure:
    // key: [ [chr_mask_element, fth_mask_element],
    //        [mask_btn_element, mask_btn_background_element] ]    
    for (let mask of masks) {
        masks.set(mask[0], [
            [ document.getElementById(`Chr${mask[0]}Mask`),
              document.getElementById(`Fth${mask[0]}Mask`)   ],
            [ document.getElementById(`BtnMask${mask[0]}`),
              document.getElementById(`BtnMask${mask[0]}Bk`) ]
        ]);
    }
    // Set properties of masks
    for (let mask_data of masks) {
        for (let mask of mask_data[1][0]) {
            mask.style.transformBox = "border-box";
            mask.style.transformOrigin = "center center";
            mask.style.opacity = "0";
            mask.style.visibility = "hidden";
            mask.style.scale = "120%";
            mask.style.display = "inline";
            mask.style.cursor = "grab";
            mask.style.touchAction = "pinch-zoom";
        }
    }
}

/******************************
 *                            *
 *  Mask visibility routines  *
 *                            *
 ******************************/

function changeMask(mask_key, animate = true) {
    let delay = false;
    if (visible_mask != null) {
        const hiding_mask_data = masks.get(visible_mask);
        hideMask(hiding_mask_data[0][0], animate);
        hideMask(hiding_mask_data[0][1], animate);
        hiding_mask_data[1][1].style.fill = COLOR_BTN_MASK_OFF;
        delay = true;
    }
    if (mask_key == visible_mask || mask_key == null) {
        visible_mask = null;
    } else {
        visible_mask = mask_key;
        const showing_mask_data = masks.get(visible_mask);
        showMask(showing_mask_data[0][0], chromatic_mask_rotation, animate, delay);
        showMask(showing_mask_data[0][1], fifths_mask_rotation, animate, delay);
        showing_mask_data[1][1].style.fill = COLOR_BTN_MASK_ON;
    }
    updateNoteNames();
}

function showMask(mask, rotation_degrees = 0, animate, delay) {
    if (animate == true) {
        mask.style.transitionProperty = "scale, opacity";
        mask.style.transitionDelay = ( (delay == true) ? "400ms" : "0s" );
        mask.style.transitionDuration = "200ms";
        mask.style.transitionTimingFunction = "ease-out";
    } else {
        mask.style.transition = "none";
    }
    mask.style.scale = "100%";
	mask.style.opacity = "1";
	mask.style.visibility = "visible";
    mask.style.rotate = `${rotation_degrees}deg`;
}

function hideMask(mask, animate) {
    if (animate == true) {
        mask.style.transitionProperty = "scale, opacity, visibility";
        mask.style.transitionDelay = "0s";
        mask.style.transitionDuration = "200ms";
        mask.style.transitionTimingFunction = "ease-in";
    } else {
        mask.style.transition = "none";
    }
    mask.style.scale = "120%";
    mask.style.opacity = "0";
    mask.style.visibility = "hidden";
}


/******************************
 *                            *
 *   Mask rotation routines   *
 *                            *
 ******************************/

function setMasksRotations(chr_steps, fth_steps, animate) {
    chromatic_mask_rotation = Math.round( clampAngle(chr_steps*ANGLE_SEMITONE, chromatic_mask_rotation, ANGLE_FIFTH) );
    fifths_mask_rotation    = Math.round( clampAngle(fth_steps*ANGLE_SEMITONE, fifths_mask_rotation,    ANGLE_FIFTH) );
    if ( visible_mask != null ) {
        applyMaskRotation(getVisibleChrMask(), chromatic_mask_rotation, animate);
        applyMaskRotation(getVisibleFthMask(), fifths_mask_rotation,    animate);
    }
    updateNoteNames(250);
}

function rotateMasks(semitones, animate = true) {
    transposeSemitones(semitones);
    setMasksRotations(chromatic_transposition, fifths_transposition, animate);
}

function rotateMasksByFifths(fifths, animate = true) {
    transposeFifths(fifths);
    setMasksRotations(chromatic_transposition, fifths_transposition, animate);
}

function returnMasksToC(animate = true) {
    chromatic_transposition = 0;
    fifths_transposition = 0;
    if ( typeof(note_names_key) == "number" )
        note_names_key = 0;
    setMasksRotations(0, 0);
}

function applyMaskRotation(mask, degrees, animate) {
    if (animate == true && mask.style.visibility == "visible")
        doMaskRotation(mask, degrees, 750);
    else
        doMaskRotation(mask, degrees, 0);
}

function doMaskRotation(elm, angle_deg, animation_ms = 0) {
    elm.style.transition = ( animation_ms == 0 ) 
        ? "none" 
        : `rotate ${animation_ms}ms ease-in-out`;
    elm.style.rotate = `${angle_deg}deg`;
}

function transposeNoteNamesKey(fifths) {
    if ( typeof(note_names_key) == "number" ) {
        let names_map;
        switch ( visible_mask ) {
            case "MajorThirds": names_map = note_names_major_thirds; break;
            case "MinorThirds": names_map = note_names_minor_thirds; break;
            default           : names_map = note_names_diatonic;
        }
        switch ( fifths ) {
            case  1: note_names_key = names_map.get(note_names_key)[3][0]; break;
            case -1: note_names_key = names_map.get(note_names_key)[3][1]; break;
            case  2: note_names_key = names_map.get(note_names_key)[2][0]; break;
            case -2: note_names_key = names_map.get(note_names_key)[2][1]; break;
            case  7: note_names_key = names_map.get(note_names_key)[1][0]; break;
            case -7: note_names_key = names_map.get(note_names_key)[1][1]; break;
            default: {
                note_names_key += fifths;
                while ( names_map.has(note_names_key) == false )
                    note_names_key += (note_names_key < 0) ? 12 : -12;
            }
        }
    }
}

function transposeFifths(fifths) {
    fifths_transposition += fifths;
    chromatic_transposition += clampPitch(fifths*7, -12, 12);
    transposeNoteNamesKey(fifths);
}

function transposeSemitones(steps) {
    const fifths = clampPitch(steps*7, -12, 12);
    chromatic_transposition += steps;
    fifths_transposition += fifths;
    transposeNoteNamesKey(fifths);
}


/*************************************
 *                                   *
 * Mask rotation with mouse or touch *
 *                                   *
 *************************************/

function enableDragRotationOnMasks() {
    for ( let mask_data of masks ) {
        for ( let mask of mask_data[1][0] ) {
            mask.addEventListener("wheel", handleWheelEvent);
            mask.addEventListener("mousedown",   handleMaskDragPointerBegin,{ capture: true, passive: false });
            mask.addEventListener("mouseup",     handleMaskDragPointerEnd,  { capture: true, passive: false });
            mask.addEventListener("mousecancel", handleMaskDragPointerEnd,  { capture: true, passive: false });
            mask.addEventListener("touchstart",  handleMaskDragTouchBegin,  { capture: true, passive: false });
            mask.addEventListener("touchend",    handleMaskDragTouchEnd,    { capture: true, passive: false });
            mask.addEventListener("touchcancel", handleMaskDragTouchEnd,    { capture: true, passive: false });
        }
    }
}

function handleWheelEvent(ev) {
    if ( document.getElementById("ChrMasks").matches(":hover") ) {
        rotateMasks(Math.sign(ev.deltaY+ev.deltaX)*(-1));
    } else if ( document.getElementById("FthMasks").matches(":hover") ) {
        rotateMasks(Math.sign(ev.deltaY+ev.deltaX)*(-7));
    }
}

var mask_drag_rotation = {
    // properties
    dev: {
        type: null,
        id: null
    },
    target: {
        mask: null,
        elm: null
    },
    amount: 0,
    offset: 0,
    begun_rotating: false,
    // methods
    rad() { return this.amount + this.offset; },
    deg() { return radToDeg(this.amount + this.offset); },
    set_angle(angle_rad) {
        this.amount = angle_rad;
        this.begun_rotating = true;
    },
    reset_angle(mask_angle_rad, pointer_angle_rad) { 
        this.amount_rad = 0; 
        this.offset = mask_angle_rad - pointer_angle_rad;
        this.begun_rotating = false;
    },
    set_params(dev_type, dev_id, mask, elm) {
        this.dev.type = dev_type;
        this.dev.id = dev_id;
        this.target.mask = mask;
        this.target.elm = elm;
    },
    clear() {
        this.reset_angle(0, 0);
        this.dev.type = null;
        this.dev.id = null;
        this.target.mask = null;
        this.target.elm = null;
    }
};

function handleMaskDragPointerBegin(ev) {
    if ( mask_drag_rotation.dev.type != null ) return;
    mask_drag_rotation.set_params(
        "pointer",
        ev.pointerId,
        (getVisibleChrMask().contains(ev.target)) ? getVisibleChrMask() : getVisibleFthMask(),
        ev.target
    );
    maskDragBegin(ev.clientX, ev.clientY);
    mask_drag_rotation.target.elm.setPointerCapture(ev.pointerId);
    mask_drag_rotation.target.elm.addEventListener(
        "pointermove", handleMaskDragPointerMove, { capture: true, passive: false }
    );
}

function handleMaskDragTouchBegin(ev) {
    if ( mask_drag_rotation.dev.type != null ) return;
    ev.preventDefault();
    const touchObj = Array.from(ev.changedTouches).at(-1);
    mask_drag_rotation.set_params(
        "touch",
        touchObj.identifier,
        (getVisibleChrMask().contains(ev.target)) ? getVisibleChrMask() : getVisibleFthMask(),
        ev.target
    );
    maskDragBegin(touchObj.clientX, touchObj.clientY);
    mask_drag_rotation.target.elm.addEventListener("touchmove", handleMaskDragTouchMove, { capture: true, passive: false });
    
}

function handleMaskDragPointerEnd(ev) {
    if ( mask_drag_rotation.dev.type != "pointer" ) return;
    mask_drag_rotation.target.elm.releasePointerCapture(ev.pointerId);
    mask_drag_rotation.target.elm.removeEventListener("pointermove", handleMaskDragPointerMove);
    maskDragEnd();
}

function handleMaskDragTouchEnd(ev) {
    if ( mask_drag_rotation.dev.type != "touch" ) return;
    ev.preventDefault();
    for ( let touchObj of ev.changedTouches ) {
        if ( touchObj.identifier == mask_drag_rotation.dev.id ) {
            mask_drag_rotation.target.elm.removeEventListener("touchmove", handleMaskDragTouchMove);
            maskDragEnd();
            break;
        }
    }
}

function handleMaskDragPointerMove(ev) {
    if ( mask_drag_rotation.dev.type == "pointer" )
        maskDragMove(ev.clientX, ev.clientY);
}

function handleMaskDragTouchMove(ev) {
    if ( mask_drag_rotation.dev.type == "touch" ) {
        ev.preventDefault();
        for ( let touchObj of ev.changedTouches ) {
            if ( touchObj.identifier == mask_drag_rotation.dev.id ) {
                maskDragMove(touchObj.clientX, touchObj.clientY);
                break;
            }
        }
    }
}

function maskDragBegin(px, py) {
    if ( mask_drag_rotation.target.mask.id.startsWith("Chr")  ) {
        mask_drag_rotation.reset_angle(
            degToRad(clampAngle(chromatic_mask_rotation)),
            computePointerAngle(mask_drag_rotation.target.mask.getBoundingClientRect(), px, py)
        );
    } else {
        mask_drag_rotation.reset_angle(
            degToRad(clampAngle(fifths_mask_rotation)),
            computePointerAngle(mask_drag_rotation.target.mask.getBoundingClientRect(), px, py)
        );
    }
    mask_drag_rotation.target.mask.style.cursor = "grabbing";
}

function maskDragEnd() {
    if ( mask_drag_rotation.begun_rotating == true ) {
        if ( mask_drag_rotation.target.mask.id.startsWith("Chr") ) {
            const steps = clampPitch(Math.round(mask_drag_rotation.deg() / ANGLE_SEMITONE), -5, 6);
            // set transpositions
            chromatic_transposition = steps;
            fifths_transposition = clampPitch(steps * 7, -5, 6);
            if ( typeof(note_names_key) == "number" )
                note_names_key = fifths_transposition;
            // set rotations
            chromatic_mask_rotation = clampAngle(chromatic_transposition*ANGLE_SEMITONE, mask_drag_rotation.deg());
            fifths_mask_rotation = clampAngle(fifths_transposition*ANGLE_SEMITONE, fifths_mask_rotation);
        } else {
            const steps = clampPitch(Math.round(mask_drag_rotation.deg() / ANGLE_SEMITONE), -5, 6);
            // set transpositions
            fifths_transposition = steps;
            chromatic_transposition = clampPitch(steps * 7, -5, 6);
            if ( typeof(note_names_key) == "number" )
                note_names_key = fifths_transposition;
            // set rotations
            fifths_mask_rotation = clampAngle(fifths_transposition*ANGLE_SEMITONE, mask_drag_rotation.deg());
            chromatic_mask_rotation = clampAngle(chromatic_transposition*ANGLE_SEMITONE, chromatic_mask_rotation);
        }
        updateNoteNames(0);
        applyMaskRotation(getVisibleChrMask(), chromatic_mask_rotation, true);
        applyMaskRotation(getVisibleFthMask(), fifths_mask_rotation, true);
    }
    mask_drag_rotation.target.mask.style.cursor = "grab";
    mask_drag_rotation.clear();
}

function maskDragMove(px, py) {
    if ( mask_drag_rotation.begun_rotating == false && typeof(note_names_key) == "number" )
        updateNoteNames(0, "enharmonics1");
    const rect = mask_drag_rotation.target.mask.getBoundingClientRect();
    mask_drag_rotation.set_angle(computePointerAngle(rect, px, py));
    doMaskRotation(mask_drag_rotation.target.mask, mask_drag_rotation.deg(), 0);
}

function computePointerAngle(rect, px, py) {
    const cx = (rect.width / 2.0) + rect.left;
    const cy = (rect.height / 2.0) + rect.top;
    return Math.atan2(py-cy, px-cx);
}


/****************************
 *                          *
 *  Mask utility routines   *
 *                          *
 ****************************/

function getVisibleChrMask() {
    return masks.get(visible_mask)[0][0];
}

function getVisibleFthMask() {
    return masks.get(visible_mask)[0][1];
}


/*****************************
 *                           *
 *   Tab changing routines   *
 *                           *
 *****************************/

function showTabMasks() {
    hideTab("TabTransposeBk", "ControlsTranspose");
    hideTab("TabOptionsBk", "ControlsOptions");
    showTab("TabMasksBk", "ControlsMasks");
}

function showTabTranspose() {
    hideTab("TabMasksBk", "ControlsMasks");
    hideTab("TabOptionsBk", "ControlsOptions");
    showTab("TabTransposeBk", "ControlsTranspose");
}    

function showTabOptions() {
    hideTab("TabMasksBk", "ControlsMasks");
    hideTab("TabTransposeBk", "ControlsTranspose");
    showTab("TabOptionsBk", "ControlsOptions");
}

function showTab(tabbk_id, controls_id) {
    document.getElementById(tabbk_id).style.display = "none";
    document.getElementById(controls_id).style.display = "inline";
}

function hideTab(tabbk_id, controls_id) {
    document.getElementById(tabbk_id).style.display = "inline";
    document.getElementById(controls_id).style.display = "none";
}

function hideAllTabs() {
    for (let elm_id of control_groups) {
        let elm = document.getElementById(elm_id);
        elm.style.display = "none";
    }
    for (let elm_id of tabs) {
        let elm = document.getElementById(elm_id);
        elm.style.display = "inline";
    }
}


/****************************
 *                          *
 *   Note naming routines   *
 *                          *
 ****************************/

function initializeNoteNames() {
    for (const grandpa_id of ["ChrNames","FthNames"]) {
        const grandpa = document.getElementById(grandpa_id);
        for (const parent of grandpa.childNodes) {
            for (const elm of parent.childNodes) {
                elm.setAttribute("showing", "0");
                elm.style.visibility = "hidden";
                elm.style.display = "inline";
                elm.style.transformBox = "content-box";
                elm.style.transformOrigin = "center center";
                elm.style.transform = "scale(1, 0)";
                elm.style.transition = "none";
            }
        }
    }
}

function updateNoteNames(delay_ms = 0, override_names_type = null) {
    if ( override_names_type == null ) 
        override_names_type = note_names_key;
    if ( typeof(override_names_type) == "number" ) {
        automatic_names = true;
        switch ( visible_mask ) {
            case "Pentatonic":
            case "Diatonic":
                override_names_type = clampPitch(override_names_type, -12, 14);
                showHideNoteNames(note_names_diatonic.get(override_names_type)[0], delay_ms);
                break;
            case "HarmonicMinor":
            case "MelodicMinor":
                override_names_type = clampPitch(override_names_type, -11, 14);
                showHideNoteNames(note_names_diatonic.get(override_names_type)[0], delay_ms);
                break;
            case "MajorThirds":
                override_names_type = clampPitch(override_names_type, -15, 11);
                showHideNoteNames(note_names_major_thirds.get(override_names_type)[0], delay_ms);
                break;
            case "MinorThirds":
                override_names_type = clampPitch(override_names_type, -6, 19);
                showHideNoteNames(note_names_minor_thirds.get(override_names_type)[0], delay_ms);
                break;
            default:
                showHideNoteNames(note_names_enharmonics1, delay_ms);
                automatic_names = false;
        }
    } else {
        switch (override_names_type) {
            case "enharmonics1": showHideNoteNames(note_names_enharmonics1, delay_ms); break;
            case "enharmonics2": showHideNoteNames(note_names_enharmonics2, delay_ms); break;
            case "numbers"     : showHideNoteNames(note_names_numbers, delay_ms); break;
        }
        automatic_names = false;
    }
    updateSwapEnharmonicsBtn();
}

async function showHideNoteNames(postfix_array, delay_ms) {
    // collect elements to be shown/hidden
    var names_to_be_hidden = [];
    var names_to_be_showed = [];
    for ( let i = 0; i < 12; i++ ) {
        const id_end_visible = `${i}${postfix_array[i]}`;
        const all_note_names = 
            Array.from(document.getElementById(`ChrNote${i}`).childNodes)
                .concat(Array.from(document.getElementById(`FthNote${i}`).childNodes));
        for (let elm of all_note_names) {
            if ( elm.id.endsWith(id_end_visible) ) {
                if ( elm.getAttribute("showing") != "1" )
                    names_to_be_showed.push(elm);
            } else {
                if ( elm.getAttribute("showing") == "1" )
                    names_to_be_hidden.push(elm);
            }
        }
    }
    // show/hide elements
    for ( const elm of names_to_be_hidden ) {
        elm.setAttribute("showing", "0");
        if ( ANIMATE_NOTE_NAMES ) {
            elm.style.transitionProperty = "visibility, transform";
            elm.style.transitionDelay = `${delay_ms}ms`;
            elm.style.transitionDuration = "100ms";
            elm.style.transitionTimingFunction = "ease-out";
        }
        elm.style.visibility = "hidden";
        elm.style.transform = "scale(1, 0)";
    }
    for ( const elm of names_to_be_showed ) {
        elm.setAttribute("showing", "1");
        if ( ANIMATE_NOTE_NAMES ) {
            elm.style.transitionProperty = "visibility, transform";
            elm.style.transitionDelay = `${delay_ms+100}ms`;
            elm.style.transitionDuration = "100ms";
            elm.style.transitionTimingFunction = "ease-out";
        }
        elm.style.visibility = "visible";
        elm.style.transform = "scale(1, 1)";
    }
}

function checkNamesSwitch(switch_id) {
    for (let elm_id of options_names_switches) {
        document.getElementById(elm_id + "Mark").style.display = 
            (elm_id == switch_id) ? "inline" : "none";
    }
}

function changeNoteNames(value, delay_ms = 0) {
    switch (value) {
        case "enharmonics1" :
            checkNamesSwitch("SwitchNamesEnharmony1");
            note_names_key = "enharmonics1";
            break;
        case "enharmonics2" :
            checkNamesSwitch("SwitchNamesEnharmony2");
            note_names_key = "enharmonics2";
            break;
        case "numbers" :
            checkNamesSwitch("SwitchNamesPitchClasses");
            note_names_key = "numbers";
            break;
        default :
            checkNamesSwitch("SwitchNamesDynamic");
            note_names_key = clampPitch(fifths_transposition, -5, 6);
    }
    updateNoteNames(delay_ms);
    writeStringToLocalStorage("note_names", value);
}

function swapEnharmonics() {
    if (automatic_names == true) {
        switch ( visible_mask ) {
            case "Pentatonic":
            case "Diatonic":
            case "HarmonicMinor":
            case "MelodicMinor":
                note_names_key = note_names_diatonic.get(note_names_key)[4];
                break;
            case "MajorThirds":
                note_names_key = note_names_major_thirds.get(note_names_key)[4];
                break;
            case "MinorThirds":
                note_names_key = note_names_minor_thirds.get(note_names_key)[4];
                break;
        }
        updateNoteNames();
    }
}


/*****************************
 *                           *
 *   MIDI-related routines   *
 *                           *
 *****************************/

function requestMIDI() {
    // query browser about permission to use MIDI
    navigator.permissions.query({ name: "midi", sysex: false }).then((perm) => {
        if ( perm.state === "denied" ) {
            alert(translatable_strings.get("midi-denied"));
            return;
        }
        // request MIDI to browser and check available inputs
        navigator.requestMIDIAccess().then((access) => {
            let id = "0";
            if ( access.inputs.size == 0 ) {
                alert(translatable_strings.get("midi-unavailable"));
                return;
            } else if ( access.inputs.size > 1 ) {
                // ask user about which MIDI device to use
                let msg = translatable_strings.get("midi-available-ports") + "\n\n";
                let i = 0;
                for ( let port of access.inputs.values() ) {
                    msg += `  ${i++}: "${port.name}\n`;
                }
                msg += "\n" + translatable_strings.get("midi-ask-port");
                id = prompt(msg);
                if ( id == null || id == "" ) return;
            }
            // get the selected port
            if ( isNumber(id) ) {
                let i = 0;
                id = Number(id);
                for ( let port of access.inputs.values() ) {
                    if ( i++ == id ) {
                        port.addEventListener("midimessage", handleMIDIEvent);
                        console.log(translatable_strings.get("midi-granted").replace("%s", port.name));
                        return;
                    }
                }
            }
            alert(translatable_strings.get("midi-invalid-port"));
        });
    });
}

function handleMIDIEvent(ev) {
    //console.log(`MIDI message received:\n${ev.data}`);
    // note on
    if ( ev.data[0] >= 0x90 && ev.data[0] <= 0x9F ) {
        setNoteOn(ev.data[1]);
    } else if ( ev.data[0] >= 0x80 && ev.data[0] <= 0x8F ) {
        setNoteOff(ev.data[1]);
    }
}

function setNoteOn(key) {
    const note = clampPitch(key, 0, 11);
    played_notes[note] += 1;
    updateNotesBackgrounds();
}

function setNoteOff(key) {
    const note = clampPitch(key, 0, 11);
    played_notes[note] -= 1;
    updateNotesBackgrounds();
}


/*******************************
 *                             *
 * Keyboard shortcuts routines *
 *                             *
 *******************************/

function handleKeyboardShortcut(ev) {
    if ( ev.repeating ) return;
    let comb = [];
    if ( ev.ctrlKey ) comb.push("ctrl");
    if ( ev.altKey ) comb.push("alt");
    if ( ev.shiftKey ) comb.push("shift");
    comb.push(ev.key.toLowerCase());
    const k = comb.join("+");
    switch ( k ) {
        case "p": { ev.preventDefault(); changeMask("Pentatonic"); break; }
        case "d": { ev.preventDefault(); changeMask("Diatonic"); break; }
        case "h": { ev.preventDefault(); changeMask("HarmonicMinor"); break; }
        case "m": { ev.preventDefault(); changeMask("MelodicMinor"); break; }
        case "w": { ev.preventDefault(); changeMask("WholeTones"); break; }
        case "o": { ev.preventDefault(); changeMask("Octatonic"); break; }
        case "j": { ev.preventDefault(); changeMask("MajorThirds"); break; }
        case "i": { ev.preventDefault(); changeMask("MinorThirds"); break; }
        case "c": { ev.preventDefault(); changeMask("Chromatic"); break; }
        case "0": { ev.preventDefault(); returnMasksToC(); break; }
        case "1": { ev.preventDefault(); rotateMasksByFifths(1); break; }
        case "2": { ev.preventDefault(); rotateMasksByFifths(2); break; }
        case "3": { ev.preventDefault(); rotateMasksByFifths(3); break; }
        case "4": { ev.preventDefault(); rotateMasksByFifths(4); break; }
        case "5": { ev.preventDefault(); rotateMasksByFifths(5); break; }
        case "6": { ev.preventDefault(); rotateMasksByFifths(6); break; }
        case "7": { ev.preventDefault(); rotateMasksByFifths(7); break; }
        case "8": { ev.preventDefault(); rotateMasksByFifths(8); break; }
        case "9": { ev.preventDefault(); rotateMasksByFifths(9); break; }
        case "ctrl+1": { ev.preventDefault(); rotateMasksByFifths(-1); break; }
        case "ctrl+2": { ev.preventDefault(); rotateMasksByFifths(-2); break; }
        case "ctrl+3": { ev.preventDefault(); rotateMasksByFifths(-3); break; }
        case "ctrl+4": { ev.preventDefault(); rotateMasksByFifths(-4); break; }
        case "ctrl+5": { ev.preventDefault(); rotateMasksByFifths(-5); break; }
        case "ctrl+6": { ev.preventDefault(); rotateMasksByFifths(-6); break; }
        case "ctrl+7": { ev.preventDefault(); rotateMasksByFifths(-7); break; }
        case "ctrl+8": { ev.preventDefault(); rotateMasksByFifths(-8); break; }
        case "ctrl+9": { ev.preventDefault(); rotateMasksByFifths(-9); break; }
        case "arrowup": { ev.preventDefault(); rotateMasks(1); break; }
        case "arrowdown": { ev.preventDefault(); rotateMasks(-1); break; }
        case "shift+arrowup": { ev.preventDefault(); rotateMasks(2); break; }
        case "shift+arrowdown": { ev.preventDefault(); rotateMasks(-2); break; }
        case "arrowright": { ev.preventDefault(); rotateMasksByFifths(1); break; }
        case "arrowleft": { ev.preventDefault(); rotateMasksByFifths(-1); break; }
        case "shift+arrowright": { ev.preventDefault(); rotateMasksByFifths(2); break; }
        case "shift+arrowleft": { ev.preventDefault(); rotateMasksByFifths(-2); break; }
        case "tab": { ev.preventDefault(); swapEnharmonics(); break; }
        case "f1": { ev.preventDefault(); changeNoteNames("enharmonics1"); break; }
        case "f2": { ev.preventDefault(); changeNoteNames("enharmonics2"); break; }
        case "f3": { ev.preventDefault(); changeNoteNames("numbers"); break; }
        case "f4": { ev.preventDefault(); changeNoteNames("automatic"); break; }
        case "f7": { ev.preventDefault(); switchShowBlackKeys(); break; }
        case "f8": { ev.preventDefault(); switchDarkBackground(); break; }
        case "f9": { ev.preventDefault(); switchControlsVisibility(); break; }
        case "f10": { ev.preventDefault(); requestMIDI(); break; }
    }
}

function enableKeyboardShortcuts() {
    window.parent.addEventListener("keydown", handleKeyboardShortcut);
    document.addEventListener("keydown", handleKeyboardShortcut);
}


/****************************
 *                          *
 *      Other routines      *
 *                          *
 ****************************/

function switchShowBlackKeys() {
    black_keys_visible = (! black_keys_visible);
    writeStringToLocalStorage("black_keys_visible", black_keys_visible.toString());
    updateNotesBackgrounds();
}

function updateNotesBackgrounds() {
    for ( let i = 0; i < 12; i++ ) {
        let elm_chr = document.getElementById(`ChrNoteBk${i}`);
        let elm_fth = document.getElementById(`FthNoteBk${i}`);
        if ( played_notes[i] > 0 ) {
            const angle = clampAngle((i*ANGLE_SEMITONE) - chromatic_mask_rotation, 180, 180);
            elm_chr.style.fill = `hsl(${angle} 100% 50%)`;
            elm_fth.style.fill = `hsl(${angle} 100% 50%)`;
        } else {
            if ( black_keys_visible && [1,3,6,8,10].includes(i) ) {
                elm_chr.style.fill = "black";
                elm_fth.style.fill = "black";
            } else {
                elm_chr.style.fill = "white";
                elm_fth.style.fill = "white";
            }
        }
    }
}

function switchDarkBackground() {
    dark_background = (! dark_background);
    writeStringToLocalStorage("dark_background", dark_background.toString());
    updateBackground();
}

function updateBackground() {
    let elm_mark = document.getElementById("ChkDarkBackgroundMark");
    let white_key_markers = document.getElementsByClassName("whiteKeyMarker");
    let black_key_markers = document.getElementsByClassName("blackKeyMarker");
    if (dark_background) {
        elm_mark.style.display = "inline";
        svg_root.style.backgroundColor = "black";
        for ( let elm of white_key_markers ) elm.style.stroke = "black";
        for ( let elm of black_key_markers ) elm.style.stroke = "#666666";
    } else {
        elm_mark.style.display = "none";
        svg_root.style.backgroundColor = "white";
        for ( let elm of white_key_markers ) elm.style.stroke = "#666666";
        for ( let elm of black_key_markers ) elm.style.stroke = "white";
    }
}

function updateSwapEnharmonicsBtn() {
    const btn_elm = document.getElementById("BtnSwapEnharmonics");
    const btnbk_elm = document.getElementById("BtnSwapEnharmonicsBk");
    const btntx_elm = document.getElementById("BtnSwapEnharmonicsTxt");
    if (automatic_names == true) {
        btn_elm.style.cursor = "pointer";
        btnbk_elm.style.fill = "#66ff66";
        btntx_elm.style.fill = "black";
    } else {
        btn_elm.style.cursor = "not-allowed";
        btnbk_elm.style.fill = "#aaaaaa";
        btntx_elm.style.fill = "#555555";
    }
}

function hover(elm_id) {
	let elm = document.getElementById(elm_id);
    elm.style.filter = "drop-shadow(0px 0px 1px red)";
}

function unhover(elm_id){
	let elm = document.getElementById(elm_id);
    elm.style.filter = "none";
}

function hoverTab(elm_id) {
	let elm = document.getElementById(elm_id);
    elm.style.fill = document.getElementById("ControlPanelBk").style.fill;
}

function unhoverTab(elm_id){
	let elm = document.getElementById(elm_id);
    elm.style.fill = "#cccccc";
}


function initializeThisSvg() {

    svg_root.removeAttribute("height");
    svg_root.removeAttribute("width");
    svg_root.style.backgroundColor = "white";

    language = getPreferredTranslation(AVAILABLE_TRANSLATIONS);
    translateSvgAsync(language);

    initializeMasks();
    initializeNoteNames();

    // Set cursor for clickable controls
    for (let elm_id of clickable_elements) {
        let elm = document.getElementById(elm_id);
        if (elm != null) {
            elm.style.cursor = "pointer";
            elm.style.overscrollBehavior = "none";
        }
    }

    // Read stored preferences
    dark_background = readBoolFromLocalStorage("dark_background", false);
    black_keys_visible = readBoolFromLocalStorage("black_keys_visible", true);
    updateBackground();
    updateNotesBackgrounds();
    changeNoteNames(readStringFromLocalStorage("note_names", "auto"), 1000);

    // Make all text non-selectable
    for ( let elm of document.querySelectorAll("text") )
        elm.style.userSelect = "none";
    
    enableKeyboardShortcuts();
    enableDragRotationOnMasks();
    
    // Respond to window resizing
    const control_panel = document.getElementById("Controls");
    control_panel.style.transformBox = "boder-box";
    control_panel.style.transformOrigin = "left top";
    window.parent.addEventListener("resize", resizeEventHandler);
    resizeEventHandler();

    // Get initial mask from URL
    const urlmask = getUrlQueryValue("mask");
    if ( urlmask != null ) {
        changeMask(getCaseInsensitiveMaskName(urlmask), false);
    }

    // Get initial rotation from URL
    const urlrotation = getUrlQueryValue("rotate");
    if ( urlrotation != null ) {
        const fifths = parseInt(urlrotation);
        if ( isNumber(fifths) == false )
            rotateMasksByFifths(fifths, false);
    }

    // Hide controls from URL
    const urlhidecontrols = getUrlQueryValue("hidecontrols");
    if ( ["1","true"].includes(urlhidecontrols) ) {
        switchControlsVisibility();
    }

}

function readStringFromLocalStorage(key, default_value) {
    if ( storageAvailable("localStorage") ) {
        const val = localStorage.getItem(key);
        return (val == null) ? default_value : val;
    }
    return default_value;
}

function readBoolFromLocalStorage(key, default_bool_value) {
    return (readStringFromLocalStorage(key, default_bool_value.toString()) === true.toString());
}

function writeStringToLocalStorage(key, value) {
    if ( storageAvailable("localStorage") )
        localStorage.setItem(key, value);
}

// from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}

function switchControlsVisibility() {
    control_panel_visible = ! control_panel_visible;
    const control_panel = document.getElementById("Controls");
    control_panel.style.visibility = control_panel_visible ? "visible" : "hidden";
    adaptForScreen();
}

function resizeEventHandler() {
    const ratio = window.parent.innerWidth / window.parent.innerHeight;
    if (  ( (ratio <  1.0) && (vertical_screen == false) ) ||
          ( (ratio >= 1.0) && (vertical_screen == true ) ) ) {
        vertical_screen = ! vertical_screen;
        adaptForScreen();
    }
}

function adaptForScreen() {
    const t = 196.9;
    const fifths_circle = document.getElementById("FthCircle");
    const control_panel = document.getElementById("Controls");
    if ( vertical_screen ) {
        // portrait mode
        var fifths_circle_transform = `translate(-${t} ${t})`;
        var control_panel_transform = `translate(-3 ${t}) scale(0.51 1)`;
        var viewbox = (control_panel_visible)
            ? `0 0 ${t} ${241.64582 + t}`
            : `0 0 ${t} ${241.64582 + t - control_panel.getBBox().height - 6}`;
    } else {
        // landscape mode
        var fifths_circle_transform = "translate(0 0)";
        var control_panel_transform = "translate(0 0) scale(1 1)";
        var viewbox = (control_panel_visible)
            ? "0 0 397.15732 241.64582"
            : `0 0 397.15732 ${241.64582 - control_panel.getBBox().height - 6}`;
    }
    fifths_circle.setAttribute("transform", fifths_circle_transform);
    control_panel.setAttribute("transform", control_panel_transform);
    svg_root.setAttribute("viewBox", viewbox);
}


/****************************
 *                          *
 *     Utility routines     *
 *                          *
 ****************************/

function clampPitch(value, min, max) {
    while (value > max) value -= 12;
    while (value < min) value += 12;
    return value;
}

function clampAngle(deg, center = 0, half_window = 180) {
    const min = center - half_window;
    const max = center + half_window;
    while (deg > max) deg -= 360;
    while (deg < min) deg += 360;
    return deg;
}

function radToDeg(rad) {
    return rad*(180/Math.PI);
}

function degToRad(deg) {
    return deg*(Math.PI/180);
}

function pointInRect(rect, px, py) {
    return ( px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom );
}

function getUrlQueryValue(param, to_lower_case = true) {
    const result = new URLSearchParams(window.parent.location.search).get(param);
    if ( result != null )
        return (to_lower_case) ? result.toLowerCase() : result;
    return null;
}

function isNumber(x) {
    return ( !isNaN(x) && x != null && x != "" );
}


/****************************
 *                          *
 *   Translation routines   *
 *                          *
 ****************************/

function getPreferredTranslation(available_translations) {
    // check url query
    var url_param_lang = getUrlQueryValue("lang");
    if ( url_param_lang != null ) {
        url_param_lang = url_param_lang.toLowerCase();
        for ( let translation of available_translations ) {
            if ( url_param_lang == translation )
                return translation;
        }
    }
    // check browser languages
    for ( let lang of navigator.languages ) {
        lang = lang.toLowerCase();
        for ( let translation of available_translations ) {
            if ( lang.startsWith(translation) )
                return translation;
        }
    }
    // return default
    return "en";
}

function getTranslatedStr(key, i18n_data) {
    if ( i18n_data.hasOwnProperty(key) ) {
        return i18n_data[key];
    } else {
        console.log(`getTranslatedStr():\nKey '${key}' not found for language '${language}'.`);
        return null;
    }
}

function translate(element, i18n_data) {
    // translate element if it has i18n attribute
    if ( element.hasAttribute("i18n") ) {
        const str = getTranslatedStr(element.getAttribute("i18n"), i18n_data);
        if ( str != null )
            element.innerHTML = str;
    }
    // recurse into child nodes
    if ( element.hasChildNodes() ) {
        for ( let child of element.children ) {
            translate(child, i18n_data);
        }
    }
}

function translateStringsMap(i18n_data) {
    for ( let k of translatable_strings.keys() ) {
        const s = getTranslatedStr(k, i18n_data);
        if ( s != null )
            translatable_strings.set(k, s);
    }
}

async function translateSvgAsync() {
    // english is the source language
    if ( language == "en" ) return;
    try {
        const file_name = `locale/${language}.json`;
        const response = await fetch(file_name);
        if ( ! response.ok )
            throw new Error(`Response status: ${response.status}`);
        const data = await response.json();
        translateStringsMap(data);
        window.parent.document.title = translatable_strings.get("title");
        translate(svg_root, data);
    } catch (error) {
        console.log(`translateSvgAsync(${language}) error: ${error}.`);
    }
}
