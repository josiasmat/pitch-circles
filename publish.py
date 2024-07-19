#! python3

# This script requires the following packages:
#   minify-html, rjsmin, scour, wand
#
# To install them, on a console type:
#   > pip install minify-html rjsmin scour wand
#
# You'll also need ImageMagick from:
#   https://imagemagick.org/

import gzip, os, shutil
import xml.etree.ElementTree as ET
from pathlib import Path

import minify_html
from rjsmin import jsmin
import scour.scour as scour
from wand.image import Image as WandImage
from wand.image import Color as WandColor

source_folder = "./src"
publish_folder = "./public"


# function to test if source file is newer
# than destination file
def isFileModified(filename_src, filename_dest):
    if Path(filename_src).is_file() == False:
        print(f"File '{filename_src}' not found.")
        return False
    if Path(filename_dest).is_file() == False:
        return True
    dt_src = os.path.getmtime(filename_src)
    dt_dst = os.path.getmtime(filename_dest)
    return (dt_src > dt_dst)


# function to test if file was modified and do
# something; the function argument must receive
# two arguments: source and destination file
def doIfFileModified(src, dst, func):
    if isFileModified(src, dst):
        func(src, dst)
    else:
        print(f"File '{Path(src).name}' skipped.")


# function to copy a file
def copyFile(src, dst):
    shutil.copy2(src, dst)
    print(f"File '{Path(src).name}' copied to '{dst}'.")


# function to compress a file using gzip
def compressFile(src, dst):
    with open(src, 'rb') as srcfile:
        srcdata = srcfile.read()
        srcfile.close()
        with open(dst, 'wb') as gzfile:
            gzfile.write(gzip.compress(srcdata))
            gzfile.close()
            print(f"File '{Path(src).name}' file compressed and saved to '{dst}'.")


# function to minify html
def minifyHtml(src, dst):
    with open(src, 'r', encoding="utf-8") as read_stream:
        with open(dst, 'w', encoding="utf-8") as write_stream:
            data = read_stream.read()
            read_stream.close()
            write_stream.write(minify_html.minify(data, \
                minify_js=True, remove_processing_instructions=True))
            write_stream.close()
            print(f"File '{Path(src).name}' file minified and saved to '{dst}'.")


# function to minify javascript
def minifyJs(src, dst):
    with open(src, 'r', encoding="utf-8") as read_stream:
        with open(dst, 'w', encoding="utf-8") as write_stream:
            jsdata = read_stream.read()
            read_stream.close()
            write_stream.write(jsmin(jsdata))
            write_stream.close()
            print(f"File '{Path(src).name}' file minified and saved to '{dst}'.")


# function to convert svg to png
def svgToPng(src, dst):
    bgcolor = WandColor("transparent")
    #with WandImage(filename=src, width=128, height=128, background=bgcolor) as img:
    with WandImage(filename=src, background=bgcolor) as img:
        with img.convert('png') as output_img:
            output_img.save(filename=dst)
            print(f"File '{Path(src).name}' converted and saved to '{dst}'.")


# cd to this file directory
abspath = Path(__file__).absolute()
thisdir = Path(abspath).parent
os.chdir(thisdir)



# create {publish_folder} folder
Path(publish_folder).mkdir(exist_ok=True)


# copy/compress locale files
locale_subfolder = "locale"
Path(publish_folder, locale_subfolder).mkdir(exist_ok=True)
locale_files = Path(source_folder, locale_subfolder).glob("*.json")
for lang_src in locale_files:
    lang_filename = Path(lang_src).name
    lang_dest = Path(publish_folder, locale_subfolder, lang_filename + ".gz")
    # english file not needed because that's the source language
    if lang_filename != "en.json":
        doIfFileModified(lang_src, lang_dest, compressFile)


# copy style files
styles_subfolder = "styles"
Path(publish_folder, styles_subfolder).mkdir(exist_ok=True)
style_files = Path(source_folder, locale_subfolder).glob("*.css")
for style_src in style_files:
    style_filename = Path(style_src).name
    style_dest = Path(publish_folder, styles_subfolder, style_filename)
    doIfFileModified(style_src, style_dest, copyFile)


# minify html file
html_name = "index.html"
html_src = Path(source_folder, html_name)
html_dst = Path(publish_folder, html_name)
doIfFileModified(html_src, html_dst, minifyHtml)


# minify javascript file
js_name = "main.js"
js_src = Path(source_folder, js_name)
js_dst = Path(publish_folder, js_name)
doIfFileModified(js_src, js_dst, minifyJs)


# convert favicon.svg to favicon.png
favicon_name = "favicon"
favicon_src = Path(source_folder, favicon_name + ".svg")
favicon_dst = Path(publish_folder, favicon_name + ".png")
doIfFileModified(favicon_src, favicon_dst, svgToPng)


# process svg file
svg_name = "graphics.svg"
svg_src = Path(source_folder, svg_name)
svg_dst = Path(publish_folder, svg_name)
svg_tmp = Path(publish_folder, svg_name + '.tmp')
if isFileModified(svg_src, svg_dst):

    # remove inline styling
    xmltree = ET.parse(svg_src)
    for elm in xmltree.iter():
        elm_class = elm.get('class')
        if elm_class != None:
            if elm.get('style') != None:
                elm.attrib.pop('style')
            if elm_class.find('children') != -1:
                for child in elm.iter():
                    if child.get('style') != None:
                        child.attrib.pop('style')
    xmltree.write(svg_tmp, encoding='UTF-8')

    # minify svg file using scour
    scour_options = scour.parse_args([
        "--enable-viewboxing", 
        "--enable-comment-stripping",
        "--remove-descriptive-elements",
        "--no-line-breaks"
    ])
    scour_options.infilename = svg_tmp
    scour_options.outfilename = svg_dst
    (input, output) = scour.getInOut(scour_options)
    scour.start(scour_options, input, output)
    os.remove(svg_tmp)
    print(f"File '{svg_name}' file minified and saved to '{svg_dst}'.")
else:
    print(f"File '{svg_name}' skipped.")

