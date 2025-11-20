# 🔧 StaticFlow 405 Error Fix

## What I Changed

### ✅ Updated ads-proxy to try GET method first
The 405 error means POST is not allowed. I've updated the code to:
1. Try GET method with filters as query params
2. If GET fails with 405, fallback to POST
3. Better error logging

### ✅ Created Test Endpoint
New endpoint: `/api/test-staticflow`
- Tests both GET and POST methods
- Shows exact response from StaticFlow API
- Helps diagnose the exact issue

---

## 🚀 Next Steps

### Step 1: Deploy Changes
Commit and push these changes to trigger a Vercel deployment.

### Step 2: Test the API
After deployment, visit:
```
https://your-site.vercel.app/api/test-staticflow
```

This will show you:
```json
{
  "tokenSet": true,
  "tests": [
    {
      "method": "GET",
      "status": 200 or 405,
      "statusText": "OK" or "Method Not Allowed",
      ...
    },
    {
      "method": "POST",
      "status": 200 or 405,
      ...
    }
  ]
}
```

### Step 3: Interpret Results

#### ✅ If GET returns 200:
**Good news!** The API now uses GET method.
- Your app should work now
- The changes I made will handle this automatically

#### ❌ If both GET and POST return 405:
**Possible issues:**
1. **XANO_TOKEN is invalid/expired**
   - Get a new token from StaticFlow
   - Update in Vercel environment variables

2. **API endpoint changed**
   - Check if StaticFlow changed their API URL
   - You might need to contact StaticFlow support

3. **Authentication issue**
   - The token format might have changed
   - Check if you need additional headers

#### ⚠️ If you see HTML in the response:
This means you're being redirected (likely auth failed):
- Token is invalid or expired
- Get a new token from StaticFlow browser cookies

---

## 🔑 How to Get New XANO_TOKEN

1. **Log into StaticFlow**: https://app.staticflow.io
2. **Open DevTools**: Press F12
3. **Go to Application tab** → Cookies
4. **Copy `xano-token` value**
5. **Update in Vercel**:
   - Settings → Environment Variables
   - Edit XANO_TOKEN
   - Paste new value
   - Redeploy

---

## 🔍 Check Vercel Logs

After deployment, when you try to load ads:
1. Go to Vercel Dashboard → Runtime Logs
2. Look for:
```
📡 Fetching from: https://...
📦 Using GET method (405 error indicated POST not allowed)
📥 Response status: 200 OK
```

Or:
```
❌ External API error: 405
```

---

## 🧹 Cleanup After Fixing

**Delete these debug files:**
- `app/api/verify-env/route.ts`
- `app/api/test-staticflow/route.ts`
- `STATICFLOW_405_FIX.md` (this file)
- `VERCEL_DEBUG_GUIDE.md`

---

## 💡 Most Likely Cause

Based on the error, the most likely causes are:

1. **StaticFlow API changed to GET** (most likely)
   - My code now handles this ✅

2. **XANO_TOKEN expired** (very common)
   - Get new token from StaticFlow
   - Update in Vercel

3. **API endpoint URL changed**
   - Check with StaticFlow team

---

## 📞 Need Help?

Check `/api/test-staticflow` results and share them with me!

