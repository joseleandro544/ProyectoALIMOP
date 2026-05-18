@echo off
:: =========================================================================
:: ALIMOP - SCRIPT DE SUBIDA AUTOMÁTICA A GITLAB (PORTAFOLIO)
:: =========================================================================
chcp 65001 > nul
echo ===================================================
echo     ALIMOP - ENVIANDO PORTAFOLIO A GITLAB Y GITHUB
echo ===================================================
echo.
echo Iniciando el proceso y guardando registro...
cd "c:\Users\ENBOG16\OneDrive - Grupo Energia Bogota\Escritorio\alimop\PortafolioGitLab"

echo ----- INICIO DEL PROCESO ----- > registro_git_portafolio.txt
echo Fecha: %date% %time% >> registro_git_portafolio.txt

echo 1. Inicializando Git (si no está inicializado)... >> registro_git_portafolio.txt
git init >> registro_git_portafolio.txt 2>&1

echo 2. Configurando remoto de GitLab ('origin')... >> registro_git_portafolio.txt
git remote remove origin >nul 2>&1
git remote add origin https://gitlab.com/joseleandro544/PortafolioGitLabALIMOP.git >> registro_git_portafolio.txt 2>&1
echo   -> GitLab configurado como 'origin': https://gitlab.com/joseleandro544/PortafolioGitLabALIMOP.git

echo 3. Configurando remoto de GitHub ('github')... >> registro_git_portafolio.txt
git remote remove github >nul 2>&1
git remote add github https://github.com/joseleandro544/PortafolioGitLabALIMOP.git >> registro_git_portafolio.txt 2>&1
echo   -> GitHub configurado como 'github': https://github.com/joseleandro544/PortafolioGitLabALIMOP.git

echo 4. Preparando archivos para commit... >> registro_git_portafolio.txt
git add -A >> registro_git_portafolio.txt 2>&1

echo 5. Creando commit local... >> registro_git_portafolio.txt
git commit -m "feat: implementacion inicial del portafolio interactivo premium ALIMOP" >> registro_git_portafolio.txt 2>&1
echo   -> Commit creado localmente.

echo 6. Configurando rama principal (main)... >> registro_git_portafolio.txt
git branch -M main >> registro_git_portafolio.txt 2>&1

echo.
echo ===================================================
echo   PASO DE AUTENTICACIÓN (IMPORTANTE)
echo ===================================================
echo Se iniciará el envío a GitLab. 
echo Si el sistema te lo solicita, introduce:
echo   - Usuario: joseleandro544
echo   - Contraseña: [Tu Personal Access Token de GitLab]
echo.
echo Presiona cualquier tecla para iniciar el envío a GitLab...
pause > nul

echo 7. Subiendo a GitLab (origin)... >> registro_git_portafolio.txt
git push -u origin main >> registro_git_portafolio.txt 2>&1

if %errorlevel% neq 0 (
    echo.
    echo [ALERTA] Hubo un inconveniente al subir a GitLab. 
    echo Por favor revisa "registro_git_portafolio.txt" para ver el error.
    echo Asegúrate de haber creado el repositorio "PortafolioGitLabALIMOP" en tu GitLab.
) else (
    echo [ÉXITO] ¡Portafolio subido con éxito a GitLab!
)

echo.
echo ===================================================
echo   ENVÍO ADICIONAL A GITHUB (OPCIONAL)
echo ===================================================
echo ¿Deseas subir también esta versión a tu GitHub?
set /p subir_github="Escribe 'S' para Sí, o cualquier otra tecla para omitir: "

if /i "%subir_github%"=="S" (
    echo 8. Subiendo a GitHub (github)... >> registro_git_portafolio.txt
    git push -u github main >> registro_git_portafolio.txt 2>&1
    if %errorlevel% neq 0 (
        echo [ALERTA] Hubo un error al subir a GitHub.
    ) else (
        echo [ÉXITO] ¡Subido con éxito a GitHub!
    )
)

echo ----- FIN DEL PROCESO ----- >> registro_git_portafolio.txt
echo.
echo ===================================================
echo PROCESO FINALIZADO.
echo He creado el archivo "registro_git_portafolio.txt"
echo con los detalles del proceso.
echo ===================================================
pause
