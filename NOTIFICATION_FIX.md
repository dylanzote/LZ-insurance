# Fix for "Unable to resolve expo-notifications" Error

## Issue
The Metro bundler cannot resolve `expo-notifications` even though it's installed. This is a cache issue.

## Solution

**Stop your dev server and run:**

```bash
# Clear Metro bundler cache and restart
npx expo start --clear
```

If that doesn't work, try:

```bash
# Clear all caches
rm -rf node_modules/.cache
rm -rf .expo
npx expo start --clear
```

Or on Windows PowerShell:
```powershell
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
npx expo start --clear
```

## Verification

The package is correctly installed:
- ✅ `expo-notifications@0.32.13` is in `package.json`
- ✅ Package exists in `node_modules/expo-notifications`
- ✅ JSX structure in `app/_layout.tsx` is correct

The issue is purely a bundler cache problem that will be resolved after restarting with `--clear`.

## Alternative: If Still Not Working

If the above doesn't work, try:

```bash
# Reinstall the package
npm uninstall expo-notifications
npx expo install expo-notifications
npx expo start --clear
```








