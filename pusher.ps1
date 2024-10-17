param (
    [string]$cM = "Updated files"
)

Write-Host "Adding changes to staging area..."
git add .

Write-Host "Committing changes with message: '$cM'..."
git commit -m $cM

Write-Host "Pushing changes to branch"
git push