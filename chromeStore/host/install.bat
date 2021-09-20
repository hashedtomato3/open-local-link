@echo off

:: Change HKCU to HKLM if you want to install globally.
:: %~dp0 is the directory containing this bat script and ends with a backslash.

REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.node.open_local" /ve /t REG_SZ /d "%~dp0manifest.json" /f

echo -----------------------------------
if errorlevel 1 (
  echo FAILED INSTALLATION
) else (
  echo SUCCESS INSTALLATION
)
echo -----------------------------------

echo .
set /p d=Hit Enter key to exit :

