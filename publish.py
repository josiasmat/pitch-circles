#! python3

# This script requires minify-html, rjsmin and scour:
# > pip install minify-html rjsmin scour

import os
import shutil

import minify_html
from rjsmin import jsmin
import scour.scour as scour

# cd to this file directory
abspath = os.path.abspath(__file__)
thisdir = os.path.dirname(abspath)
os.chdir(thisdir)

# create ./www folder if it doesn't exist
publish_folder = "./www"
if not os.path.exists(publish_folder):
    os.makedirs(publish_folder)

# copy file(s)
shutil.copy2("./src/favicon.png", publish_folder)

# minify html file
with open('./src/index.html', 'r', encoding="utf-8") as htmlrfile:
    htmldata = htmlrfile.read()
    htmlrfile.close()
    with open(publish_folder + '/index.html', 'w', encoding="utf-8") as htmlwfile:
        htmlwfile.write(minify_html.minify(htmldata, \
            minify_js=True, remove_processing_instructions=True))
        htmlwfile.close()

# minify javascript file
with open('./src/main.js', 'r', encoding="utf-8") as jsrfile:
    jsdata = jsrfile.read()
    jsrfile.close()
    with open(publish_folder + '/main.js', 'w', encoding="utf-8") as jswfile:
        jswfile.write(jsmin(jsdata))
        jswfile.close()

# minify svg file using scour
scour_options = scour.parse_args([
    '--enable-viewboxing', 
    '--enable-comment-stripping',
    '--remove-descriptive-elements',
    '--no-line-breaks'
    ])
scour_options.infilename = "./src/graphics-src.svg"
scour_options.outfilename = publish_folder + "/graphics.svg"
(input, output) = scour.getInOut(scour_options)
scour.start(scour_options, input, output)
