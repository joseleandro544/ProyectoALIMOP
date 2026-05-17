@echo off
echo Iniciando el proceso de carga a GitHub...

cd "c:\Users\ENBOG16\OneDrive - Grupo Energia Bogota\Escritorio\alimop\ProyectoALIMOP"

echo Inicializando Git...
git init

echo Añadiendo origen remoto...
git remote add origin https://github.com/joseleandro544/ProyectoALIMOP.git
git remote set-url origin https://github.com/joseleandro544/ProyectoALIMOP.git

echo Añadiendo archivos...
git add .

echo Creando commit...
git commit -m "Versión inicial de ProyectoALIMOP (Backend y Frontend)"

echo Renombrando rama a main...
git branch -M main

echo Subiendo a GitHub...
git push -u origin main

echo Proceso completado. Presiona cualquier tecla para salir.
pause
