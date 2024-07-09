
const svg_root = document.getElementById("svg1");

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

const COLOR_BTN_MASK_ON = "#00ff77";
const COLOR_BTN_MASK_OFF = "#ffffdd";

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

const note_names_diatonic = new Map ([
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
    [-11, [["ff","f","ff","ff","f","ff","f","ff","f","ff","ff","f"],  [-4, -5], [-9, 5], [-10,-12], 1]],
    // Dbb Major
    [-12, [["ff","f","ff","ff","f","ff","f","ff","f","ff","ff","f"],  [-5, -6], [-10, 6], [-11,-1], 0]]
]);

const note_names_major_thirds = new Map ([
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

const note_names_minor_thirds = new Map ([
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

note_names_enharmonics1 = ["n","e","n","e","n","n","e","n","e","n","e","n"];
note_names_enharmonics2 = ["e","e","n","e","e","e","e","n","e","n","e","e"];
note_names_numbers      = ["p","p","p","p","p","p","p","p","p","p","p","p"];

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
        mask.style.transitionDelay = ( (delay == true) ? "0.4s" : "0s" );
        mask.style.transitionDuration = "0.2s";
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
        mask.style.transitionDuration = "0.2s";
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

function rotateMasks(steps, animate = true) {
    transpose(steps);
    chromatic_mask_rotation = 30 * chromatic_transposition;
    fifths_mask_rotation = 30 * fifths_transposition;
    if ( visible_mask != null ) {
        const mask_data = masks.get(visible_mask)[0];
        applyMaskRotation(mask_data[0], chromatic_mask_rotation, animate);
        applyMaskRotation(mask_data[1], fifths_mask_rotation, animate);
    }
    updateNoteNames(0.25);
}

function applyMaskRotation(mask, degrees, animate) {
    if (animate == true && mask.style.visibility == "visible") {
        mask.style.transition = "rotate 0.75s ease-in-out";
        mask.style.transitionDelay = "0s";
    } else {
        mask.style.transition = "rotate none";
    }
    mask.style.rotate = `${degrees}deg`;
}

function transpose(steps) {
    chromatic_transposition += steps;
    switch (steps) {
        case  2: fifths_transposition +=  2; break;
        case -2: fifths_transposition += -2; break;
        case  7: fifths_transposition +=  1; break;
        case -7: fifths_transposition += -1; break;
        default: fifths_transposition += 7 * steps;
    }
    // handle automatic names change
    if ( typeof(note_names_key) == "number" ) {
        let names_map;
        switch ( visible_mask ) {
            case "MajorThirds": names_map = note_names_major_thirds; break;
            case "MinorThirds": names_map = note_names_minor_thirds; break;
            default           : names_map = note_names_diatonic;
        }
        switch ( steps ) {
            case  1: note_names_key = names_map.get(note_names_key)[1][0]; break;
            case -1: note_names_key = names_map.get(note_names_key)[1][1]; break;
            case  2: note_names_key = names_map.get(note_names_key)[2][0]; break;
            case -2: note_names_key = names_map.get(note_names_key)[2][1]; break;
            case  7: note_names_key = names_map.get(note_names_key)[3][0]; break;
            case -7: note_names_key = names_map.get(note_names_key)[3][1];
        }
    }
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

function updateNoteNames(delay = 0.0) {
    if ( typeof(note_names_key) == "number" ) {
        automatic_names = true;
        if ( ["Pentatonic","Diatonic"].includes(visible_mask) ) {
            note_names_key = modularClamp(note_names_key, -12, 14, 12);
            showNoteNames(note_names_diatonic.get(note_names_key)[0], delay);
        } else if ( ["HarmonicMinor","MelodicMinor"].includes(visible_mask) ) {
            note_names_key = modularClamp(note_names_key, -11, 14, 12);
            showNoteNames(note_names_diatonic.get(note_names_key)[0], delay);
        } else if ( visible_mask == "MajorThirds" ) {
            note_names_key = modularClamp(note_names_key, -15, 11, 12);
            showNoteNames(note_names_major_thirds.get(note_names_key)[0], delay);
        } else if ( visible_mask == "MinorThirds" ) {
            note_names_key = modularClamp(note_names_key, -6, 19, 12);
            showNoteNames(note_names_minor_thirds.get(note_names_key)[0], delay);
        } else {
            showNoteNames(note_names_enharmonics1, delay);
            automatic_names = false;
        }
    } else {
        switch (note_names_key) {
            case "enharmonics1": showNoteNames(note_names_enharmonics1, delay); break;
            case "enharmonics2": showNoteNames(note_names_enharmonics2, delay); break;
            case "numbers"     : showNoteNames(note_names_numbers, delay); break;
        }
        automatic_names = false;
    }
    updateSwapEnharmonicsBtn();
}

function showNoteNames(postfix_array, delay) {
    const showNoteName = (elm) => {
        if (window.getComputedStyle(elm).visibility == "hidden") {
            elm.style.transitionProperty = "visibility, transform";
            elm.style.transitionDelay = `${delay + 0.1}s`;
            elm.style.transitionDuration = "0.1s";
            elm.style.transitionTimingFunction = "ease-in-out";
            elm.style.visibility = "visible";
            elm.style.transform = "scale(1, 1)";
        }
    };
    const hideNoteName = (elm) => {
        if (window.getComputedStyle(elm).visibility == "visible") {
            elm.style.transitionProperty = "visibility, transform";
            elm.style.transitionDelay = `${delay}s`;
            elm.style.transitionDuration = "0.1s";
            elm.style.transitionTimingFunction = "ease-in-out";
            elm.style.visibility = "hidden";
            elm.style.transform = "scale(1, 0)";
        }
    };
    for (let i = 0; i < 12; i++) {
        let chr_note_group = document.getElementById(`ChrNote${i}`);
        let fth_note_group = document.getElementById(`FthNote${i}`);
        let id_chr_visible = `ChrNote${i}${postfix_array[i]}`;
        let id_fth_visible = `FthNote${i}${postfix_array[i]}`;
        for (let elm of chr_note_group.childNodes) {
            if (elm.id == id_chr_visible)
                showNoteName(elm);
            else
                hideNoteName(elm);
        }
        for (let elm of fth_note_group.childNodes) {
            if (elm.id == id_fth_visible)
                showNoteName(elm);
            else
                hideNoteName(elm);
        }
    }
}

function checkNamesSwitch(switch_id) {
    for (let elm_id of options_names_switches) {
        document.getElementById(elm_id + "Mark").style.display = 
            (elm_id == switch_id) ? "inline" : "none";
    }
    writeStringToLocalStorage("checked_names_switch", switch_id);
}

function changeNoteNames(value) {
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
            note_names_key = modularClamp(fifths_transposition, -5, 6, 12);
    }
    writeStringToLocalStorage("note_names", value);
    updateNoteNames();
}

function swapEnharmonics() {
    if (automatic_names == true) {
        if ( ["Pentatonic","Diatonic","HarmonicMinor","MelodicMinor"].includes(visible_mask) ) {
            note_names_key = note_names_diatonic.get(note_names_key)[4];
        } else if ( visible_mask == "MajorThirds" ) {
            note_names_key = note_names_major_thirds.get(note_names_key)[4];
        } else if ( visible_mask == "MinorThirds" ) {
            note_names_key = note_names_minor_thirds.get(note_names_key)[4];
        }
        updateNoteNames();
    }
}


/****************************
 *                          *
 *      Other routines      *
 *                          *
 ****************************/

function switchShowBlackKeys() {
    black_keys_visible = (! black_keys_visible);
    writeStringToLocalStorage("black_keys_visible", black_keys_visible.toString());
    updateShowBlackKeys();
}

function updateShowBlackKeys() {
    if (black_keys_visible == true) {
        document.getElementById("ChkBlackKeysMark").style.display = "inline";
        document.getElementById("ChrCirclesBicolor").style.display = "inline";
        document.getElementById("ChrCirclesWhite").style.display = "none";
        document.getElementById("FthCirclesBicolor").style.display = "inline";
        document.getElementById("FthCirclesWhite").style.display = "none";
    } else {
        document.getElementById("ChkBlackKeysMark").style.display = "none";
        document.getElementById("ChrCirclesBicolor").style.display = "none";
        document.getElementById("ChrCirclesWhite").style.display = "inline";
        document.getElementById("FthCirclesBicolor").style.display = "none";
        document.getElementById("FthCirclesWhite").style.display = "inline";
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
    btn_elm = document.getElementById("BtnSwapEnharmonics");
    btnbk_elm = document.getElementById("BtnSwapEnharmonicsBk");
    btntx_elm = document.getElementById("BtnSwapEnharmonicsTxt");
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

    initializeMasks();

    // Set cursor for clickable controls
    for (let elm_id of clickable_elements) {
        let elm = document.getElementById(elm_id);
        if (elm != null)
            elm.style.cursor = "pointer";
    }

    // Set style for note names
    for (let grandpa_id of ["ChrNames","FthNames"]) {
        let grandpa = document.getElementById(grandpa_id);
        for (let parent of grandpa.childNodes) {
            for (let elm of parent.childNodes) {
                elm.style.visibility = "hidden";
                elm.style.display = "inline";
                elm.style.transformBox = "border-box";
                elm.style.transformOrigin = "center center";
                elm.style.transform = "scale(1, 0)";
            }
        }
    }

    // Read stored preferences
    dark_background = readBoolFromLocalStorage("dark_background", false);
    black_keys_visible = readBoolFromLocalStorage("black_keys_visible", true);
    updateBackground();
    updateShowBlackKeys();
    changeNoteNames(readStringFromLocalStorage("note_names", "auto"));

    // Respond to window resizing
    window.parent.addEventListener("resize", resizeEventHandler);
    resizeEventHandler();

}

function readStringFromLocalStorage(key, default_value) {
    if ( storageAvailable("localStorage") ) {
        const val = localStorage.getItem(key);
        if (val == null)
            return default_value;
        return val;
    }
    return default_value;
}

function readBoolFromLocalStorage(key, default_bool_value) {
    return (readStringFromLocalStorage(key, default_bool_value.toString()) === true.toString());
}

function writeStringToLocalStorage(key, value) {
    if ( storageAvailable("localStorage") ) {
        localStorage.setItem(key, value);
    }
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

function resizeEventHandler() {
    const ratio = window.parent.innerWidth / window.parent.innerHeight;
    if ( (ratio < 1.0) && (vertical_screen == false) )
        adaptForPortraitScreen();
    if ( (ratio >= 1.0) && (vertical_screen == true) )
        adaptForLandscapeScreen();
}

/*
function changeScreenOrientation() {
    if ( window.parent.screen.orientation.type == "portrait-primary" ||
         window.parent.screen.orientation.type == "portrait-secondary"  ) {
        adaptForPortraitScreen();
    } else {
        adaptForLandscapeScreen();
    }
}
*/

function adaptForPortraitScreen() {
    const t = 196.9;
    document.getElementById("FthCircle").setAttribute("transform", `translate(-${t} ${t})`);
    document.getElementById("Controls").setAttribute("transform", `translate(-3 ${t}) scale(0.51 1)`);
    svg_root.setAttribute("viewBox", `0 0 ${t} ${241.64582 + t}`);
    vertical_screen = true;
}

function adaptForLandscapeScreen() {
    document.getElementById("FthCircle").setAttribute("transform", "translate(0 0)");
    document.getElementById("Controls").setAttribute("transform", "translate(0 0) scale(1 1)");
    svg_root.setAttribute("viewBox", "0 0 397.15732 241.64582");
    vertical_screen = false;
}

function modularClamp(value, min, max, minuend) {
    let new_val = value;
    while (new_val > max) new_val -= minuend;
    while (new_val < min) new_val += minuend;
    return new_val;
}
