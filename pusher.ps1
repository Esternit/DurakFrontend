param (
    [string]$commitMessage = "Updated files"
)

Write-Host "Adding changes to staging area..."
git add .

Write-Host "Committing changes with message: '$commitMessage'..."
git commit -m $commitMessage

Write-Host "Pushing changes to branch"
git push