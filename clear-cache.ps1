# Clear webduh Documentation Cache
Write-Host "🧹 Clearing webduh documentation cache..." -ForegroundColor Cyan

# Clear Next.js cache
if (Test-Path "apps\dashboard\.next") {
    Remove-Item -Recurse -Force "apps\dashboard\.next"
    Write-Host "✅ Cleared .next directory" -ForegroundColor Green
}

# Clear node_modules cache
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "✅ Cleared node_modules cache" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Cache cleared successfully!" -ForegroundColor Green
Write-Host "Now restart your dev server with: npm run dev" -ForegroundColor Yellow
Write-Host "Documentation will be available at: http://localhost:3001/docs" -ForegroundColor Cyan

Pause
