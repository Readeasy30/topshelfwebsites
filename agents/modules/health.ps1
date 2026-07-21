# TopShelfWebsites Agent Health Module

function Test-AgentHealth {
    [PSCustomObject]@{
        Agent = $env:COMPUTERNAME
        Status = "WORKING"
        Timestamp = (Get-Date).ToUniversalTime().ToString("o")
    }
}
