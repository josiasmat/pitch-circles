#! python3

# This script requires the following packages:
#   minify-html, rjsmin, scour, wand
#
# To install them, on a console type:
#   > pip install minify-html rjsmin scour wand
#
# You'll also need ImageMagick from:
#   https://imagemagick.org/

import glob, pathlib, os, shutil

import minify_html
from rjsmin import jsmin
import scour.scour as scour
from wand.image import Image as WandImage
from wand.image import Color as WandColor

source_folder = "./src"
publish_folder = "./www"

# function to test if source file is newer
# than destination file
def isFileModified(filename_src, filename_dest):
    if os.path.isfile == False:
        return True
    dt_src = os.path.getmtime(filename_src)
    dt_dst = os.path.getmtime(filename_dest)
    return (dt_src > dt_dst)

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
    lang_filename = pathlib.Path(file).name
    lang_dest = f"{publish_folder}{locale_subfolder}/{lang_filename}"
    if os.path.isfile(file):
        # english file not needed because that's the source language
        if lang_filename != "en.json":
            if isFileModified(file, lang_dest):
                with shutil.copy2(file, lang_dest) as newfile:
                    print(f"File '{lang_filename}' copied to '{newfile}'.")
            else:
                print(f"File '{lang_filename}' skipped.")

# minify html file
html_name = "index.html"
html_src = f"{source_folder}/{html_name}"
html_dst = f"{publish_folder}/{html_name}"
if isFileModified(html_src, html_dst):
    with open(html_src, 'r', encoding="utf-8") as htmlrfile:
        htmldata = htmlrfile.read()
        htmlrfile.close()
        with open(html_dst, 'w', encoding="utf-8") as htmlwfile:
            htmlwfile.write(minify_html.minify(htmldata, \
                minify_js=True, remove_processing_instructions=True))
            htmlwfile.close()
            print(f"File '{html_name}' file minified and saved to '{html_dst}'.")
else:
    print(f"File '{html_name}' skipped.")

# minify javascript file
js_name = "main.js"
js_src = f"{source_folder}/{js_name}"
js_dst = f"{publish_folder}/{js_name}"
if isFileModified(js_src, js_dst):
    with open(js_src, 'r', encoding="utf-8") as jsrfile:
        jsdata = jsrfile.read()
        jsrfile.close()
        with open(js_dst, 'w', encoding="utf-8") as jswfile:
            jswfile.write(jsmin(jsdata))
            jswfile.close()
            print(f"File '{js_name}' file minified and saved to '{js_dst}'.")
else:
    print(f"File '{js_name}' skipped.")

# minify svg file using scour
svg_name = "graphics.svg"
svg_src = f"{source_folder}/{svg_name}"
svg_dst = f"{publish_folder}/{svg_name}"
if isFileModified(svg_src, svg_dst):
    scour_options = scour.parse_args([
        "--enable-viewboxing", 
        "--enable-comment-stripping",
        "--remove-descriptive-elements",
        "--no-line-breaks"
    ])
    scour_options.infilename = svg_src
    scour_options.outfilename = svg_dst
    (input, output) = scour.getInOut(scour_options)
    scour.start(scour_options, input, output)
    print(f"File '{svg_name}' file minified and saved to '{svg_dst}'.")
else:
    print(f"File '{svg_name}' skipped.")

# convert favicon.svg to favicon.png
favicon_src = f"{source_folder}/favicon.svg"
favicon_dst = f"{publish_folder}/favicon.png"
if isFileModified(favicon_src, favicon_dst):
    bgcolor = WandColor("transparent")
    with WandImage(filename=favicon_src, width=128, height=128, background=bgcolor) as img:
        with img.convert('png') as output_img:
            output_img.save(filename=favicon_dst)
            print(f"File 'favicon.svg' file converted and saved to '{favicon_dst}'.")
else:
    print("File 'favicon.svg' skipped.")