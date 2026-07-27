@echo off
setlocal EnableExtensions

cd /d "%~dp0"

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm"') do set "STAMP=%%i"

set "OUTPUT=CHB_Project_%STAMP%.zip"
set "TEMP_DIR=%TEMP%\chb-project-zip-%RANDOM%-%RANDOM%"

echo.
echo Tworzenie archiwum projektu CHB...
echo Plik wynikowy: %OUTPUT%
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$root = (Get-Location).Path;" ^
  "$temp = '%TEMP_DIR%';" ^
  "$output = Join-Path $root '%OUTPUT%';" ^
  "$excludedDirectories = @('.git', 'node_modules', 'dist');" ^
  "$excludedFiles = @('.env', '.env.local', '.env.production', '.env.development', '%OUTPUT%');" ^
  "New-Item -ItemType Directory -Force -Path $temp | Out-Null;" ^
  "Get-ChildItem -Force -Path $root | Where-Object {" ^
  "  $excludedDirectories -notcontains $_.Name -and" ^
  "  $excludedFiles -notcontains $_.Name -and" ^
  "  $_.Extension -ne '.zip'" ^
  "} | ForEach-Object {" ^
  "  Copy-Item -Path $_.FullName -Destination $temp -Recurse -Force" ^
  "};" ^
  "if (Test-Path $output) { Remove-Item $output -Force };" ^
  "Compress-Archive -Path (Join-Path $temp '*') -DestinationPath $output -CompressionLevel Optimal;" ^
  "Remove-Item $temp -Recurse -Force;"

if errorlevel 1 (
  echo.
  echo BLAD: Nie udalo sie utworzyc archiwum.
  pause
  exit /b 1
)

echo.
echo Gotowe: %OUTPUT%
echo Pominieto: .git, node_modules, dist, pliki .env i istniejace archiwa ZIP.
echo.
pause
