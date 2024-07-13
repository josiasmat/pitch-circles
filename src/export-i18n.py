#! python3

# This scripts creates an en.json file inside
# ./locale based on the graphics.svg file

import json, os
import xml.etree.ElementTree as xml_et

graphics_filename = "./graphics.svg"
enjson_filename = "./locale/en.json"

# cd to this file directory
abspath = os.path.abspath(__file__)
thisdir = os.path.dirname(abspath)
os.chdir(thisdir)

# Create the xml tree from graphics.svg
svg_tree = xml_et.parse(graphics_filename)

# Get a list of all elements with a "i18n" attribute
translatable_list = svg_tree.findall(".//*[@i18n]")

# Create object to be converted to JSON, and include
# the title text (which is not in the svg file)
data = {"title": "Pitch Circles"}

# Read i18n attribute and text content to data
for elm in translatable_list:
    data[elm.attrib["i18n"]] = elm.text

# Save JSON to enjson_filename
with open(enjson_filename, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
