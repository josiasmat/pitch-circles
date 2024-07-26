#! /bin/bash

echo -e "
You can access the app with your internet
browser by typing the following address:\n
     http://localhost\n\n
Close this window to stop the local web server.
-----------------------------------------------
"

cd ${dirname "$0"}

if [ "$(uname)" == "Darwin" ]; then
  open "http://localhost:80" &
  bin\mongoose_macos -l http://127.0.0.1:80 -v 1
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
  xdg-open "http://localhost:80" &
  python -m http.server 80
else
  echo "Could not detect operating system."
fi
