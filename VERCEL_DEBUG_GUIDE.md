# 🔍 Vercel 405 Error Debug Guide

## Issue
Getting a **405 External API error** when fetching ads from the API.

---

## ✅ What I Fixed

### 1. **Enhanced Error Logging**
Added detailed logging to both API proxy routes:
- `app/api/ads-proxy/route.ts` - Shows XANO_TOKEN status, request/response details
- `app/api/canva-link/route.ts` - Shows token validation and API responses

### 2. **Token Validation**
Both routes now verify XANO_TOKEN is set before making requests:
```typescript
if (!XANO_TOKEN) {
  return NextResponse.json(
    { error: "Server configuration error: XANO_TOKEN not set" },
    { status: 500 }
  )
}
```

### 3. **Created Verification Endpoint**
New endpoint: `/api/verify-env`
- Visit: `https://your-site.vercel.app/api/verify-env`
- Shows which environment variables are set
- **⚠️ DELETE THIS FILE AFTER DEBUGGING** (security risk)

---

## 🔧 Steps to Debug

### Step 1: Verify Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Verify these are set:

```
XANO_TOKEN=eyJhbGciOi... (your token)
STATICFLOW_API_URL=https://app.staticflow.io/api/templates/search/ads
CANVA_LINK_API_URL=https://app.staticflow.io/api/templates/canva-link
```

4. **Important**: Make sure they are set for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### Step 2: Check Environment Variables Are Loading

Visit your deployed site:
```
https://your-site.vercel.app/api/verify-env
```

You should see:
```json
{
  "message": "Environment Variables Status",
  "checks": {
    "XANO_TOKEN": "✅ Set (eyJhbGciOiJBMjU2S1...)",
    "STATICFLOW_API_URL": "Using default",
    ...
  }
}
```

If XANO_TOKEN shows "❌ Not set", the environment variable isn't being read.

### Step 3: Check Vercel Logs

1. Go to your Vercel dashboard
2. Click on your deployment
3. Go to **Runtime Logs**
4. Look for these logs when the ads API is called:

```
✅ XANO_TOKEN is set: eyJhbGciOiJBMjU2S1...
📡 Fetching from: https://app.staticflow.io/...
📦 Request body: {...}
📥 Response status: 200 OK
```

Or if there's an error:
```
❌ External API error: 405 Method Not Allowed
```

### Step 4: Common Issues & Solutions

#### Issue: "XANO_TOKEN is not set"
**Solution**: 
- Add the environment variable in Vercel
- Redeploy the site

#### Issue: "405 Method Not Allowed"
**Possible causes**:
1. **Wrong HTTP method** - We use POST for `/api/ads-proxy`
2. **Authentication failed** - Token is invalid or expired
3. **API endpoint changed** - StaticFlow API might have changed

**Solutions**:
- Verify the XANO_TOKEN is the latest one
- Check if the StaticFlow API endpoint is correct
- Test the API directly with curl:

```bash
curl -X POST 'https://app.staticflow.io/api/templates/search/ads?pageId=1&sort=desc&scope=all' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: xano-token=YOUR_TOKEN_HERE' \
  -d '{"industryFilters":[],"typeFilters":[],"ratioFilters":[]}'
```

#### Issue: "External API error: 401 Unauthorized"
**Solution**:
- Your XANO_TOKEN has expired
- Get a new token from StaticFlow
- Update it in Vercel environment variables
- Redeploy

---

## 📝 How to Update XANO_TOKEN in Vercel

1. **Get New Token**: 
   - Log into StaticFlow
   - Open browser DevTools (F12)
   - Go to Application → Cookies
   - Copy the `xano-token` value

2. **Update in Vercel**:
   - Go to Settings → Environment Variables
   - Edit `XANO_TOKEN`
   - Paste new value
   - Save

3. **Redeploy**:
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## 🎯 Quick Checklist

- [ ] XANO_TOKEN is set in Vercel
- [ ] Environment variable is set for Production, Preview, and Development
- [ ] Site has been redeployed after adding env vars
- [ ] `/api/verify-env` shows token is set
- [ ] Runtime logs show token is loaded
- [ ] Token hasn't expired (get new one from StaticFlow if needed)

---

## 🔐 Security Note

**After debugging, DELETE these files:**
- `app/api/verify-env/route.ts` ← Shows sensitive info
- `VERCEL_DEBUG_GUIDE.md` (this file)

---

## 📞 Still Having Issues?

Check the Vercel Runtime Logs for the exact error message and let me know what you see!

