"use strict";const AVAILABLE_TRANSLATIONS=["en","es","pt"];const COLOR_BTN_MASK_ON="#00ff77";const COLOR_BTN_MASK_OFF="#ffffdd";const ANGLE_SEMITONE=30;const ANGLE_FIFTH=ANGLE_SEMITONE*7;var language="en";var vertical_screen=false;var visible_mask=null;var chromatic_transposition=0;var fifths_transposition=0;var chromatic_mask_rotation=0;var fifths_mask_rotation=0;var black_keys_visible=true;var dark_background=false;var note_names_key="auto";var automatic_names=true;const svg_root=document.getElementById("svg1");const note_names_diatonic=new Map([[0,[["n","f","n","f","n","n","s","n","f","n","f","n"],[7,5],[2,-2],[1,-1],12]],[1,[["n","s","n","f","n","n","s","n","f","n","f","n"],[8,-6],[3,-1],[2,0],13]],[2,[["n","s","n","f","n","n","s","n","s","n","f","n"],[9,-5],[4,0],[3,1],14]],[3,[["n","s","n","s","n","n","s","n","s","n","f","n"],[10,-4],[5,1],[4,2],-9]],[4,[["n","s","n","s","n","n","s","n","s","n","s","n"],[-1,-3],[6,2],[5,3],-8]],[5,[["n","s","n","s","n","s","s","n","s","n","s","n"],[0,-2],[7,3],[6,4],-7]],[6,[["s","s","n","s","n","s","s","n","s","n","s","n"],[1,-1],[8,4],[7,5],-6]],[7,[["s","s","n","s","n","s","s","ss","s","n","s","n"],[2,0],[9,5],[8,6],-5]],[8,[["s","s","ss","s","n","s","s","ss","s","n","s","n"],[3,1],[10,6],[9,7],-4]],[9,[["s","s","ss","s","n","s","s","ss","s","ss","s","n"],[4,2],[11,7],[10,8],-3]],[10,[["s","s","ss","s","ss","s","s","ss","s","ss","s","n"],[5,3],[12,8],[11,9],-2]],[11,[["s","s","ss","s","ss","s","s","ss","s","ss","s","ss"],[6,4],[13,9],[12,10],-1]],[12,[["s","s","ss","s","ss","s","ss","ss","s","ss","s","ss"],[7,5],[14,10],[13,11],-12]],[13,[["s","s","ss","s","ss","s","ss","ss","s","ss","s","ss"],[8,6],[3,11],[14,12],-11]],[14,[["s","ss","ss","s","ss","s","ss","ss","s","ss","s","ss"],[9,7],[4,12],[3,13],-10]],[-1,[["n","f","n","f","n","n","s","n","f","n","f","n"],[6,4],[1,-3],[0,-2],11]],[-2,[["n","f","n","f","n","n","f","n","f","n","f","n"],[5,3],[0,-4],[-1,-3],10]],[-3,[["n","f","n","f","n","n","f","n","f","n","f","f"],[4,2],[-1,-5],[-2,-4],9]],[-4,[["n","f","n","f","f","n","f","n","f","n","f","f"],[3,1],[-2,-6],[-3,-5],8]],[-5,[["n","f","n","f","f","n","f","n","f","ff","f","f"],[2,0],[-3,-7],[-4,-6],7]],[-6,[["n","f","ff","f","f","n","f","n","f","ff","f","f"],[1,-1],[-4,-8],[-5,-7],6]],[-7,[["n","f","ff","f","f","n","f","ff","f","ff","f","f"],[0,-1],[-5,-9],[-6,-8],5]],[-8,[["ff","f","ff","f","f","n","f","ff","f","ff","f","f"],[-1,-2],[-6,-10],[-7,-9],4]],[-9,[["ff","f","ff","f","f","ff","f","ff","f","ff","f","f"],[-2,-3],[-7,-11],[-8,-10],3]],[-10,[["ff","f","ff","f","f","ff","f","ff","f","ff","ff","f"],[-3,-4],[-8,-12],[-9,-11],2]],[-11,[["ff","f","ff","ff","f","ff","f","ff","f","ff","ff","f"],[-4,-5],[-9,0],[-10,-12],1]],[-12,[["ff","f","ff","ff","f","ff","f","ff","f","ff","ff","f"],[-5,-6],[-10,-2],[-11,-1],0]]]);const note_names_major_thirds=new Map([[0,[["n","s","n","s","n","n","s","n","s","n","f","n"],[7,5],[2,-2],[1,-1],-12]],[1,[["n","s","n","s","n","n","s","n","s","n","s","n"],[8,-6],[3,-1],[2,0],-11]],[2,[["n","s","n","s","n","s","s","n","s","n","s","n"],[9,-5],[4,0],[3,1],-10]],[3,[["s","s","n","s","n","s","s","n","s","n","s","n"],[10,-4],[5,1],[4,2],-9]],[4,[["s","s","n","s","n","s","s","ss","s","n","s","n"],[-1,-3],[6,2],[5,3],-8]],[5,[["s","s","ss","s","n","s","s","ss","s","n","s","n"],[0,-2],[7,3],[6,4],-7]],[6,[["s","s","ss","s","n","s","s","ss","s","ss","s","n"],[1,-1],[8,4],[7,5],-6]],[7,[["s","s","ss","s","ss","s","s","ss","s","ss","s","n"],[2,0],[9,5],[8,6],-5]],[8,[["s","s","ss","s","ss","s","s","ss","s","ss","s","ss"],[3,1],[10,6],[9,7],-4]],[9,[["s","s","ss","s","ss","s","ss","ss","s","ss","s","ss"],[4,2],[11,7],[10,8],-3]],[10,[["s","ss","ss","s","ss","s","ss","ss","s","ss","s","ss"],[5,3],[0,8],[11,9],-2]],[11,[["s","ss","ss","s","ss","s","ss","ss","s","ss","s","ss"],[6,4],[1,9],[0,10],-1]],[-1,[["n","s","n","s","n","n","s","n","s","n","f","n"],[6,4],[1,-3],[0,-2],11]],[-2,[["n","s","n","f","n","n","s","n","s","n","f","n"],[5,3],[0,-4],[-1,-3],10]],[-3,[["n","s","n","f","n","n","s","n","f","n","f","n"],[4,2],[-1,-5],[-2,-4],9]],[-4,[["n","f","n","f","n","n","s","n","f","n","f","n"],[3,1],[-2,-6],[-3,-5],8]],[-5,[["n","f","n","f","n","n","f","n","f","n","f","n"],[2,0],[-3,-7],[-4,-6],7]],[-6,[["n","f","n","f","n","n","f","n","f","n","f","f"],[1,-1],[-4,-8],[-5,-7],6]],[-7,[["n","f","n","f","f","n","f","n","f","n","f","f"],[0,-1],[-5,-9],[-6,-8],5]],[-8,[["n","f","n","f","f","n","f","n","f","ff","f","f"],[-1,-2],[-6,-10],[-7,-9],4]],[-9,[["n","f","ff","f","f","n","f","n","f","ff","f","f"],[-2,-3],[-7,-11],[-8,-10],3]],[-10,[["n","f","ff","f","f","n","f","ff","f","ff","f","f"],[-3,-4],[-8,-12],[-9,-11],2]],[-11,[["ff","f","ff","f","f","n","f","ff","f","ff","f","f"],[-4,-5],[-9,-13],[-10,-12],1]],[-12,[["ff","f","ff","f","f","ff","f","ff","f","ff","f","f"],[-5,-6],[-10,-14],[-11,-13],0]],[-13,[["ff","f","ff","f","f","ff","f","ff","f","ff","ff","f"],[-6,-7],[-11,-15],[-12,-14],-1]],[-14,[["ff","f","ff","ff","f","ff","f","ff","f","ff","ff","f"],[-7,-8],[-12,-4],[-13,-15],-2]],[-15,[["ff","f","ff","ff","f","ff","f","ff","f","ff","ff","f"],[-8,-9],[-13,-5],[-14,-4],-3]]]);const note_names_minor_thirds=new Map([[0,[["n","f","n","f","f","n","f","n","f","ff","f","f"],[7,5],[2,-2],[1,-1],12]],[1,[["n","f","n","f","f","n","f","n","f","n","f","f"],[8,-6],[3,-1],[2,0],1]],[2,[["n","f","n","f","n","n","f","n","f","n","f","f"],[9,-5],[4,0],[3,1],2]],[3,[["n","f","n","f","n","n","f","n","f","n","f","n"],[10,-4],[5,1],[4,2],3]],[4,[["n","f","n","f","n","n","s","n","f","n","f","n"],[-1,-3],[6,2],[5,3],-8]],[5,[["n","s","n","f","n","n","s","n","f","n","f","n"],[0,-2],[7,3],[6,4],-7]],[6,[["n","s","n","f","n","n","s","n","s","n","f","n"],[1,-1],[8,4],[7,5],-6]],[7,[["n","s","n","s","n","n","s","n","s","n","f","n"],[2,0],[9,5],[8,6],-5]],[8,[["n","s","n","s","n","n","s","n","s","n","s","n"],[3,1],[10,6],[9,7],-4]],[9,[["n","s","n","s","n","s","s","n","s","n","s","n"],[4,2],[11,7],[10,8],-3]],[10,[["s","s","n","s","n","s","s","n","s","n","s","n"],[5,3],[12,8],[11,9],-2]],[11,[["s","s","n","s","n","s","s","ss","s","n","s","n"],[6,4],[13,9],[12,10],-1]],[12,[["s","s","ss","s","n","s","s","ss","s","n","s","n"],[7,5],[14,10],[13,11],0]],[13,[["s","s","ss","s","n","s","s","ss","s","ss","s","n"],[8,6],[15,11],[14,12],1]],[14,[["s","s","ss","s","ss","s","s","ss","s","ss","s","n"],[9,7],[16,12],[15,13],2]],[15,[["s","s","ss","s","ss","s","s","ss","s","ss","s","ss"],[10,8],[17,13],[16,14],3]],[16,[["s","s","ss","s","ss","s","ss","ss","s","ss","s","ss"],[-1,9],[18,14],[17,15],4]],[17,[["s","ss","ss","s","ss","s","ss","ss","s","ss","s","ss"],[0,10],[19,15],[18,16],5]],[18,[["s","ss","ss","s","ss","s","ss","ss","s","ss","s","ss"],[1,-1],[-4,16],[19,17],6]],[19,[["s","ss","ss","s","ss","s","ss","ss","s","ss","s","ss"],[2,0],[-3,17],[-4,18],7]],[-1,[["n","f","ff","f","f","n","f","n","f","ff","f","f"],[6,4],[1,-3],[0,-2],11]],[-2,[["n","f","ff","f","f","n","f","ff","f","ff","f","f"],[5,3],[0,-4],[-1,-3],10]],[-3,[["ff","f","ff","f","f","n","f","ff","f","ff","f","f"],[4,2],[-1,-5],[-2,-4],9]],[-4,[["ff","f","ff","f","f","ff","f","ff","f","ff","f","f"],[3,1],[-2,-6],[-3,-5],8]],[-5,[["ff","f","ff","f","f","ff","f","ff","f","ff","ff","f"],[2,0],[-3,5],[-4,-6],7]],[-6,[["ff","f","ff","ff","f","ff","f","ff","f","ff","ff","f"],[1,-1],[-4,7],[-5,5],6]]]);const note_names_enharmonics1=["n","e","n","e","n","n","e","n","e","n","e","n"];const note_names_enharmonics2=["e","e","n","e","e","e","e","n","e","n","e","e"];const note_names_numbers=["p","p","p","p","p","p","p","p","p","p","p","p"];const masks=new Map([["Pentatonic",null],["Diatonic",null],["HarmonicMinor",null],["MelodicMinor",null],["WholeTones",null],["Octatonic",null],["MajorThirds",null],["MinorThirds",null],["Chromatic",null]]);const control_groups=["ControlsMasks","ControlsTranspose","ControlsOptions"]
const tabs=["TabMasks","TabTranspose","TabOptions"];const masks_buttons=["BtnMaskPentatonic","BtnMaskDiatonic","BtnMaskHarmonicMinor","BtnMaskMelodicMinor","BtnMaskWholeTones","BtnMaskChromatic","BtnMaskOctatonic","BtnMaskMajorThirds","BtnMaskMinorThirds"];const transpose_buttons=["g51","g52","g115","g117","g133","g135"];const options_names_switches=["SwitchNamesEnharmony1","SwitchNamesEnharmony2","SwitchNamesPitchClasses","SwitchNamesDynamic"];const options_clickables=options_names_switches.concat(["ChkBlackKeys","ChkDarkBackground","BtnSwapEnharmonics"]);const clickable_elements=tabs.concat(masks_buttons,transpose_buttons,options_clickables);function initializeMasks(){for(let mask of masks){masks.set(mask[0],[[document.getElementById(`Chr${mask[0]}Mask`),document.getElementById(`Fth${mask[0]}Mask`)],[document.getElementById(`BtnMask${mask[0]}`),document.getElementById(`BtnMask${mask[0]}Bk`)]]);}
for(let mask_data of masks){for(let mask of mask_data[1][0]){mask.style.transformBox="border-box";mask.style.transformOrigin="center center";mask.style.opacity="0";mask.style.visibility="hidden";mask.style.scale="120%";mask.style.display="inline";mask.style.cursor="grab";mask.style.touchAction="pinch-zoom";}}}
function changeMask(mask_key,animate=true){let delay=false;if(visible_mask!=null){const hiding_mask_data=masks.get(visible_mask);hideMask(hiding_mask_data[0][0],animate);hideMask(hiding_mask_data[0][1],animate);hiding_mask_data[1][1].style.fill=COLOR_BTN_MASK_OFF;delay=true;}
if(mask_key==visible_mask||mask_key==null){visible_mask=null;}else{visible_mask=mask_key;const showing_mask_data=masks.get(visible_mask);showMask(showing_mask_data[0][0],chromatic_mask_rotation,animate,delay);showMask(showing_mask_data[0][1],fifths_mask_rotation,animate,delay);showing_mask_data[1][1].style.fill=COLOR_BTN_MASK_ON;}
updateNoteNames();}
function showMask(mask,rotation_degrees=0,animate,delay){if(animate==true){mask.style.transitionProperty="scale, opacity";mask.style.transitionDelay=((delay==true)?"400ms":"0s");mask.style.transitionDuration="200ms";mask.style.transitionTimingFunction="ease-out";}else{mask.style.transition="none";}
mask.style.scale="100%";mask.style.opacity="1";mask.style.visibility="visible";mask.style.rotate=`${rotation_degrees}deg`;}
function hideMask(mask,animate){if(animate==true){mask.style.transitionProperty="scale, opacity, visibility";mask.style.transitionDelay="0s";mask.style.transitionDuration="200ms";mask.style.transitionTimingFunction="ease-in";}else{mask.style.transition="none";}
mask.style.scale="120%";mask.style.opacity="0";mask.style.visibility="hidden";}
function rotateMasks(steps,animate=true){transpose(steps);chromatic_mask_rotation=clampAngle(chromatic_transposition*ANGLE_SEMITONE,chromatic_mask_rotation,ANGLE_FIFTH);fifths_mask_rotation=clampAngle(fifths_transposition*ANGLE_SEMITONE,fifths_mask_rotation,ANGLE_FIFTH);if(visible_mask!=null){const mask_data=masks.get(visible_mask)[0];applyMaskRotation(mask_data[0],chromatic_mask_rotation,animate);applyMaskRotation(mask_data[1],fifths_mask_rotation,animate);}
updateNoteNames(0.25);}
function applyMaskRotation(mask,degrees,animate){if(animate==true&&mask.style.visibility=="visible")
doMaskRotation(mask,degrees,750);else
doMaskRotation(mask,degrees,0);}
function doMaskRotation(elm,angle_deg,animation_ms=0){elm.style.transition=(animation_ms==0)?"none":`rotate ${animation_ms}ms ease-in-out`;elm.style.rotate=`${angle_deg}deg`;}
function transpose(steps){chromatic_transposition+=steps;switch(steps){case 2:fifths_transposition+=2;break;case-2:fifths_transposition+=-2;break;case 7:fifths_transposition+=1;break;case-7:fifths_transposition+=-1;break;default:fifths_transposition+=7*steps;}
if(typeof(note_names_key)=="number"){let names_map;switch(visible_mask){case"MajorThirds":names_map=note_names_major_thirds;break;case"MinorThirds":names_map=note_names_minor_thirds;break;default:names_map=note_names_diatonic;}
switch(steps){case 1:note_names_key=names_map.get(note_names_key)[1][0];break;case-1:note_names_key=names_map.get(note_names_key)[1][1];break;case 2:note_names_key=names_map.get(note_names_key)[2][0];break;case-2:note_names_key=names_map.get(note_names_key)[2][1];break;case 7:note_names_key=names_map.get(note_names_key)[3][0];break;case-7:note_names_key=names_map.get(note_names_key)[3][1];}}}
function enableDragRotationOnMasks(){for(let mask_data of masks){for(let mask of mask_data[1][0]){mask.addEventListener("wheel",handleWheelEvent);mask.addEventListener("pointerdown",handleMaskDragPointerBegin);mask.addEventListener("pointerup",handleMaskDragPointerEnd);mask.addEventListener("pointercancel",handleMaskDragPointerEnd);mask.addEventListener("touchstart",handleMaskDragTouchBegin);mask.addEventListener("touchend",handleMaskDragTouchEnd);mask.addEventListener("touchcancel",handleMaskDragTouchEnd);}}}
function handleWheelEvent(ev){if(document.getElementById("ChrMasks").matches(":hover")){rotateMasks(Math.sign(ev.deltaY+ev.deltaX)*(-1));}else if(document.getElementById("FthMasks").matches(":hover")){rotateMasks(Math.sign(ev.deltaY+ev.deltaX)*(-7));}}
var mask_dragging_device={type:null,id:null};var mask_being_dragged=null;var mask_drag_rotation={amount:0,offset:0,rad(){return this.amount+this.offset;},deg(){return radToDeg(this.amount+this.offset);},set(angle_rad){this.amount=angle_rad;this.begun_rotating=true;},reset(mask_angle_rad,pointer_angle_rad){this.amount_rad=0;this.offset=mask_angle_rad-pointer_angle_rad;this.begun_rotating=false;},begun_rotating:false};function handleMaskDragPointerBegin(ev){if(mask_dragging_device.type!=null)return;mask_dragging_device.type="pointer";mask_dragging_device.id=ev.pointerId;maskDragBegin(ev.clientX,ev.clientY);mask_being_dragged.setPointerCapture(ev.pointerId);mask_being_dragged.addEventListener("pointermove",handleMaskDragPointerMove);}
function handleMaskDragTouchBegin(ev){if(mask_dragging_device.type!=null)return;ev.preventDefault();mask_dragging_device.type="touch";const touchObj=ev.changedTouches.at(-1);mask_dragging_device.id=touchObj.identifier;maskDragBegin(touchObj.clientX,touchObj.clientY);mask_being_dragged.addEventListener("touchmove",handleMaskDragTouchMove);}
function handleMaskDragPointerEnd(ev){if(mask_dragging_device.type!="pointer")return;mask_being_dragged.releasePointerCapture(ev.pointerId);mask_being_dragged.removeEventListener("pointermove",handleMaskDragPointerMove);maskDragEnd();mask_dragging_device.type=null;mask_dragging_device.id=null;}
function handleMaskDragTouchEnd(ev){if(mask_dragging_device.type!="touch")return;ev.preventDefault();for(let touchObj of ev.changedTouches){if(touchObj.identifier==mask_dragging_device.id){mask_being_dragged.removeEventListener("touchmove",handleMaskDragTouchMove);maskDragEnd();mask_dragging_device.type=null;mask_dragging_device.id=null;return;}}}
function handleMaskDragPointerMove(ev){if(mask_dragging_device.type=="pointer")
maskDragMove(ev.clientX,ev.clientY);}
function handleMaskDragTouchMove(ev){if(mask_dragging_device.type=="touch"){ev.preventDefault();for(let touchObj of ev.changedTouches){if(touchObj.identifier==mask_dragging_device.id){maskDragMove(touchObj.clientX,touchObj.clientY);return;}}}}
function maskDragBegin(px,py){const chr_mask=masks.get(visible_mask)[0][0];const fth_mask=masks.get(visible_mask)[0][1];if(pointInRect(chr_mask.getBoundingClientRect(),px,py)){mask_being_dragged=masks.get(visible_mask)[0][0];mask_drag_rotation.reset(degToRad(clampAngle(chromatic_mask_rotation)),computePointerAngle(mask_being_dragged.getBoundingClientRect(),px,py));}else if(pointInRect(fth_mask.getBoundingClientRect(),px,py)){mask_being_dragged=masks.get(visible_mask)[0][1];mask_drag_rotation.reset(degToRad(clampAngle(fifths_mask_rotation)),computePointerAngle(mask_being_dragged.getBoundingClientRect(),px,py));}
mask_being_dragged.style.cursor="grabbing";}
function maskDragEnd(){if(mask_drag_rotation.begun_rotating==true){const chr_mask=masks.get(visible_mask)[0][0];const fth_mask=masks.get(visible_mask)[0][1];if(mask_being_dragged.id.startsWith("Chr")){const steps=clampPitch(Math.round(mask_drag_rotation.deg()/ANGLE_SEMITONE),-5,6);chromatic_transposition=steps;fifths_transposition=clampPitch(steps*7,-5,6);if(typeof(note_names_key)=="number")
note_names_key=fifths_transposition;chromatic_mask_rotation=clampAngle(chromatic_transposition*ANGLE_SEMITONE,mask_drag_rotation.deg());fifths_mask_rotation=clampAngle(fifths_transposition*ANGLE_SEMITONE,fifths_mask_rotation);}else{const steps=clampPitch(Math.round(mask_drag_rotation.deg()/ANGLE_SEMITONE),-5,6);fifths_transposition=steps;chromatic_transposition=clampPitch(steps*7,-5,6);if(typeof(note_names_key)=="number")
note_names_key=fifths_transposition;fifths_mask_rotation=clampAngle(fifths_transposition*ANGLE_SEMITONE,mask_drag_rotation.deg());chromatic_mask_rotation=clampAngle(chromatic_transposition*ANGLE_SEMITONE,chromatic_mask_rotation);}
updateNoteNames(0);applyMaskRotation(chr_mask,chromatic_mask_rotation,true);applyMaskRotation(fth_mask,fifths_mask_rotation,true);}
mask_being_dragged.style.cursor="grab";mask_being_dragged=null;}
function maskDragMove(px,py){if(mask_drag_rotation.begun_rotating==false&&typeof(note_names_key)=="number")
updateNoteNames(0,"enharmonics1");const rect=mask_being_dragged.getBoundingClientRect();mask_drag_rotation.set(computePointerAngle(rect,px,py));doMaskRotation(mask_being_dragged,mask_drag_rotation.deg(),0);}
function computePointerAngle(rect,px,py){const cx=(rect.width/2.0)+rect.left;const cy=(rect.height/2.0)+rect.top;return Math.atan2(py-cy,px-cx);}
function showTabMasks(){hideTab("TabTransposeBk","ControlsTranspose");hideTab("TabOptionsBk","ControlsOptions");showTab("TabMasksBk","ControlsMasks");}
function showTabTranspose(){hideTab("TabMasksBk","ControlsMasks");hideTab("TabOptionsBk","ControlsOptions");showTab("TabTransposeBk","ControlsTranspose");}
function showTabOptions(){hideTab("TabMasksBk","ControlsMasks");hideTab("TabTransposeBk","ControlsTranspose");showTab("TabOptionsBk","ControlsOptions");}
function showTab(tabbk_id,controls_id){document.getElementById(tabbk_id).style.display="none";document.getElementById(controls_id).style.display="inline";}
function hideTab(tabbk_id,controls_id){document.getElementById(tabbk_id).style.display="inline";document.getElementById(controls_id).style.display="none";}
function hideAllTabs(){for(let elm_id of control_groups){let elm=document.getElementById(elm_id);elm.style.display="none";}
for(let elm_id of tabs){let elm=document.getElementById(elm_id);elm.style.display="inline";}}
function updateNoteNames(delay_ms=0,override_names_type=null){if(override_names_type==null)
override_names_type=note_names_key;if(typeof(override_names_type)=="number"){automatic_names=true;if(["Pentatonic","Diatonic"].includes(visible_mask)){override_names_type=clampPitch(override_names_type,-12,14);showNoteNames(note_names_diatonic.get(override_names_type)[0],delay_ms);}else if(["HarmonicMinor","MelodicMinor"].includes(visible_mask)){override_names_type=clampPitch(override_names_type,-11,14);showNoteNames(note_names_diatonic.get(override_names_type)[0],delay_ms);}else if(visible_mask=="MajorThirds"){override_names_type=clampPitch(override_names_type,-15,11);showNoteNames(note_names_major_thirds.get(override_names_type)[0],delay_ms);}else if(visible_mask=="MinorThirds"){override_names_type=clampPitch(override_names_type,-6,19);showNoteNames(note_names_minor_thirds.get(override_names_type)[0],delay_ms);}else{showNoteNames(note_names_enharmonics1,delay_ms);automatic_names=false;}}else{switch(override_names_type){case"enharmonics1":showNoteNames(note_names_enharmonics1,delay_ms);break;case"enharmonics2":showNoteNames(note_names_enharmonics2,delay_ms);break;case"numbers":showNoteNames(note_names_numbers,delay_ms);break;}
automatic_names=false;}
updateSwapEnharmonicsBtn();}
function showNoteNames(postfix_array,delay_ms){const showNoteName=(elm)=>{elm.style.transitionProperty="visibility, transform";elm.style.transitionDelay=`${delay_ms + 100}ms`;elm.style.transitionDuration="100ms";elm.style.transitionTimingFunction="ease-out";elm.style.visibility="visible";elm.style.transform="scale(1, 1)";};const hideNoteName=(elm)=>{elm.style.transitionProperty="visibility, transform";elm.style.transitionDelay=`${delay_ms}ms`;elm.style.transitionDuration="100ms";elm.style.transitionTimingFunction="ease-out";elm.style.visibility="hidden";elm.style.transform="scale(1, 0)";};for(let i=0;i<12;i++){let chr_note_group=document.getElementById(`ChrNote${i}`);let fth_note_group=document.getElementById(`FthNote${i}`);let id_chr_visible=`ChrNote${i}${postfix_array[i]}`;let id_fth_visible=`FthNote${i}${postfix_array[i]}`;for(let elm of chr_note_group.childNodes){if(elm.id==id_chr_visible)
showNoteName(elm);else
hideNoteName(elm);}
for(let elm of fth_note_group.childNodes){if(elm.id==id_fth_visible)
showNoteName(elm);else
hideNoteName(elm);}}}
function checkNamesSwitch(switch_id){for(let elm_id of options_names_switches){document.getElementById(elm_id+"Mark").style.display=(elm_id==switch_id)?"inline":"none";}
writeStringToLocalStorage("checked_names_switch",switch_id);}
function changeNoteNames(value){switch(value){case"enharmonics1":checkNamesSwitch("SwitchNamesEnharmony1");note_names_key="enharmonics1";break;case"enharmonics2":checkNamesSwitch("SwitchNamesEnharmony2");note_names_key="enharmonics2";break;case"numbers":checkNamesSwitch("SwitchNamesPitchClasses");note_names_key="numbers";break;default:checkNamesSwitch("SwitchNamesDynamic");note_names_key=clampPitch(fifths_transposition,-5,6);}
writeStringToLocalStorage("note_names",value);updateNoteNames();}
function swapEnharmonics(){if(automatic_names==true){if(["Pentatonic","Diatonic","HarmonicMinor","MelodicMinor"].includes(visible_mask)){note_names_key=note_names_diatonic.get(note_names_key)[4];}else if(visible_mask=="MajorThirds"){note_names_key=note_names_major_thirds.get(note_names_key)[4];}else if(visible_mask=="MinorThirds"){note_names_key=note_names_minor_thirds.get(note_names_key)[4];}
updateNoteNames();}}
function switchShowBlackKeys(){black_keys_visible=(!black_keys_visible);writeStringToLocalStorage("black_keys_visible",black_keys_visible.toString());updateShowBlackKeys();}
function updateShowBlackKeys(){if(black_keys_visible==true){document.getElementById("ChkBlackKeysMark").style.display="inline";document.getElementById("ChrCirclesBicolor").style.display="inline";document.getElementById("ChrCirclesWhite").style.display="none";document.getElementById("FthCirclesBicolor").style.display="inline";document.getElementById("FthCirclesWhite").style.display="none";}else{document.getElementById("ChkBlackKeysMark").style.display="none";document.getElementById("ChrCirclesBicolor").style.display="none";document.getElementById("ChrCirclesWhite").style.display="inline";document.getElementById("FthCirclesBicolor").style.display="none";document.getElementById("FthCirclesWhite").style.display="inline";}}
function switchDarkBackground(){dark_background=(!dark_background);writeStringToLocalStorage("dark_background",dark_background.toString());updateBackground();}
function updateBackground(){let elm_mark=document.getElementById("ChkDarkBackgroundMark");let white_key_markers=document.getElementsByClassName("whiteKeyMarker");let black_key_markers=document.getElementsByClassName("blackKeyMarker");if(dark_background){elm_mark.style.display="inline";svg_root.style.backgroundColor="black";for(let elm of white_key_markers)elm.style.stroke="black";for(let elm of black_key_markers)elm.style.stroke="#666666";}else{elm_mark.style.display="none";svg_root.style.backgroundColor="white";for(let elm of white_key_markers)elm.style.stroke="#666666";for(let elm of black_key_markers)elm.style.stroke="white";}}
function updateSwapEnharmonicsBtn(){const btn_elm=document.getElementById("BtnSwapEnharmonics");const btnbk_elm=document.getElementById("BtnSwapEnharmonicsBk");const btntx_elm=document.getElementById("BtnSwapEnharmonicsTxt");if(automatic_names==true){btn_elm.style.cursor="pointer";btnbk_elm.style.fill="#66ff66";btntx_elm.style.fill="black";}else{btn_elm.style.cursor="not-allowed";btnbk_elm.style.fill="#aaaaaa";btntx_elm.style.fill="#555555";}}
function hover(elm_id){let elm=document.getElementById(elm_id);elm.style.filter="drop-shadow(0px 0px 1px red)";}
function unhover(elm_id){let elm=document.getElementById(elm_id);elm.style.filter="none";}
function hoverTab(elm_id){let elm=document.getElementById(elm_id);elm.style.fill=document.getElementById("ControlPanelBk").style.fill;}
function unhoverTab(elm_id){let elm=document.getElementById(elm_id);elm.style.fill="#cccccc";}
function initializeThisSvg(){svg_root.removeAttribute("height");svg_root.removeAttribute("width");svg_root.style.backgroundColor="white";language=getPreferredTranslation(AVAILABLE_TRANSLATIONS);translateSvgAsync(language);initializeMasks();for(let elm_id of clickable_elements){let elm=document.getElementById(elm_id);if(elm!=null){elm.style.cursor="pointer";elm.style.overscrollBehavior="none";}}
for(let grandpa_id of["ChrNames","FthNames"]){let grandpa=document.getElementById(grandpa_id);for(let parent of grandpa.childNodes){for(let elm of parent.childNodes){elm.style.visibility="hidden";elm.style.display="inline";elm.style.transformBox="content-box";elm.style.transformOrigin="center center";elm.style.transform="scale(1, 0)";}}}
dark_background=readBoolFromLocalStorage("dark_background",false);black_keys_visible=readBoolFromLocalStorage("black_keys_visible",true);updateBackground();updateShowBlackKeys();changeNoteNames(readStringFromLocalStorage("note_names","auto"));window.parent.addEventListener("resize",resizeEventHandler);resizeEventHandler();for(let elm of document.querySelectorAll("text"))
elm.style.userSelect="none";enableDragRotationOnMasks();}
function readStringFromLocalStorage(key,default_value){if(storageAvailable("localStorage")){const val=localStorage.getItem(key);if(val==null)
return default_value;return val;}
return default_value;}
function readBoolFromLocalStorage(key,default_bool_value){return(readStringFromLocalStorage(key,default_bool_value.toString())===true.toString());}
function writeStringToLocalStorage(key,value){if(storageAvailable("localStorage")){localStorage.setItem(key,value);}}
function storageAvailable(type){let storage;try{storage=window[type];const x="__storage_test__";storage.setItem(x,x);storage.removeItem(x);return true;}catch(e){return(e instanceof DOMException&&e.name==="QuotaExceededError"&&storage&&storage.length!==0);}}
function resizeEventHandler(){const ratio=window.parent.innerWidth/window.parent.innerHeight;if((ratio<1.0)&&(vertical_screen==false))
adaptForPortraitScreen();if((ratio>=1.0)&&(vertical_screen==true))
adaptForLandscapeScreen();}
function adaptForPortraitScreen(){const t=196.9;document.getElementById("FthCircle").setAttribute("transform",`translate(-${t} ${t})`);document.getElementById("Controls").setAttribute("transform",`translate(-3 ${t}) scale(0.51 1)`);svg_root.setAttribute("viewBox",`0 0 ${t} ${241.64582 + t}`);vertical_screen=true;}
function adaptForLandscapeScreen(){document.getElementById("FthCircle").setAttribute("transform","translate(0 0)");document.getElementById("Controls").setAttribute("transform","translate(0 0) scale(1 1)");svg_root.setAttribute("viewBox","0 0 397.15732 241.64582");vertical_screen=false;}
function clampPitch(value,min,max){while(value>max)value-=12;while(value<min)value+=12;return value;}
function clampAngle(deg,center=0,half_window=180,min_inclusive=true){const min=center-half_window;const max=center+half_window;while(deg>max)deg-=360;if(min_inclusive==true){while(deg<min)deg+=360;}else{while(deg<=min)deg+=360;}
return deg;}
function radToDeg(rad){return rad*(180/Math.PI);}
function degToRad(deg){return deg*(Math.PI/180);}
function pointInRect(rect,px,py){return(px>=rect.left&&px<=rect.right&&py>=rect.top&&py<=rect.bottom);}
function getPreferredTranslation(available_translations){let url_param_lang=new URLSearchParams(window.parent.location.search).get("lang");if(url_param_lang!=null){url_param_lang=url_param_lang.toLowerCase();for(let translation of available_translations){if(url_param_lang==translation)
return translation;}}
for(let lang of navigator.languages){lang=lang.toLowerCase();for(let translation of available_translations){if(lang.startsWith(translation))
return translation;}}
return"en";}
function getTranslatedStr(key,i18n_data){if(i18n_data.hasOwnProperty(key)){return i18n_data[key];}else
return null;}
function translate(element,i18n_data){if(element.hasAttribute("i18n")){const str=getTranslatedStr(element.getAttribute("i18n"),i18n_data);if(str!=null)
element.innerHTML=str;}
if(element.hasChildNodes()){for(let child of element.children){translate(child,i18n_data);}}}
async function translateSvgAsync(){try{const file_name=`locale/${language}.json`;const response=await fetch(file_name);if(!response.ok)
throw new Error(`Response status: ${response.status}`);const data=await response.json();translate(svg_root,data);}catch(error){console.log(`translateSvgAsync(${language}) error: ${error}.`);}}