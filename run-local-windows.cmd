@echo off

echo.
echo You can access the app with your internet 
echo browser by typing the following address:
echo.
echo     http://localhost
echo.
echo Close this window to stop the local web server.
echo.
echo -----------------------------------------------
echo.

cd %~dp0
start /b explorer "http://localhost:80"
bin\mongoose.exe -l http://127.0.0.1:80 -v 1
