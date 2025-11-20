# 🧪 Browser Console Test - Find Working Endpoint

## 🎯 Quick Test (Do This Now!)

### Step 1: Open StaticFlow in Browser

1. Go to: `https://app.staticflow.io/templates`
2. **Login** to your account
3. **Make sure you can see templates** on the page

### Step 2: Open Browser Console

- Press `F12` or `Ctrl+Shift+J` (Windows)
- Or `Cmd+Option+J` (Mac)
- Click the **Console** tab

### Step 3: Paste This Code

```javascript
// Copy and paste this entire block into the console

async function findWorkingEndpoint() {
  // Get your token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('xano-token='))
    ?.split('=')[1];
  
  if (!token) {
    console.error('❌ No xano-token found in cookies!');
    return;
  }
  
  console.log('✅ Token found:', token.substring(0, 15) + '...');
  
  // Endpoints to test
  const endpoints = [
    '/api/templates/search/ads',
    '/api/templates/search',
    '/api/templates/ads',
    '/api/templates',
    '/api/ads',
    '/api/ads/search',
  ];
  
  for (const endpoint of endpoints) {
    const url = `https://app.staticflow.io${endpoint}?pageId=1&sort=desc&scope=all`;
    
    try {
      console.log(`\n🔍 Testing: ${endpoint}`);
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');
      
      if (response.ok && isJson) {
        const data = await response.json();
        console.log('✅ SUCCESS! This endpoint works:', endpoint);
        console.log('📊 Response:', data);
        console.log('\n🎉 USE THIS ENDPOINT:', endpoint);
        console.log('Full URL:', url);
        return;
      } else {
        console.log(`❌ Failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    // Small delay
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log('\n⚠️ No working endpoint found!');
  console.log('💡 Check the Network tab to see what endpoint StaticFlow actually uses.');
}

// Run the test
findWorkingEndpoint();
```

### Step 4: Read the Results

The console will show:
- ✅ **SUCCESS!** if it finds a working endpoint
- ❌ **Failed** for each non-working endpoint
- 🎉 **USE THIS ENDPOINT:** ← Copy this!

---

## 🔍 Alternative: Check Network Tab

If the script doesn't find anything:

1. **Stay on** `https://app.staticflow.io/templates`
2. Open DevTools **Network** tab
3. Filter by **Fetch/XHR**
4. **Scroll through templates** or click filters
5. **Look for API calls** that return ads
6. **Click on the successful call**
7. **Copy the Request URL**

Look for requests that:
- ✅ Return status **200**
- ✅ Have **application/json** content type
- ✅ URL contains `/api/`
- ✅ Response has ads/templates data

---

## 📸 What You're Looking For

### In Network Tab:

```
Name: ads (or similar)
Status: 200
Type: xhr or fetch
Size: > 1 KB (not HTML)

Request URL: https://app.staticflow.io/api/XXXXX ← THIS!
Request Method: GET or POST
```

### Click on it and check Response tab:

Should show JSON like:
```json
{
  "code": "SUCCESS",
  "data": {
    "ads": [...],
    ...
  }
}
```

**NOT** HTML like `<!DOCTYPE html>`

---

## 🎯 Common Endpoint Patterns to Check

While browsing StaticFlow, watch for these patterns in Network tab:

```
/api/templates
/api/ads
/api/v1/templates
/api/v2/templates
/api/search
/templates/list
/templates/query
```

---

## 📝 Once You Find It

Copy the working endpoint path and update your Vercel environment variable:

```
STATICFLOW_API_URL=https://app.staticflow.io/api/[THE_PATH_YOU_FOUND]
```

For example, if you found `/api/templates`, set:
```
STATICFLOW_API_URL=https://app.staticflow.io/api/templates
```

Then redeploy your app!

---

## 🆘 Still Can't Find It?

The endpoint might be:
1. **Protected** by additional authentication
2. **Different** for API users vs website users
3. **Changed** recently by StaticFlow

**Contact StaticFlow support** and ask:
> "I'm integrating with your API. What's the correct endpoint to fetch templates programmatically? The endpoint `/api/templates/search/ads` returns 404."

---

## 💡 Pro Tip

You can also check if StaticFlow has:
- API documentation
- Developer portal
- Integration guides

Common URLs:
- `https://app.staticflow.io/docs`
- `https://docs.staticflow.io`
- `https://developer.staticflow.io`
- `https://help.staticflow.io`

---

**Run the console test now and tell me what endpoint works!** 🚀

