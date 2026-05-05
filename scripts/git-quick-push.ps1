param(
  [string]$Message = "chore: quick update",
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

Write-Host "Checking repo status..."
git rev-parse --is-inside-work-tree | Out-Null

Write-Host "Staging changes..."
git add -A

$hasChanges = git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "No staged changes. Nothing to commit."
  exit 0
}

Write-Host "Committing..."
git commit -m $Message

Write-Host "Pushing to origin/$Branch..."
git push origin $Branch

Write-Host "Done."
