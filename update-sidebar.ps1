param(
  [switch]$Push
)

$ErrorActionPreference = "Stop"

Write-Host @"
Sidebar source is vendored at vendor/waypoint-sidebar (no GitHub fetch).

Edit files there, then run:

  npm install

from the project root so node_modules/waypoint-sidebar picks up package.json changes.
"@ -ForegroundColor Cyan

if ($Push) {
  Write-Host "(Ignored - nothing to push from this script.)" -ForegroundColor Yellow
}
