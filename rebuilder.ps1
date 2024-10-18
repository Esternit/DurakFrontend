git pull
git checkout game-creation
Write-Host "Checked out to game-creation branch"
git fetch upstream
Write-Host "Fetched from upstream"
git merge upstream/game-creation -X theirs
Write-Host "Merged upstream/game-creation into current branch with theirs strategy"
git checkout main
Write-Host "Checked out to main branch"
git merge game-creation -X theirs
Write-Host "Merged game-creation into main with theirs strategy"
git push
Write-Host "Pushed changes"
