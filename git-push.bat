@echo off
REM Ask generic changes
set /p changes="Enter Changes: "
git add . && git commit -m "%changes%" && git push origin master