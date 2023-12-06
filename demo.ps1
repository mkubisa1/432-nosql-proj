[CmdletBinding()]
$ErrorActionPreference = "Stop"

if(Test-Path "./query3-hits.json") {
    Write-Warning "Deleting old instance of query3-hits.json"
    Remove-Item "./query3-hits.json"
}

Write-Host "Launching MongoDB database..."
Start-Process -FilePath "mongod.exe" -ArgumentList "--dbpath", "./data/db" # assumes mongod.exe is in path enviornment variable
Start-Sleep -Seconds 5

Write-Host "Launching node.js server..."
Start-Process -FilePath "node.exe" -ArgumentList ".\nodejs-files\server.js" # assumes node.exe is in path enviornment variable
Start-Sleep -Seconds 2

Write-Host "Opening web interface..."
Start-Process .\nodejs-files\web-interface.html

Write-Host "press enter to stop the program" -foregroundcolor Magenta
pause
Stop-Process -Name "mongod"
Stop-Process -Name "node"