#! /bin/bash

echo -e "
You can access the app with your internet
browser by typing the following address:\n
     http://localhost:8000\n\n
Close this window to stop the local web server.
-----------------------------------------------
"

cd ${dirname "$0"}

xdg-open "http://localhost:8000" &
python3 -m http.server
