@echo off
chcp 65001 > nul
echo ===================================================
echo   DIAGNÓSTICO AUTOMÁTICO DE BASE DE DATOS ALIMOP
echo ===================================================
echo.

cd /d "c:\Users\ENBOG16\OneDrive - Grupo Energia Bogota\Escritorio\alimop\ProyectoALIMOP\backend"
node src/diagnostico.js

echo.
pause
