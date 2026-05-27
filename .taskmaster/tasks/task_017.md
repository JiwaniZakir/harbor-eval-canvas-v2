# Task ID: 17

**Title:** Skeleton Loading States

**Status:** pending

**Dependencies:** 1

**Priority:** low

**Description:** Shimmer skeleton placeholders for all loading states.

File: src/components/ui/skeleton-loading.tsx

6 Base Variants:
- SkeletonLine: 100% width, 12px height, rounded-sm
- SkeletonTitle: 60% width, 20px height, rounded-sm
- SkeletonCircle: configurable diameter, rounded-full
- SkeletonCard: full width, 80px height, rounded-md
- SkeletonStat: 48px width, 32px height
- SkeletonAvatar: 24px circle

Shimmer animation:
- Linear gradient sweep: transparent → fg-5 → transparent
- 1.5s linear infinite
- background-size: 200% 100%

5 Tab-Specific Layouts:
- HomeTabSkeleton: greeting line + progress ring circle + 2 card skeletons
- AgentTabSkeleton: 3 alternating message bubbles (left/right)
- ProjectTabSkeleton: section header + 4 key-value rows
- FilesTabSkeleton: 6 tree item lines with indent
- SweepsTabSkeleton: headline stat + 3 trial rows

**Details:**

Shimmer skeleton placeholders for all loading states.

File: src/components/ui/skeleton-loading.tsx

6 Base Variants:
- SkeletonLine: 100% width, 12px height, rounded-sm
- SkeletonTitle: 60% width, 20px height, rounded-sm
- SkeletonCircle: configurable diameter, rounded-full
- SkeletonCard: full width, 80px height, rounded-md
- SkeletonStat: 48px width, 32px height
- SkeletonAvatar: 24px circle

Shimmer animation:
- Linear gradient sweep: transparent → fg-5 → transparent
- 1.5s linear infinite
- background-size: 200% 100%

5 Tab-Specific Layouts:
- HomeTabSkeleton: greeting line + progress ring circle + 2 card skeletons
- AgentTabSkeleton: 3 alternating message bubbles (left/right)
- ProjectTabSkeleton: section header + 4 key-value rows
- FilesTabSkeleton: 6 tree item lines with indent
- SweepsTabSkeleton: headline stat + 3 trial rows

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 17.1. 6 base skeleton variants with shimmer animation

**Status:** pending  
**Dependencies:** None  

### 17.2. 5 tab-specific skeleton layouts

**Status:** pending  
**Dependencies:** None  

