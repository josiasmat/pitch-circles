# Pitch Circles

A tool for visualizing scales and their transpositions on the chromatic circle and the circle of fifths.

## Online usage

Visit https://josiasmat.github.io/pitch-circles/

## Offline usage[^1]

1. [Download the files](../../archive/refs/heads/main.zip) from the repository, and unzip them.
2. Go to the folder where the files were downloaded/unzipped.
3. If you are using **Windows**: simply double-click on `run-local-windows.cmd`.
4. If you are using **macOS**:
    - First you'll need to mark the file `run-local-macos.command` as executable. [Follow these instructions](https://support.apple.com/en-me/guide/terminal/apdd100908f-06b3-4e63-8a87-32e71241bab4/mac) to do it.
    - After that, double-click on `run-local-macos.command` to run the script.
5. If you are using **Linux**:
    - First you'll need to mark the file `run-local-linux.sh` as executable. In some distributions you can do this by right-clicking the file and going to _Properties_. In others, you'll need to go to the terminal. [Google it](https://www.google.com/search?q=linux+mark+file+as+executable) if you don't know how to do this.
    - After that, double-click on `run-local-linux.sh` to run the script.

[^1]: Uses [Mongoose](https://mongoose.ws/) as local web server on Windows and macOS. On Linux, Python is used as it's included in almost all current distributions.

## Keyboard shortcuts

|Keys|Function||Keys|Function|
|-|-|-|-|-|
|`P`|show pentatonic mask||`1`-`9`|transpose up _n_ fifths|
|`D`|show diatonic mask||`ctrl`+`1`-`9`|transpose down _n_ fifths|
|`H`|show harmonic minor mask||`0`|go back to C|
|`M`|show melodic minor mask||`Tab`|change enharmonic spelling|
|`W`|show whole-tones mask||`F1`|use enharmonic naming|
|`O`|show octatonic mask||`F2`|use enharmonic+B#/Cb/E#/Fb naming|
|`J`|show major thirds mask||`F3`|use pitch classes naming|
|`I`|show minor thirds mask||`F4`|use automatic naming|
|`C`|show chromatic mask||`F6`|show/hide controls|
|`↑` `↓`|transpose by semitones||`F7`|switch dark black keys|
|`←` `→`|transpose by fifths||`F8`|switch dark background|
|`Shift`+`↑` `↓`|transpose by whole steps||`F9`|request MIDI input|

## Setting initial state

It is possible to set the tool's initial state using URL query parameters.
- Use `?mask=` to set the mask (`pentatonic`, `diatonic` etc.).
- Use `?rotate=` to set the initial rotation, in fifths.
- Use `?hidecontrols=1` to hide the control panel.
- Use `?lang=` to change the language.

You can combine these parameters using `&`, in any order, e.g.:

`https://josiasmat.github.io/pitch-circles/?mask=diatonic&rotate=-2&hidecontrols=1&lang=es`

This will start the tool in spanish, with the diatonic mask, rotated to B flat and with controls hidden.

## Translations

Currently available in english (`en`), spanish (`es`) and portuguese (`pt`).

It tries to automatically detect the user's preferred language. If you want to use a specific language, append `?lang=` followed by the language code to the URL.

If you want to contribute with a new translation, copy one of the files inside the `locale` folder and change the strings accordingly. After that, send me an e-mail (see below) with your translation file. Also feel free to ask for help.

## MIDI input

Press `F9` to request access to a MIDI input port from the browser. This will enable you to get the notes highlighted when you play them!

In the case some notes get stuck, press `ESC` to reset them.

Tip: if you want to use the MIDI output from another software to control the pitch circles, try using [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html) from Tobias Erichsen.

## Bugs

If you find any bug in this software, please open an [issue ticket](../../issues).

## More info

Contact me: josiasmatschulat@outlook.com

Copyright 2024 Josias Matschulat

This software is licensed under the terms of the [GNU Affero General Public License v3](https://www.gnu.org/licenses/agpl-3.0.html).
