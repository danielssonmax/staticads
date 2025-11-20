# 🚀 Quick CORS Proxy Fix

## ✅ I've created 3 proxy options for you!

You can now test different approaches to see which one works with StaticFlow API.

---

## 📍 **Where to Change (One Line!)**

**File:** `lib/api.ts`  
**Line:** 10

### Current code:
```typescript
const url = new URL("/api/ads-proxy", window.location.origin)
```

---

## 🔀 **Option 1: Smart Proxy (Current)** - Try this first!
```typescript
const url = new URL("/api/ads-proxy", window.location.origin)
```
✅ Already active - tries GET first, falls back to POST

---

## 🌐 **Option 2: CORS Proxy** - If Option 1 fails
```typescript
const url = new URL("/api/ads-proxy-cors", window.location.origin)
```
📦 Pure CORS proxy with full headers

---

## 🔗 **Option 3: External Proxy** - Last resort
```typescript
const url = new URL("/api/ads-direct", window.location.origin)
```
🌍 Uses public CORS proxy service (corsproxy.io)

---

## 🧪 **How to Test:**

### Step 1: Deploy Current Changes
```bash
git add .
git commit -m "Add CORS proxy options"
git push
```

### Step 2: Test Option 1 (Already Active)
- Wait for deployment
- Visit your site and try loading ads
- Check browser console for errors

### Step 3: If Still 405, Try Option 2
- Change line 10 in `lib/api.ts` to use `/api/ads-proxy-cors`
- Commit and push
- Test again

### Step 4: If Still Failing, Try Option 3
- Change line 10 to use `/api/ads-direct`
- Commit and push
- Test again

---

## 🔍 **Check Logs:**

After deploying, check Vercel Runtime Logs for:

**Option 1 logs:**
```
📡 Fetching from: https://app.staticflow.io/...
📦 Using GET method
✅ Successfully fetched ads data
```

**Option 2 logs:**
```
🔀 CORS Proxy forwarding to: ...
📥 CORS Proxy response: 200 OK
```

**Option 3 logs:**
```
📡 Direct API call to: ...
🔄 Trying with CORS proxy: https://corsproxy.io/...
✅ CORS proxy succeeded
```

---

## 💡 **Most Likely Solution:**

Based on the 405 error, here's my prediction:

1. **Option 1** should work (I fixed it to use GET)
2. If not, your **XANO_TOKEN might be expired**
3. **Option 2** will work if it's a CORS issue
4. **Option 3** will work if Vercel is being blocked

---

## ⚡ **Quick Check Commands:**

Test each endpoint directly after deployment:

```bash
# Test Option 1 (Smart Proxy)
curl -X POST "https://your-site.vercel.app/api/ads-proxy?pageId=1&sort=desc&scope=all" \
  -H "Content-Type: application/json" \
  -d '{"industryFilters":[],"typeFilters":[],"ratioFilters":[]}'

# Test Option 2 (CORS Proxy)
curl -X POST "https://your-site.vercel.app/api/ads-proxy-cors?pageId=1&sort=desc&scope=all" \
  -H "Content-Type: application/json" \
  -d '{"industryFilters":[],"typeFilters":[],"ratioFilters":[]}'

# Test Option 3 (External Proxy)
curl -X POST "https://your-site.vercel.app/api/ads-direct?pageId=1&sort=desc&scope=all" \
  -H "Content-Type: application/json" \
  -d '{"industryFilters":[],"typeFilters":[],"ratioFilters":[]}'
```

---

## 🎯 **TL;DR:**

1. **Deploy these changes** (3 new proxy options created)
2. **Option 1 is already active** - test if ads load now
3. **If still 405** → Change line 10 in `lib/api.ts` to try Option 2 or 3
4. **Check Vercel logs** to see which one works

Let me know which option works! 🚀

