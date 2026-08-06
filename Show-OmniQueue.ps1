# Show-OmniQueue.ps1
$LocalStatsUrl = "http://localhost:20128/api/metrics/queue" # OmniRoute internal queue analytics
Write-Host "Initializing live OmniRoute request queue streaming panel..." -ForegroundColor Cyan

while ($true) {
    try {
        # Using required basic parsing to avoid headless execution warnings
        $Metrics = Invoke-RestMethod -Uri $LocalStatsUrl -Method Get -UseBasicParsing -ErrorAction Stop
        
        Clear-Host
        Write-Host "--- OmniRoute Live Concurrency Stream ---" -ForegroundColor Yellow
        Write-Host "Active Executing Streams : $($Metrics.active_connections) / 32" -ForegroundColor Green
        Write-Host "Queued Pending Requests  : $($Metrics.queued_requests)" -ForegroundColor Orange
        Write-Host "Tokens Compressed (RTK)  : $($Metrics.tokens_saved_count) saved" -ForegroundColor DeepSkyBlue
        Write-Host "-----------------------------------------" -ForegroundColor Yellow
    } catch {
        Clear-Host
        Write-Host "--- OmniRoute Live Concurrency Stream ---" -ForegroundColor Yellow
        Write-Host "🔄 Local proxy parsing or queue idle. Awaiting project pipeline request payload..." -ForegroundColor Gray
    }
    Start-Sleep -Seconds 2
}
