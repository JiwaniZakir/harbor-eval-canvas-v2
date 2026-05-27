# Task ID: 34

**Title:** Vercel Deployment + Production Verification

**Status:** pending

**Dependencies:** 32, 33

**Priority:** medium

**Description:** Deploy to Vercel and verify production.

1. npm run build passes clean
2. Deploy to Vercel (vercel CLI or GitHub integration)
3. Verify production URL:
   - Page loads < 1.5s FCP
   - All fonts load correctly
   - Onboarding wizard appears
   - Canvas renders after onboarding
   - All 5 tabs work
   - Mobile layout works
   - No console errors
4. Add deployment URL to README

**Details:**

Final production deployment. The app should be publicly accessible and fully functional.

Vercel config: default Next.js settings should work. No special vercel.json needed unless issues arise.

**Test Strategy:**

1. Production URL returns 200
2. Lighthouse score > 90 performance
3. All interactive flows work end-to-end
4. Mobile responsive works on real device

## Subtasks

### 34.1. npm run build clean

**Status:** pending  
**Dependencies:** None  

### 34.2. Deploy to Vercel

**Status:** pending  
**Dependencies:** None  

### 34.3. Production verification on live URL

**Status:** pending  
**Dependencies:** None  

### 34.4. Add URL to README

**Status:** pending  
**Dependencies:** None  

