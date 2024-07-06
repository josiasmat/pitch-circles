
const svg_root = document.getElementById("svg1");

var chromatic_mask_rotation = 0;
var fifths_mask_rotation = 0;
var black_keys_visible = true;
var dark_background = false;
var selected_mask_btn_id = "";

const COLOR_BTN_MASK_ENABLED = "#00ff77";
const COLOR_BTN_MASK_DISABLED = "#ffffdd";

const chromatic_masks = [
    "ChrPentatonicMask",
    "ChrDiatonicMask",
    "ChrHarmonicMinorMask",
    "ChrMelodicMinorMask",
    "ChrWholeTonesMask",
    "ChrOctatonicMask",
    "ChrChromaticMask",
    "ChrMajorThirdsMask",
    "ChrMinorThirdsMask"
];

const fifths_masks = [
    "FthPentatonicMask",
    "FthDiatonicMask",
    "FthHarmonicMinorMask",
    "FthMelodicMinorMask",
    "FthWholeTonesMask",
    "FthChromaticMask",
    "FthOctatonicMask",
    "FthMajorThirdsMask",
    "FthMinorThirdsMask"
];

const all_masks = chromatic_masks.concat(fifths_masks);

const chromatic_note_names = [
    "ChrNamesEnharmonics1",
    "ChrNamesEnharmonics2",
    "ChrNamesSharps1",
    "ChrNamesSharps2",
    "ChrNamesFlats1",
    "ChrNamesFlats2",
    "ChrNamesPitchClasses"
]

const fifths_note_names = [
    "FthNamesEnharmonics1",
    "FthNamesEnharmonics2",
    "FthNamesSharps1",
    "FthNamesSharps2",
    "FthNamesFlats1",
    "FthNamesFlats2",
    "FthNamesPitchClasses"
]

const all_note_names = chromatic_note_names.concat(fifths_note_names);

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
    "SwitchNamesSharps1", "SwitchNamesSharps2",
    "SwitchNamesFlats1", "SwitchNamesFlats2",
    "SwitchNamesPitchClasses" /*, "SwitchNamesDynamic"*/
];

const options_clickables = options_names_switches.concat(["ChkBlackKeys", "ChkDarkBackground"]);

const clickable_elements = tabs.concat(masks_buttons, transpose_buttons, options_clickables);


function showMaskPentatonic() {
    showMasks(["ChrPentatonicMask", "FthPentatonicMask"], "BtnMaskPentatonic");
}

function showMaskDiatonic() {  
    showMasks(["ChrDiatonicMask", "FthDiatonicMask"], "BtnMaskDiatonic");
}

function showMaskHarmonicMinor() {  
    showMasks(["ChrHarmonicMinorMask", "FthHarmonicMinorMask"], "BtnMaskHarmonicMinor");
}

function showMaskMelodicMinor() {  
    showMasks(["ChrMelodicMinorMask", "FthMelodicMinorMask"], "BtnMaskMelodicMinor");
}

function showMaskWholeTones() {  
    showMasks(["ChrWholeTonesMask", "FthWholeTonesMask"], "BtnMaskWholeTones");
}

function showMaskChromatic() {  
    showMasks(["ChrChromaticMask", "FthChromaticMask"], "BtnMaskChromatic");
}

function showMaskOctatonic() {  
    showMasks(["ChrOctatonicMask", "FthOctatonicMask"], "BtnMaskOctatonic");
}

function showMaskMajorThirds() {  
    showMasks(["ChrMajorThirdsMask", "FthMajorThirdsMask"], "BtnMaskMajorThirds");
}

function showMaskMinorThirds() {  
    showMasks(["ChrMinorThirdsMask", "FthMinorThirdsMask"], "BtnMaskMinorThirds");
}

function showMasks(masks_ids, button_id) {
    if ( selected_mask_btn_id == button_id ) {
        hideAllMasks();
        setMaskButtonsColors("");
        selected_mask_btn_id = "";
    } else {
        hideAllMasksExcept(masks_ids);
        for (let mask_id of masks_ids) {
            showMask(mask_id);
        }
        setMaskButtonsColors(button_id);
        selected_mask_btn_id = button_id;
    }
}

function showMask(mask_id) {
    let elm = document.getElementById(mask_id);
    elm.style.transition = "all 0.2s ease-out";
    if (selected_mask_btn_id == "")
        elm.style.transitionDelay = "none";
    else
        elm.style.transitionDelay = "0.4s";
    elm.style.scale = "100%";
	elm.style.opacity = "1";
}

function hideMask(mask_id) {
    let elm = document.getElementById(mask_id);
    elm.style.transition = "all 0.2s ease-in";
    elm.style.transitionDelay = "none";
    elm.style.scale = "120%";
    elm.style.opacity = "0";
}

function hideAllMasksExcept(masks_ids) {
    for (let mask_id of all_masks) {
        if ( mask_id in masks_ids == false ) {
            hideMask(mask_id);
        }
    }
}

function hideAllMasks() {
    hideAllMasksExcept([]);
}

function setMaskButtonsColors(selected_btn_id) {
    for (let btn_id of masks_buttons) {
        let elm = document.getElementById(btn_id + "Bk");
        if (btn_id == selected_btn_id)
            elm.style.fill = COLOR_BTN_MASK_ENABLED;
        else
            elm.style.fill = COLOR_BTN_MASK_DISABLED;
    }
}

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

function applyMaskRotation(mask_id, degrees, animate) {
    let elm = document.getElementById(mask_id);
    if (animate && elm.style.opacity > 0) {
        elm.style.transition = "rotate 0.75s ease-in-out";
        elm.style.transitionDelay = "none";
    } else {
        elm.style.transition = "rotate none";
    }
    elm.style.rotate = `${degrees}deg`;
}

function applyMasksRotation(animate = true) {
    for (let mask_id of chromatic_masks) {
        applyMaskRotation(mask_id, chromatic_mask_rotation, animate);
    }
    for (let mask_id of fifths_masks) {
        applyMaskRotation(mask_id, fifths_mask_rotation, animate);
    }
}

function rotateMasks(steps) {
    chromatic_mask_rotation += (30 * steps);
    switch (Math.abs(steps)) {
        case 2:
            fifths_mask_rotation += (60 * Math.sign(steps));
            break;
        case 7:
            fifths_mask_rotation += (30 * Math.sign(steps));
            break;
        default:
            let x = 210 * steps;
            while (Math.abs(x) >= 360) {
                x -= (360 * Math.sign(x));
            }
            fifths_mask_rotation += x;

    }
    //if (mask_rotation >= 360)
    //    mask_rotation -= 360;
    applyMasksRotation(true);
}

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
    /* Text element has a 'tspan' inside, that's
        why .firstChild is needed to change its color. */
    let elm_label_chr = document.getElementById("LabelChromaticCircle").firstChild;
    let elm_label_fth = document.getElementById("LabelFifthsCircle").firstChild;
    let white_key_markers = document.getElementsByClassName("whiteKeyMarker");
    let black_key_markers = document.getElementsByClassName("blackKeyMarker");
    if (dark_background) {
        elm_mark.style.display = "inline";
        elm_label_chr.style.fill = "white";
        elm_label_fth.style.fill = "white";
        svg_root.style.backgroundColor = "black";
        for ( let elm of white_key_markers ) elm.style.stroke = "black";
        for ( let elm of black_key_markers ) elm.style.stroke = "#666666";
    } else {
        elm_mark.style.display = "none";
        elm_label_chr.style.fill = "black";
        elm_label_fth.style.fill = "black";
        svg_root.style.backgroundColor = "white";
        for ( let elm of white_key_markers ) elm.style.stroke = "#666666";
        for ( let elm of black_key_markers ) elm.style.stroke = "white";
    }
}

function setNamesEnharmony1() {
    checkNamesSwitch("SwitchNamesEnharmony1");
    setNamesVisibility("NamesEnharmonics1");
}

function setNamesEnharmony2() {
    checkNamesSwitch("SwitchNamesEnharmony2");
    setNamesVisibility("NamesEnharmonics2");
}

function setNamesSharps1() {
    checkNamesSwitch("SwitchNamesSharps1");
    setNamesVisibility("NamesSharps1");
}

function setNamesSharps2() {
    checkNamesSwitch("SwitchNamesSharps2");
    setNamesVisibility("NamesSharps2");
}

function setNamesFlats1() {
    checkNamesSwitch("SwitchNamesFlats1");
    setNamesVisibility("NamesFlats1");
}

function setNamesFlats2() {
    checkNamesSwitch("SwitchNamesFlats2");
    setNamesVisibility("NamesFlats2");
}

function setNamesPitchClasses() {
    checkNamesSwitch("SwitchNamesPitchClasses");
    setNamesVisibility("NamesPitchClasses");

}

function checkNamesSwitch(switch_id) {
    document.getElementById(switch_id + "Mark").style.display = "inline";
    for (let elm_id of options_names_switches) {
        if (elm_id != switch_id) {
            document.getElementById(elm_id + "Mark").style.display = "none";
        }
    }
    writeStringToLocalStorage("checked_names_switch", switch_id);
}

function setNamesVisibility(elm_id_postfix) {
    let chr_elm_id = "Chr" + elm_id_postfix;
    for (let elm_id of chromatic_note_names) {
        let elm = document.getElementById(elm_id);
        if (elm != null) {
            if (elm_id == chr_elm_id)
                elm.style.display = "inline";
            else
                elm.style.display = "none";
        }
    }
    let fth_elm_id = "Fth" + elm_id_postfix;
    for (let elm_id of fifths_note_names) {
        let elm = document.getElementById(elm_id);
        if (elm != null) {
            if (elm_id == fth_elm_id)
                elm.style.display = "inline";
            else
                elm.style.display = "none";
        }
    }
    writeStringToLocalStorage("names_element_id_postfix", elm_id_postfix);
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

    // Set properties for masks
    for (let elm_id of all_masks) {
        let elm = document.getElementById(elm_id);
        elm.style.transformBox = "border-box";
        elm.style.transformOrigin = "center center";
        elm.style.opacity = "0";
        elm.style.scale = "120%";
        elm.style.display = "inline";
    }

    // Set cursor for clickable controls
    for (let elm_id of clickable_elements) {
        let elm = document.getElementById(elm_id);
        if (elm != null)
            elm.style.cursor = "pointer";
    }

    // Read stored preferences
    dark_background = readBoolFromLocalStorage("dark_background", false);
    black_keys_visible = readBoolFromLocalStorage("black_keys_visible", true);
    updateBackground();
    updateShowBlackKeys();
    checkNamesSwitch(readStringFromLocalStorage("checked_names_switch", "SwitchNamesEnharmony1"));
    setNamesVisibility(readStringFromLocalStorage("names_element_id_postfix", "NamesEnharmonics1"));

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
  