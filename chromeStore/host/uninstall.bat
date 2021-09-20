@echo off

:: Deletes the entry created by install_host.bat
REG DELETE "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.node.open_local" /f
REM REG DELETE "HKLM\Software\Google\Chrome\NativeMessagingHosts\com.node.open_local" /f

echo -----------------------------------
if errorlevel 1 (
  echo FAILED UNINSTALLATION
) else (
  echo SUCCESS UNINSTALLATION
)
echo -----------------------------------

echo .
set /p d=Hit Enter key to exit :


