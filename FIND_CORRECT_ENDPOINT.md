# 🔍 Finding the Correct StaticFlow API Endpoint

## ❌ Current Problem

You're getting a **404 error** with HTML response:
```
"Staticflow | Not found" page
```

This means:
- ✅ Your XANO_TOKEN is being accepted
- ✅ The request is reaching StaticFlow's server
- ❌ The endpoint `/api/templates/search/ads` doesn't exist

---

## 🎯 Solution: Find the Real Endpoint

### Step 1: Get the Correct Endpoint from StaticFlow Website

1. **Open StaticFlow in your browser:**
   ```
   https://app.staticflow.io/templates
   ```

2. **Open DevTools (F12)**

3. **Go to Network Tab**

4. **Filter by "Fetch/XHR"**

5. **Browse through templates** (scroll, click, filter)

6. **Look for API calls** that return ads/templates

7. **Click on the API call** and note:
   ```
   Request URL: https://app.staticflow.io/api/XXXXX
   Request Method: GET or POST
   Query Parameters: ?pageId=1&sort=desc...
   ```

8. **Copy the full URL and method**

---

## 🧪 Test Possible Endpoints

I've created a diagnostic tool. After deploying, visit:

```
https://your-site.vercel.app/api/find-endpoint
```

This will test these possible endpoints:
- `/api/templates/search/ads` ← Current (404)
- `/api/templates/search`
- `/api/templates/ads`
- `/api/templates`
- `/api/ads`
- `/api/ads/search`
- `/api/search/ads`
- `/api/v1/templates/search/ads`
- `/api/v2/templates/search/ads`

**It will show you which one works!** ✅

---

## 📝 Common Endpoint Patterns

Based on the 404 error, the endpoint might actually be:

### Option A: Without `/search`
```
https://app.staticflow.io/api/templates/ads
```

### Option B: Different path
```
https://app.staticflow.io/api/ads
```

### Option C: With query path
```
https://app.staticflow.io/api/templates?type=ads
```

### Option D: Different version
```
https://app.staticflow.io/api/v1/templates
```

---

## 🔧 How to Update Once You Find It

### Step 1: Update Environment Variable

In Vercel:
```
Settings → Environment Variables → STATICFLOW_API_URL
```

Change from:
```
https://app.staticflow.io/api/templates/search/ads
```

To the correct endpoint (from Step 1 above)

### Step 2: Redeploy

After updating the environment variable, redeploy your site.

---

## 🎬 Video Guide: Finding the API Endpoint

**Manual Steps:**

1. Visit `https://app.staticflow.io/templates`
2. Login with your account
3. Press `F12` to open DevTools
4. Click **Network** tab
5. Click **Clear** (🚫 icon) to clear old requests
6. **Refresh the page** or **scroll through templates**
7. Look for requests to `/api/`
8. Click on the request
9. In the **Headers** tab, find:
   - **Request URL** ← This is what you need!
   - **Request Method** ← GET or POST
10. Copy the URL path (everything after `app.staticflow.io`)

---

## 💡 Quick Test Method

If you have access to StaticFlow's actual frontend code or can inspect their network requests, you can find the exact endpoint they use.

**Look for:**
```javascript
fetch("https://app.staticflow.io/api/XXXXX", {
  method: "GET" or "POST",
  ...
})
```

---

## 🚀 After Finding the Correct Endpoint

### Update the environment variable:

```bash
# In Vercel Dashboard or .env.local
STATICFLOW_API_URL=https://app.staticflow.io/api/[CORRECT_PATH]
```

### Or update directly in the code:

**File:** `app/api/ads-proxy/route.ts`  
**Line:** 3

```typescript
const API_URL = process.env.STATICFLOW_API_URL || "https://app.staticflow.io/api/[CORRECT_PATH]"
```

---

## 🆘 If You Can't Find It

### Option 1: Contact StaticFlow Support
Ask them:
> "What's the correct API endpoint to fetch templates/ads programmatically?"

### Option 2: Use My Endpoint Finder
Deploy and visit `/api/find-endpoint` - it will test all common variations automatically.

### Option 3: Check StaticFlow Documentation
Look for their API docs:
- `https://app.staticflow.io/docs`
- `https://app.staticflow.io/api-docs`
- `https://help.staticflow.io`

---

## ⚡ Quick Commands After Finding Endpoint

```bash
# Test the new endpoint locally
curl -X GET "https://app.staticflow.io/api/[NEW_PATH]?pageId=1" \
  -H "Cookie: xano-token=YOUR_TOKEN"

# If it returns JSON, you found it! ✅
```

---

## 📊 What the Response Should Look Like

When you find the correct endpoint, you should get JSON like:

```json
{
  "code": "SUCCESS",
  "data": {
    "ads": [...],
    "total": 123,
    "page": 1
  }
}
```

**NOT** HTML like:
```html
<!DOCTYPE html>
<html>...</html>
```

---

## 🎯 Summary

1. **Deploy current changes** with `/api/find-endpoint`
2. **Visit** `/api/find-endpoint` to test all variations
3. **OR** Check StaticFlow's network tab for the real endpoint
4. **Update** `STATICFLOW_API_URL` environment variable
5. **Redeploy** and test

---

**The endpoint finder will do the heavy lifting for you!** 🚀

Just deploy and check `/api/find-endpoint`

