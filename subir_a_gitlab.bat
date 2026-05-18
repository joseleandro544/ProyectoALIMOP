@echo off
:: =========================================================================
:: ALIMOP - SCRIPT DE SUBIDA AUTOMÁTICA DEL PROYECTO PRINCIPAL A GITLAB
:: =========================================================================
chcp 65001 > nul
echo ===================================================
echo        ALIMOP - SUBIR PROYECTO PRINCIPAL A GITLAB
echo ===================================================
echo.
echo Iniciando el proceso y guardando registro...
cd /d "c:\Users\ENBOG16\OneDrive - Grupo Energia Bogota\Escritorio\alimop\ProyectoALIMOP"

echo ----- INICIO DEL PROCESO A GITLAB ----- > registro_gitlab.txt
echo Fecha: %date% %time% >> registro_gitlab.txt

echo 1. Verificando/Inicializando Git... >> registro_gitlab.txt
if not exist ".git" (
    git init >> registro_gitlab.txt 2>&1
    git branch -M main >> registro_gitlab.txt 2>&1
    echo   -> Repositorio Git inicializado localmente.
) else (
    echo   -> El repositorio Git ya estaba inicializado.
)

echo 2. Configurando control remoto para GitLab ('gitlab')... >> registro_gitlab.txt
:: Remueve el remoto anterior si existe para evitar conflictos y vuelve a agregarlo con la URL correcta
git remote remove gitlab >nul 2>&1
git remote add gitlab https://gitlab.com/joseleandro544/ProyectoALIMOP.git >> registro_gitlab.txt 2>&1
echo   -> GitLab configurado como remoto 'gitlab': https://gitlab.com/joseleandro544/ProyectoALIMOP.git

echo 3. Preparando los archivos del proyecto (git add)... >> registro_gitlab.txt
git add . >> registro_gitlab.txt 2>&1

echo.
echo Mostrando archivos modificados o agregados:
echo ---------------------------------------------------
git status -s
echo ---------------------------------------------------
echo.

:: Solicitar el mensaje de commit
set "commit_msg="
set /p commit_msg="Introduce un mensaje para este commit (o presiona Enter para usar uno por defecto): "

if "%commit_msg%"=="" (
    set commit_msg=feat: version inicial del Proyecto ALIMOP en GitLab
)

echo 4. Creando commit local con el mensaje "%commit_msg%"... >> registro_gitlab.txt
git commit -m "%commit_msg%" >> registro_gitlab.txt 2>&1
echo   -> Commit realizado localmente.

echo.
echo ===================================================
echo   INSTRUCCIONES DE CREDENCIALES DE GITLAB (IMPORTANTE)
echo ===================================================
echo Cuando se intente subir el código a GitLab, te pedirá autenticarte:
echo.
echo   1. Usuario (Username): joseleandro544
echo   2. Contraseña (Password): [Tu Personal Access Token de GitLab]
echo.
echo *Nota: Recuerda que no debes usar tu contraseña habitual, sino un 
echo Token de Acceso Personal con permisos de "write_repository".
echo.
echo Presiona cualquier tecla para iniciar el envío a tu repositorio de GitLab...
pause > nul

echo 5. Enviando cambios a la rama principal de GitLab (git push)... >> registro_gitlab.txt
git push -u gitlab main >> registro_gitlab.txt 2>&1

if %errorlevel% neq 0 (
    echo.
    echo ❌ [ERROR] Hubo un problema al subir a GitLab.
    echo Por favor revisa el archivo "registro_gitlab.txt" para ver los detalles del error.
    echo Asegúrate de haber creado el repositorio "ProyectoALIMOP" en tu GitLab primero.
) else (
    echo.
    echo 🚀 [ÉXITO] ¡Tu Proyecto ALIMOP principal ha sido subido con éxito a GitLab!
    echo.
    echo Se iniciará el pipeline automatizado (Docker build y GitLab Pages) en unos momentos.
)

echo ----- FIN DEL PROCESO ----- >> registro_gitlab.txt
echo.
echo ===================================================
echo PROCESO FINALIZADO.
echo Detalles guardados en: "registro_gitlab.txt"
echo ===================================================
pause
