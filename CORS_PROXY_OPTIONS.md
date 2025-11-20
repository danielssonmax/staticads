# 🌐 CORS Proxy Options for StaticFlow API

I've created **3 different approaches** to access the StaticFlow API. You can test which one works best!

---

## 🎯 **Option 1: Smart Proxy (Original - Updated)** ✅ RECOMMENDED
**Endpoint:** `/api/ads-proxy`

**What it does:**
- Tries GET method first (to avoid 405)
- Falls back to POST if GET fails
- Handles authentication with XANO_TOKEN
- Best error handling and logging

**Use this if:**
- You want the most intelligent approach
- You need automatic fallback
- You want detailed error logging

**Test it:**
```bash
# Should automatically work with your existing code
```

---

## 🔀 **Option 2: Pure CORS Proxy** 
**Endpoint:** `/api/ads-proxy-cors`

**What it does:**
- Acts as a pure pass-through proxy
- Forwards requests with minimal modification
- Adds CORS headers to responses
- Supports both GET and POST

**Use this if:**
- Option 1 isn't working
- You need exact request forwarding
- You want CORS headers on all responses

**To test it, update your fetch call:**
```typescript
// In your component
const response = await fetch('/api/ads-proxy-cors?pageId=1&sort=desc&scope=all', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    industryFilters: [],
    typeFilters: [],
    ratioFilters: []
  })
})
```

---

## 🌍 **Option 3: External CORS Proxy** 
**Endpoint:** `/api/ads-direct`

**What it does:**
- Uses public CORS proxy service (corsproxy.io)
- Bypasses our server limitations
- Falls back to external proxy if direct call fails

**Use this if:**
- Options 1 & 2 both fail
- You're getting CORS errors
- The API blocks requests from Vercel

**To test it:**
```typescript
// In your component
const response = await fetch('/api/ads-direct?pageId=1&sort=desc&scope=all', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    industryFilters: [],
    typeFilters: [],
    ratioFilters: []
  })
})
```

---

## 🧪 **How to Test All Options**

### Step 1: Test Current (Smart Proxy)
Your app is already using this. If ads load, you're done! ✅

### Step 2: If Still Getting 405, Try CORS Proxy
Update the API URL in your component:

**Find where you fetch ads** (likely in `lib/api.ts` or a component):
```typescript
// Change this:
const response = await fetch('/api/ads-proxy?...')

// To this:
const response = await fetch('/api/ads-proxy-cors?...')
```

### Step 3: If Still Failing, Try External Proxy
```typescript
// Change to:
const response = await fetch('/api/ads-direct?...')
```

---

## 🔍 **Quick Diagnosis**

### Check which endpoint is being called:
Look in your browser Network tab or Vercel logs:

**If you see:**
```
📡 Fetching from: https://app.staticflow.io/...
📦 Using GET method
```
→ Smart Proxy is working ✅

**If you see:**
```
🔀 CORS Proxy forwarding to: ...
```
→ CORS Proxy is working ✅

**If you see:**
```
🔄 Trying with CORS proxy: https://corsproxy.io/...
```
→ External proxy is being used ✅

---

## 🎨 **Which One Should You Use?**

### ✅ Start with Option 1 (Smart Proxy)
- **Most features**
- **Best error handling**
- **Already integrated**

### If 405 persists → Try Option 2 (CORS Proxy)
- **More direct approach**
- **Better for API compatibility**

### Last resort → Try Option 3 (External Proxy)
- **Bypasses server limitations**
- **Uses public proxy service**
- ⚠️ **Note:** External services can be rate-limited

---

## 📝 **Where to Change the Endpoint**

Find the file where ads are fetched. Likely one of these:

1. **`lib/api.ts`** - Look for the fetch call
2. **`components/protected-ads-library.tsx`** - Or the component directly
3. **`components/ad-library.tsx`** - Check here too

**Change this line:**
```typescript
const url = `/api/ads-proxy?${params}` // Current
```

**To one of these:**
```typescript
const url = `/api/ads-proxy-cors?${params}` // Option 2
// OR
const url = `/api/ads-direct?${params}` // Option 3
```

---

## 💡 **Pro Tip: Test Endpoints Directly**

You can test each endpoint in your browser or Postman:

**Test Smart Proxy:**
```
POST https://your-site.vercel.app/api/ads-proxy?pageId=1&sort=desc&scope=all
Body: {"industryFilters":[],"typeFilters":[],"ratioFilters":[]}
```

**Test CORS Proxy:**
```
POST https://your-site.vercel.app/api/ads-proxy-cors?pageId=1&sort=desc&scope=all
Body: {"industryFilters":[],"typeFilters":[],"ratioFilters":[]}
```

**Test External Proxy:**
```
POST https://your-site.vercel.app/api/ads-direct?pageId=1&sort=desc&scope=all
Body: {"industryFilters":[],"typeFilters":[],"ratioFilters":[]}
```

---

## 🚀 **Next Steps**

1. **Deploy all three options** (commit and push)
2. **Test Option 1 first** (already integrated)
3. **If it fails, try Option 2** (change one line)
4. **Still failing? Try Option 3** (last resort)
5. **Check `/api/test-staticflow`** to see raw API responses

Let me know which one works and I'll help you optimize it! 🎉

