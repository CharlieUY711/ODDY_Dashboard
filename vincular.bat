@echo off
setlocal

if "%1"=="" (
    echo Debes pasar la URL del repositorio remoto.
    echo Ejemplo: vincular.bat https://github.com/usuario/repo.git
    exit /b 1
)

set REMOTE_URL=%1

echo Vinculando este proyecto con: %REMOTE_URL%

REM Inicializar git si no existe
if not exist ".git" (
    git init
    echo Repositorio Git inicializado.
) else (
    echo Este proyecto ya tiene un repositorio Git.
)

REM Agregar remoto si no existe
git remote | findstr /C:"origin" >nul
if %errorlevel% neq 0 (
    git remote add origin %REMOTE_URL%
    echo Remote origin agregado.
) else (
    echo Remote origin ya existe.
)

REM Agregar archivos
git add .

REM Commit inicial (si no hay commits previos)
git commit -m "Initial commit" 2>nul

REM Crear rama main
git branch -M main

REM Push al remoto
git push -u origin main

echo Proyecto vinculado correctamente.
endlocal