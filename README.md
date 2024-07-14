# Pitch Circles

A tool for visualizing scales and their transpositions on the chromatic circle and the circle of fifths.

## Online usage

Visit https://josiasmat.github.io/PitchCircles/

## Offline usage

1. Download and install [Python](https://www.python.org/) (if you don't have it installed yet).
2. [Download the files](../../archive/refs/heads/main.zip) from the repository, and unzip them.
3. On Windows: go to the folder where the files were downloaded/unzipped, and double-click the `run-local-server.cmd` file; on other systems, run `python3 -m http.server 80` from the downloaded files directory in a terminal.
4. Visit `localhost/` using your internet browser.

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
|`C`|show chromatic mask||`F7`|switch dark black keys|
|`↑` `↓`|transpose by semitones||`F8`|switch dark background|
|`←` `→`|transpose by fifths||`F9`|show/hide controls|
|`Shift`+`↑` `↓`|transpose by whole steps|`F10`|request MIDI input|

## Setting initial state

It is possible to set the tool's initial state using URL query parameters.
- Use `?mask=` to set the mask (`pentatonic`, `diatonic` etc.).
- Use `?rotate=` to set the initial rotation, in fifths.
- Use `?hidecontrols=1` to hide the control panel.
- Use `?lang=` to change the language.

You can combine these parameters using `&`, in any order, e.g.:

`https://josiasmat.github.io/PitchCircles/?mask=diatonic&rotate=-2&hidecontrols=1&lang=es`

This will start the tool in spanish, with the diatonic mask, rotated to B flat and with controls hidden.

## Translations

Currently available in english (`en`), spanish (`es`) and portuguese (`pt`).

It tries to automatically detect the user's preferred language. If you want to use a specific language, append `?lang=` followed by the language code to the URL.

If you want to contribute with a new translation, copy one of the files inside the `locale` folder and change the strings accordingly. After that, send me an e-mail (see below) with your translation file. Also feel free to ask for help.

## MIDI input

Press `F10` to request access to a MIDI input port to the browser. This will enable you to get the notes highlighted when you play them!

Tip: If you want to route MIDI from another software to this tool, try using [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html) from Tobias Erichsen.

## Bugs

If you find any bug in this software, please open an [issue ticket](../../issues).

## More info

Contact me: josiasmatschulat@outlook.com

Copyright 2024 Josias Matschulat

This software is licensed under the terms of the [GNU Affero General Public License v3](https://www.gnu.org/licenses/agpl-3.0.html).
