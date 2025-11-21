# ✅ Category ID Mapping Fix

## 🎯 The Problem

StaticFlow's API expects **category IDs** (numbers) instead of category names (strings).

### Before (Incorrect):
```json
{
  "industryIdFilters": ["Fashion & Accessories"],
  "typeIdFilters": ["SaaS/Apps"]
}
```

### After (Correct):
```json
{
  "industryIdFilters": ["1"],
  "typeIdFilters": ["8"]
}
```

---

## 🗺️ Category Name → ID Mapping

| Category Name          | ID  |
|------------------------|-----|
| Fashion & Accessories  | 1   |
| Food                   | 2   |
| Health & Wellness      | 3   |
| Electronics            | 4   |
| Pets                   | 5   |
| Home & Furniture       | 6   |
| Skincare               | 7   |
| SaaS/Apps              | 8   |
| Self care              | 9   |
| Sport & outdoor        | 10  |
| Finance                | 11  |
| Education              | 12  |
| Kids & Baby            | 13  |

---

## 🔧 What I Fixed

### 1. Frontend (`lib/api.ts`)

Added category name to ID conversion **before** sending to the API:

```typescript
const CATEGORY_NAME_TO_ID: Record<string, string> = {
  "Fashion & Accessories": "1",
  "Food": "2",
  "Health & Wellness": "3",
  // ... etc
}

function convertCategoriesToIds(categories: string[]): string[] {
  return categories
    .map(category => {
      // If it's already a number, return as-is
      if (/^\d+$/.test(category)) return category
      // Otherwise, look up the ID from the name
      return CATEGORY_NAME_TO_ID[category] || category
    })
    .filter(id => id)
}
```

Then in `queryAds()`:
```typescript
const industryIds = convertCategoriesToIds(params.industry)
const typeIds = convertCategoriesToIds(params.type)

const requestBody = {
  industryFilters: industryIds,  // Now sends IDs: ["1", "3"]
  typeFilters: typeIds,
  ratioFilters: params.ratio,
}
```

### 2. Backend Proxies (Fallback)

Added the same conversion logic to all API proxy routes as a **safety fallback**:

- ✅ `app/api/ads-proxy/route.ts`
- ✅ `app/api/ads-direct/route.ts`
- ✅ `app/api/ads-proxy-cors/route.ts`

This ensures that even if category names slip through from the frontend, they'll be converted to IDs before reaching StaticFlow's API.

---

## 🎬 How It Works

### User Flow:

1. **User selects "Fashion & Accessories"** in the filter dropdown

2. **Component stores**: `industry: ["Fashion & Accessories"]`

3. **`queryAds()` converts**:
   ```
   "Fashion & Accessories" → "1"
   ```

4. **API receives**:
   ```json
   { "industryFilters": ["1"] }
   ```

5. **Proxy converts to StaticFlow format**:
   ```json
   { "industryIdFilters": ["1"] }
   ```

6. **StaticFlow API processes** the request with ID "1"

7. **Returns filtered results** for Fashion & Accessories category

---

## 📊 Example API Calls

### Selecting "Fashion & Accessories":

**Console logs:**
```
[queryAds] POST /api/ads-proxy?pageId=1&sort=desc&scope=all
[queryAds] Converted industries: ["Fashion & Accessories"] → ["1"]
[queryAds] Converted types: [] → []
📦 Request body: {
  "industryFilters": ["1"],
  "typeFilters": [],
  "ratioFilters": []
}

🔄 Converted industryFilters: ["1"] → ["1"]
📦 Request body: {
  "activeLibrary": "ads",
  "industryIdFilters": ["1"],
  "typeIdFilters": [],
  "ratioFilters": []
}
```

### Selecting "Health & Wellness":

**Console logs:**
```
[queryAds] Converted industries: ["Health & Wellness"] → ["3"]

📦 Request body: {
  "activeLibrary": "ads",
  "industryIdFilters": ["3"],
  "typeIdFilters": [],
  "ratioFilters": []
}
```

---

## ✅ Testing

1. **Refresh your browser** to load the updated code

2. **Select a category** from the filter dropdown (e.g., "Fashion & Accessories")

3. **Check console logs** for:
   ```
   [queryAds] Converted industries: ["Fashion & Accessories"] → ["1"]
   ```

4. **Verify** that the filtered ads appear correctly

5. **Try different categories** to test the mapping

---

## 🔍 Debugging

If filters aren't working, check console for:

### ✅ Correct (should see):
```
[queryAds] Converted industries: ["Fashion & Accessories"] → ["1"]
📦 Request body: {"activeLibrary":"ads","industryIdFilters":["1"],...}
```

### ❌ Incorrect (if you see this, the conversion isn't working):
```
📦 Request body: {"industryIdFilters":["Fashion & Accessories"],...}
```

---

## 📝 Files Updated

1. ✅ `lib/api.ts` - Added conversion logic and mapping
2. ✅ `app/api/ads-proxy/route.ts` - Added fallback conversion
3. ✅ `app/api/ads-direct/route.ts` - Added fallback conversion
4. ✅ `app/api/ads-proxy-cors/route.ts` - Added fallback conversion
5. ✅ `CATEGORY_ID_MAPPING.md` - This documentation

---

## 🎯 Key Points

1. **Category IDs are required** - StaticFlow's API expects numeric IDs, not names
2. **Conversion happens in frontend** - Primary conversion in `lib/api.ts`
3. **Backend has fallback** - Proxies also convert as safety measure
4. **Already a number? No change** - If value is already an ID, it passes through
5. **Unknown categories preserved** - If a category isn't in the mapping, it's kept as-is

---

**Status: ✅ READY TO TEST!**

Try selecting different categories and watch the console logs to see the conversion in action! 🚀

