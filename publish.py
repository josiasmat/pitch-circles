#! python3

# This script requires the following packages:
#   minify-html, rjsmin, scour, wand
#
# To install them, on a console type:
#   > pip install minify-html rjsmin scour wand
#
# You'll also need ImageMagick from:
#   https://imagemagick.org/

import os, glob, shutil

import minify_html
from rjsmin import jsmin
import scour.scour as scour
from wand.image import Image as WandImage
from wand.image import Color as WandColor

source_folder = "./src"
publish_folder = "./www"

# cd to this file directory
abspath = os.path.abspath(__file__)
thisdir = os.path.dirname(abspath)
os.chdir(thisdir)

# create ./www folder if it doesn't exist
if not os.path.exists(publish_folder):
    os.makedirs(publish_folder)
if not os.path.exists(f"{publish_folder}/locale"):
    os.makedirs(f"{publish_folder}/locale")

# copy locale files
locale_subfolder = "/locale"
locale_files = glob.iglob(os.path.join(f"{source_folder}{locale_subfolder}", "*.json"))
for file in locale_files:
    if os.path.isfile(file):
        shutil.copy2(file, f"{publish_folder}{locale_subfolder}")

# minify html file
with open(f"{source_folder}/index.html", 'r', encoding="utf-8") as htmlrfile:
    htmldata = htmlrfile.read()
    htmlrfile.close()
    with open(f"{publish_folder}/index.html", 'w', encoding="utf-8") as htmlwfile:
        htmlwfile.write(minify_html.minify(htmldata, \
            minify_js=True, remove_processing_instructions=True))
        htmlwfile.close()

# minify javascript file
with open(f"{source_folder}/main.js", 'r', encoding="utf-8") as jsrfile:
    jsdata = jsrfile.read()
    jsrfile.close()
    with open(f"{publish_folder}/main.js", 'w', encoding="utf-8") as jswfile:
        jswfile.write(jsmin(jsdata))
        jswfile.close()

# minify svg file using scour
scour_options = scour.parse_args([
    "--enable-viewboxing", 
    "--enable-comment-stripping",
    "--remove-descriptive-elements",
    "--no-line-breaks"
])
scour_options.infilename = f"{source_folder}/graphics.svg"
scour_options.outfilename = f"{publish_folder}/graphics.svg"
(input, output) = scour.getInOut(scour_options)
scour.start(scour_options, input, output)

# convert favicon.svg to favicon.png
bgcolor = WandColor("transparent")
with WandImage(filename=f"{source_folder}/favicon.svg", width=128, height=128, background=bgcolor) as img:
    with img.convert('png') as output_img:
        output_img.save(filename=f"{publish_folder}/favicon.png")
