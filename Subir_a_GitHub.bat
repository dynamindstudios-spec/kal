@echo off
title Subiendo KAL DISCOBAR a GitHub (Dynamind Studios)
color 0E
cd /d "%~dp0"
echo ======================================================
echo    SUBIENDO KAL DISCOBAR A GITHUB (DYNAMIND)
echo    Repositorio: dynamindstudios-spec/kal
echo ======================================================
echo.
echo 1. Preparando archivos...
git add .
echo.
echo 2. Creando commit automatico...
git commit -m "update: sync KAL DISCOBAR project"
echo.
echo 3. Subiendo a GitHub (dynamindstudios-spec/kal)...
git push -u origin main
echo.
echo ======================================================
echo    PROCESO TERMINADO CON EXITO
echo ======================================================
pause
