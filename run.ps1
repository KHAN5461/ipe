param (
    [string]$Question = "",
    [switch]$NoStart = $false
)

& "$PSScriptRoot\switch_question.ps1" -Question $Question -NoStart:$NoStart
