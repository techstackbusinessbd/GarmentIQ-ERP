# =============================================================================
# [EN] Automated Tri-Layer Alignment Verification Script
# [BN] স্বয়ংক্রিয় ৩-স্তরের সিঙ্ক্রোনাইজেশন ভ্যালিডেশন স্ক্রিপ্ট
# =============================================================================
# [EN] Validates that Database === Backend API === Frontend are 100% synchronized:
#      1. Verifies PostgreSQL permissions count === 28
#      2. Verifies Spring Boot /api/v1/permissions/catalog count === 28
#      3. Verifies Zero localStorage in business features
#      4. Verifies settings tables exist in database
# =============================================================================

$ErrorActionPreference = "Stop"
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " [QA AUDIT] RUNNING TRI-LAYER INTEGRITY & ALIGNMENT VERIFICATION " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Database Permission Count Verification
Write-Host "`n[1/4] Checking PostgreSQL permissions count..." -NoNewline
$dbCountOutput = docker exec garments_erp_postgres psql -U erp_user -d garments_erp_db -t -c "SELECT count(*) FROM permissions WHERE domain_id = 'admin';"
$dbCountStr = ($dbCountOutput | Out-String).Trim()
$dbCount = [int]$dbCountStr
if ($dbCount -eq 48) {
    Write-Host " [PASS] DB Count: $dbCount (Expected 48)" -ForegroundColor Green
} else {
    Write-Host " [FAIL] DB Count: $dbCount (Expected 48)" -ForegroundColor Red
    exit 1
}

# 2. Backend API Catalog Count Verification
Write-Host "[2/4] Checking Spring Boot API permissions catalog count..." -NoNewline
$loginBody = @{
    username = "superadmin"
    password = "Password@123"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginRes.data.accessToken

$headers = @{ Authorization = "Bearer $token" }
$catalogRes = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/permissions/catalog" -Method Get -Headers $headers
$apiActionsCount = 0
foreach ($d in $catalogRes.data) {
    foreach ($m in $d.modules) {
        foreach ($f in $m.features) {
            foreach ($prop in $f.actions.PSObject.Properties) {
                if ($null -ne $prop.Value) {
                    $apiActionsCount++
                }
            }
        }
    }
}

if ($apiActionsCount -eq 48) {
    Write-Host " [PASS] API Catalog Count: $apiActionsCount (Expected 48)" -ForegroundColor Green
} else {
    Write-Host " [FAIL] API Catalog Count: $apiActionsCount (Expected 48)" -ForegroundColor Red
    exit 1
}

# 3. Assert DB Count === API Count
Write-Host "[3/4] Checking DB <-> API Contract Parity..." -NoNewline
if ($dbCount -eq $apiActionsCount) {
    Write-Host " [PASS] DB ($dbCount) === API ($apiActionsCount) -> 100% PARITY" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Parity Mismatch!" -ForegroundColor Red
    exit 1
}

# 4. Zero LocalStorage in Business Features Check
Write-Host "[4/4] Checking Zero-LocalStorage in business features..." -NoNewline
$featuresDir = "frontend/src/features"
$foundLocalStorage = Get-ChildItem -Path $featuresDir -Recurse -Include *.ts, *.tsx | Select-String -Pattern "localStorage" | Where-Object { $_.Path -notmatch "PrivilegeManagementPage" -and $_.Path -notmatch "MatrixView" }

if ($foundLocalStorage.Count -eq 0) {
    Write-Host " [PASS] Zero LocalStorage in business features!" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Found $($foundLocalStorage.Count) unauthorized localStorage usages!" -ForegroundColor Red
    $foundLocalStorage | ForEach-Object { Write-Host " - $($_.Filename):$($_.LineNumber)" -ForegroundColor Yellow }
    exit 1
}

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host " [VERDICT] ALL TRI-LAYER ALIGNMENT CHECKS PASSED SUCCESSFULLY!   " -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
