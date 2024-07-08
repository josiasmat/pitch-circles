scour -i .\src\graphics-src.svg -o .\www\graphics.svg --enable-viewboxing --enable-comment-stripping --remove-descriptive-elements --no-line-breaks
copy /Y .\src\favicon.png .\www
copy /Y .\src\index.html .\www
copy /Y .\src\main.js .\www
