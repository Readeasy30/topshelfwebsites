# Test-ModelLatencies.ps1
$JsonPath = "fallbacks.json"
$LocalGateway = "http://localhost:20128/v1/models"
$StatusFile = "status_log.html"

if (-not (Test-Path $JsonPath)) {
    Write-Error "Cannot locate fallbacks.json."
    return
}

$FailedModels = @()
$Config = Get-Content -Path $JsonPath -Raw | ConvertFrom-Json
$Tiers = $Config.priorities.PSObject.Properties

foreach ($Tier in $Tiers) {
    $ModelsToTest = @()
    if ($Tier.Value.primary) { $ModelsToTest += $Tier.Value.primary }
    if ($Tier.Value.alternatives) { $ModelsToTest += $Tier.Value.alternatives }

    foreach ($Model in $ModelsToTest) {
        $Provider = $Model.Split('/')
        $TargetHost = "://openai.com"
        if ($Provider -eq "anthropic") { $TargetHost = "://anthropic.com" }
        if ($Provider -eq "google")    { $TargetHost = "://googleapis.com" }
        
        $Ping = Test-NetConnection -ComputerName $TargetHost -Port 443 -WarningAction SilentlyContinue
        
        if (-not $Ping.TcpTestSucceeded) {
            $FailedModels += "[Tier: $($Tier.Name)] $Model"
        }
    }
}

# Pipeline Logger Logic: Generate Status Component for Cloudflare Pages
if ($FailedModels.Count -gt 0) {
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $HtmlContent = @"
    <div style='background: #ff4a4a22; border: 1px solid #ff4a4a; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: left;'>
        <b style='color: #ff6b6b;'>⚠️ Cloud Gateway Alert ($Timestamp):</b>
        <ul style='margin: 5px 0 0 0; padding-left: 20px; color: #f0f6fc; font-size: 13px;'>
            $( ($FailedModels | ForEach-Object { "<li>$_ Connection Offline</li>" }) -join "" )
        </ul>
    </div>
"@
    Set-Content -Path $StatusFile -Value $HtmlContent -Encoding utf8
    
    # Automatically push the visual degradation report up to Cloudflare Pages
    git add $StatusFile
    git commit -m "site(status): report live model connection failures"
    git push origin main
    Write-Host "🚨 Outages detected! Live Cloudflare Dashboard status log updated." -ForegroundColor Orange
} else {
    # If all models pass, clear any old outage blocks cleanly
    if (Test-Path $StatusFile) { 
        Remove-Item $StatusFile 
        git rm $StatusFile 2>$null
        git commit -m "site(status): clear connectivity issues" 2>$null
        git push origin main 2>$null
    }
    Write-Host "✅ All clear! Remote networks are structurally sound." -ForegroundColor Green
}
