@echo off
echo ===================================================
echo CONSULTANDO USUARIOS REGISTRADOS EN LA BASE DE DATOS
echo ===================================================
echo.

docker exec alimop_db psql -U postgres -d db.alimop -c "SELECT id, nombre_completo, email, rol, fecha_registro FROM usuarios ORDER BY id DESC LIMIT 10;"

echo.
echo ===================================================
echo Arriba deberias ver los ultimos 10 usuarios.
echo Si ves los que acabas de registrar, esta funcionando perfecto!
echo ===================================================
pause
