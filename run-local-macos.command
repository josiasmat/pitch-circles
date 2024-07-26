echo -e "
You can access the app with your internet
browser by typing the following address:\n
     http://localhost:8000\n\n
Close this window to stop the local web server.
-----------------------------------------------
"

cd ${dirname "$0"}

chmod 755 bin/mongoose_macos
open "http://localhost:8000" &
bin/mongoose_macos -l http://localhost:8000 -v 1
