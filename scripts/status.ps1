Write-Host "TopShelfWebsites Health Check"

Write-Host "`nGit:"
git status --short

Write-Host "`nDocker:"
docker ps

Write-Host "`nFinished."