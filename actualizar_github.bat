@echo off
chcp 65001 > nul
echo ===================================================
echo    ACTUALIZADOR DE PROYECTO ALIMOP A GITHUB
echo ===================================================
echo.

:: Cambiar al directorio del proyecto
cd /d "c:\Users\ENBOG16\OneDrive - Grupo Energia Bogota\Escritorio\alimop\ProyectoALIMOP"

echo Mostrando el estado actual de los archivos modificados:
echo ---------------------------------------------------
git status -s
echo ---------------------------------------------------
echo.

:: Solicitar el mensaje de commit
set "commit_msg="
set /p commit_msg="Introduce un mensaje para esta actualización (o presiona Enter para usar uno por defecto): "

:: Si está vacío, establecer mensaje por defecto
if "%commit_msg%"=="" (
    set commit_msg=Actualización del proyecto - %date% %time%
)

echo.
echo Iniciando actualización en GitHub con el mensaje:
echo "%commit_msg%"
echo.

echo ----- INICIO DEL PROCESO ----- > registro_git.txt
echo Fecha y hora: %date% %time% >> registro_git.txt
echo Mensaje: %commit_msg% >> registro_git.txt
echo. >> registro_git.txt

echo 1. Preparando todos los archivos modificados (git add .)... >> registro_git.txt
git add . >> registro_git.txt 2>&1

echo 2. Creando el commit (git commit)... >> registro_git.txt
git commit -m "%commit_msg%" >> registro_git.txt 2>&1

echo 3. Subiendo cambios a GitHub (git push origin main)... >> registro_git.txt
git push origin main >> registro_git.txt 2>&1

echo. >> registro_git.txt
echo ----- FIN DEL PROCESO ----- >> registro_git.txt

echo ===================================================
echo ¡PROCESO COMPLETADO CON ÉXITO!
echo Se han enviado los cambios a tu cuenta de GitHub.
echo.
echo Puedes revisar el registro detallado en:
echo "registro_git.txt"
echo ===================================================
echo.
pause
