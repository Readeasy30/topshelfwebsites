# Test-ModelLatencies.ps1
$JsonPath = "fallbacks.json"
$LocalGateway = "http://localhost:20128/v1/models"

if (-not (Test-Path $JsonPath)) {
    Write-Error "Cannot locate fallbacks.json. Please run this script in your repository root."
    return
}

Write-Host "--- OmniRoute Failover Latency Engine ---" -ForegroundColor Yellow

Write-Host "`nChecking local OmniRoute process endpoint status..." -ForegroundColor Cyan
try {
    # -UseBasicParsing added here to permanently bypass security warnings
    $GatewayCheck = Invoke-WebRequest -Uri $LocalGateway -Method Get -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Local Gateway Online (Port 20128 Active)" -ForegroundColor Green
} catch {
    Write-Host "❌ Warning: Local OmniRoute server appears offline or unreachable." -ForegroundColor Orange
    Write-Host "Running ping-only mock traceroute analysis instead..." -ForegroundColor DarkGray
}

$Config = Get-Content -Path $JsonPath -Raw | ConvertFrom-Json
$Tiers = $Config.priorities.PSObject.Properties
foreach ($Tier in $Tiers) {
    Write-Host "`n========================================" -ForegroundColor Gray
    Write-Host "🎯 Target Tier Block: $($Tier.Name)" -ForegroundColor Cyan
    
    $ModelsToTest = @()
    if ($Tier.Value.primary) { $ModelsToTest += $Tier.Value.primary }
    if ($Tier.Value.alternatives) { $ModelsToTest += $Tier.Value.alternatives }

    foreach ($Model in $ModelsToTest) {
        Write-Host "  Testing Model Node: $Model" -ForegroundColor Yellow
        
        $Provider = $Model.Split('/')
        $TargetHost = "://openai.com"
        if ($Provider -eq "anthropic") { $TargetHost = "://anthropic.com" }
        if ($Provider -eq "google")    { $TargetHost = "://googleapis.com" }
        if ($Provider -eq "deepseek")  { $TargetHost = "://deepseek.com" }
        
        $Metric = Measure-Command {
            $Ping = Test-NetConnection -ComputerName $TargetHost -Port 443 -WarningAction SilentlyContinue
        }
        
        if ($Ping.TcpTestSucceeded) {
            $LatencyTime = [math]::Round($Metric.TotalMilliseconds, 0)
            Write-Host "  --> Target Edge Response: Success | Network RTT: $LatencyTime ms" -ForegroundColor Green
        } else {
            Write-Host "  --> Target Edge Response: FAILED ❌" -ForegroundColor Red
        }
    }
}
