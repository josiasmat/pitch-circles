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
|`P`|show pentatonic mask||`↑` `↓`|Transpose by semitones|
|`D`|show diatonic mask||`Shift`+`↑` `↓`|Transpose by whole steps|
|`H`|show harmonic minor mask||`←` `→`|Transpose by fifths|
|`M`|show melodic minor mask||`Tab`|change enharmonic spelling|
|`W`|show whole-tones mask||`Ctrl`+`1`|use enharmonic naming|
|`O`|show octatonic mask||`Ctrl`+`2`|use enharmonic+B#/Cb/E#/Fb naming|
|`J`|show major thirds mask||`Ctrl`+`3`|use pitch classes naming|
|`I`|show minor thirds mask||`Ctrl`+`4`|use automatic naming|
|`C`|show chromatic mask||`Ctrl`+`b`|switch dark black keys|
||||`Ctrl`+`d`|switch dark background|

## Translations

Currently available in english (`en`), spanish (`es`) and portuguese (`pt`).

It tries to automatically detect the user's preferred language. If you want to use a specific language, append `?lang=` followed by the language code to the URL.

If you want to contribute with a new translation, copy one of the files inside the `locale` folder and change the strings accordingly. After that, send me an e-mail (see below) with your translation file. Also feel free to ask for help.

## Bugs

If you find any bug in this software, please open an [issue ticket](../../issues).

## More info

Contact me: josiasmatschulat@outlook.com

Copyright 2024 Josias Matschulat

This software is licensed under the terms of the [GNU Affero General Public License v3](https://www.gnu.org/licenses/agpl-3.0.html).
