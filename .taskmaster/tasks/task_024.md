# Task ID: 24

**Title:** Skeleton Loading States

**Status:** pending

**Dependencies:** 2, 3

**Priority:** low

**Description:** Shimmer skeleton placeholders matching real content shapes.

File: src/components/ui/skeleton-loading.tsx

6 Base Variants:
- SkeletonLine: 100% × 12px, radius-sm
- SkeletonTitle: 60% × 20px, radius-sm
- SkeletonCircle: configurable diameter, radius-full
- SkeletonCard: 100% × 80px, radius-md
- SkeletonStat: 48px × 32px
- SkeletonAvatar: 24px circle

Shimmer: skeleton-shimmer keyframe from Task 3.
Background: linear-gradient(90deg, fg-5 25%, fg-10 50%, fg-5 75%), bg-size 200% 100%.

5 Tab-Specific Layouts:
- HomeTabSkeleton: greeting line + ring circle + 2 card skeletons
- AgentTabSkeleton: 3 message bubbles alternating sides
- ProjectTabSkeleton: section header + 4 key-value rows
- FilesTabSkeleton: 6 indented tree items
- SweepsTabSkeleton: headline stat + 3 trial rows

Used as Suspense fallbacks in Task 21.

**Details:**

Skeletons must match the exact layout dimensions of their real counterparts. This prevents layout shift when content loads.

**Test Strategy:**

1. Shimmer animation is visible and smooth
2. Each tab skeleton matches real tab layout shape
3. No layout shift when real content replaces skeleton

## Subtasks

### 24.1. 6 base skeleton variants with shimmer

**Status:** pending  
**Dependencies:** None  

### 24.2. 5 tab-specific skeleton layouts

**Status:** pending  
**Dependencies:** None  

