@echo off
echo Iniciando el proceso y guardando registro...
cd "c:\Users\ENBOG16\OneDrive - Grupo Energia Bogota\Escritorio\alimop\ProyectoALIMOP"

echo ----- INICIO DEL PROCESO ----- > registro_git.txt
echo 1. Inicializando Git... >> registro_git.txt
git init >> registro_git.txt 2>&1

echo 2. Añadiendo remotos... >> registro_git.txt
git remote add origin https://github.com/joseleandro544/ProyectoALIMOP.git >> registro_git.txt 2>&1
git remote set-url origin https://github.com/joseleandro544/ProyectoALIMOP.git >> registro_git.txt 2>&1

echo 3. Preparando archivos... >> registro_git.txt
git add . >> registro_git.txt 2>&1

echo 4. Creando commit... >> registro_git.txt
git commit -m "Versión inicial" >> registro_git.txt 2>&1

echo 5. Renombrando rama... >> registro_git.txt
git branch -M main >> registro_git.txt 2>&1

echo 6. Subiendo a GitHub... >> registro_git.txt
git push -u origin main >> registro_git.txt 2>&1

echo ----- FIN DEL PROCESO ----- >> registro_git.txt
echo.
echo ===================================================
echo PROCESO COMPLETADO. 
echo He creado un archivo llamado "registro_git.txt" 
echo con los detalles de lo que pasó.
echo ===================================================
pause
