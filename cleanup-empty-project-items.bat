@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo Usuwanie pustych pozostalosc po dawnych szablonach...

for %%F in (
  "docs\LICENSE"
) do (
  if exist %%F (
    for %%S in (%%F) do (
      if %%~zS EQU 0 del /q %%F
    )
  )
)

for %%D in (
  "src\app\providers"
  "src\utils"
  "src\app\components"
  "src\services"
  "src\types"
) do (
  if exist %%D rd %%D 2>nul
)

echo Gotowe. Nie usunieto zadnych niepustych plikow ani katalogow.
pause
