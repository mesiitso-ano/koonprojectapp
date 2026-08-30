$git = "C:\Program Files\Git\cmd\git.exe"
$repo = "C:\Users\DOM\Desktop\koon"

# Config user
& $git -C $repo config user.email "koon@koon.app"
& $git -C $repo config user.name "Koon"

# Remote
$remotes = & $git -C $repo remote
if ($remotes -notcontains "origin") {
    & $git -C $repo remote add origin "https://github.com/mesiitso-ano/koonprojectapp.git"
    Write-Host "Remote origin ajouté"
} else {
    & $git -C $repo remote set-url origin "https://github.com/mesiitso-ano/koonprojectapp.git"
    Write-Host "Remote origin mis à jour"
}

# Stage all
& $git -C $repo add -A
Write-Host "Fichiers stagés"

# Status
& $git -C $repo status --short

# Commit
& $git -C $repo commit -m "feat: Koon Chat v1.0 — E2E chat desktop BIP39 + X25519 + NaCl"
Write-Host "Commit créé"

# Push
& $git -C $repo push -u origin main --force
Write-Host "Push terminé"
