# Restoration Plan: Back to Working Editor + Add Improvements

## Current Situation
- NEW DiagramEditor.tsx: 10 useEffects, gray background issue, complex and unpredictable
- OLD ExcalidrawWrapper.tsx (diagrams-backup): 5 useEffects, works perfectly
- **Decision**: Revert to OLD working code, then add improvements incrementally

---

## What to Preserve from NEW Implementation

### 1. DiagramLibrarySidebar Component
**Location**: `client/src/components/diagrams/components/DiagramLibrarySidebar.tsx`
**Features**:
- Library tab: Browse and open saved diagrams
- Search tab: Search elements on canvas (Ctrl+F)
- Toggle open/closed state
- Handle methods: `openSearchTab()`, `openLibraryTab()`

**Integration Points**:
- State: `isSidebarOpen`, `setIsSidebarOpen`
- Ref: `sidebarRef` with type `DiagramLibrarySidebarHandle`
- Toggle handler: `handleToggleSidebar`
- Search shortcut: Ctrl+F opens sidebar search tab

### 2. Company-Aware Collaboration
**Location**: Various hooks and utilities in NEW DiagramEditor
**Features**:
- Permission check before joining collaboration: `checkCollaborationPermission(companyId)`
- Company switching lock during collaboration: `setCompanySelectionLock()`
- Force all collaborators to same company as originator
- Authorization flow: `authorizeIncomingDiagram`, `onAuthorizationDenied`, `onAuthorizationGranted`

**Key Functions**:
```typescript
const checkCollaborationPermission = useCallback((companyId: string) => {
  // Check if user has access to company
  return accessibleCompanyIds.has(companyId) ? 'granted' : 'denied'
}, [accessibleCompanyIds])

const authorizeIncomingDiagram = useCallback(async (companyId: string) => {
  const permission = checkCollaborationPermission(companyId)
  if (permission === 'denied') {
    // Switch to that company if accessible, else show error
  }
  return { permission }
}, [checkCollaborationPermission])
```

**useEffect**: Lock company switching during collaboration
```typescript
useEffect(() => {
  const lockId = 'diagram-editor-collaboration-lock'
  if (isCollaborating) {
    setCompanySelectionLock(lockId, 'Stop collaboration before switching companies')
  } else {
    setCompanySelectionLock(lockId, null)
  }
  return () => setCompanySelectionLock(lockId, null)
}, [isCollaborating, setCompanySelectionLock])
```

### 3. Architecture Element Abstractions
**Location**: `client/src/components/diagrams/utils/architectureElements.ts`
**Purpose**: Utilities for drawing and updating architecture elements
**Note**: Check if this exists and what it provides

### 4. Library Utilities
**Location**: `client/src/components/diagrams/utils/library.ts`
**Purpose**: Diagram library management utilities

---

## Step-by-Step Restoration Plan

### Phase 1: Setup and Backup ✓
- [x] Document current NEW features to preserve
- [x] Create this restoration plan

### Phase 2: Restore Working Base
**Goal**: Get back to stable, working editor with 5 useEffects

1. **Backup Current Work**
   - Ensure all NEW code is safely in git
   - Create branch checkpoint if needed

2. **Copy OLD to NEW Location**
   - Copy `diagrams-backup/components/ExcalidrawWrapper.tsx` content
   - Paste into `diagrams/components/DiagramEditor.tsx`
   - Update component name from `ExcalidrawWrapper` to `DiagramEditor`
   - Update exports to match expected interface

3. **Fix Imports and Types**
   - Ensure all imports resolve correctly
   - Match prop interface with what DiagramsPage expects
   - Fix any TypeScript errors

4. **Test Basic Functionality**
   - Verify dark mode works (no gray background)
   - Verify theme switching works
   - Verify opening diagrams works
   - Verify saving diagrams works
   - Verify collaboration works (basic)

### Phase 3: Add DiagramLibrarySidebar (Improvement #1)
**Goal**: Add sidebar with library and search functionality

1. **Integrate Sidebar Component**
   - Import `DiagramLibrarySidebar` component
   - Add state: `const [isSidebarOpen, setIsSidebarOpen] = useState(true)`
   - Add ref: `const sidebarRef = useRef<DiagramLibrarySidebarHandle | null>(null)`
   - Add toggle handler: `handleToggleSidebar`

2. **Add to JSX Layout**
   - Wrap Excalidraw in flex container
   - Add sidebar component next to Excalidraw
   - Pass props: `isOpen`, `onToggle`, `onSelectDiagram`, etc.

3. **Add Keyboard Shortcut**
   - Add useEffect for Ctrl+F → open search tab
   - Call `sidebarRef.current?.openSearchTab()`

4. **Test Sidebar**
   - Verify library tab shows diagrams
   - Verify search tab works
   - Verify Ctrl+F opens search
   - Verify sidebar toggles open/closed

### Phase 4: Add Company-Aware Collaboration (Improvement #2)
**Goal**: Add permission checks and company locking

1. **Add Company Context**
   - Import company context hook
   - Get `accessibleCompanyIds`, `setCompanySelectionLock`
   - Get current diagram's company info

2. **Add Permission Check Function**
   - Implement `checkCollaborationPermission(companyId)`
   - Returns 'granted' or 'denied'

3. **Add Authorization Flow**
   - Implement `authorizeIncomingDiagram(companyId)`
   - Handle company switching when joining
   - Handle authorization denied/granted callbacks

4. **Add Company Lock useEffect**
   - Lock company switching during collaboration
   - Unlock when collaboration stops

5. **Integrate with Collaboration Hook**
   - Pass authorization functions to `useExcalidrawCollaboration`
   - Update collaboration start to check permissions

6. **Test Collaboration**
   - Start collaboration with company A
   - Verify company switching is locked
   - Join from another user → verify auto-switch to company A
   - Join from user without access → verify denial
   - Stop collaboration → verify company lock removed

### Phase 5: Add Element Abstractions (Improvement #3)
**Goal**: Integrate architecture element utilities if they exist

1. **Verify Utilities Exist**
   - Check `utils/architectureElements.ts`
   - Check what functions it provides

2. **Integrate if Useful**
   - Import utilities
   - Use in element creation/update flows
   - Document usage patterns

3. **Test Element Operations**
   - Create elements using abstractions
   - Update elements using abstractions
   - Verify consistency

### Phase 6: Final Integration and Testing
**Goal**: Ensure all features work together

1. **Comprehensive Testing**
   - Dark mode: No gray backgrounds ✓
   - Light mode: Works correctly ✓
   - Theme switching: Smooth transitions ✓
   - Sidebar: Library and search work ✓
   - Collaboration: Permission checks work ✓
   - Collaboration: Company lock works ✓
   - Element operations: Abstractions work ✓

2. **Performance Check**
   - Count final useEffects (should be ~6-7)
   - Verify no memory leaks
   - Verify no race conditions

3. **Code Cleanup**
   - Remove any unused imports
   - Remove any dead code
   - Add comments where needed

4. **Documentation**
   - Update component documentation
   - Document new features
   - Update architecture docs

---

## Expected Outcome

### Before (NEW Implementation)
- ❌ 10+ useEffects
- ❌ Gray background in dark mode
- ❌ Unpredictable behavior
- ✅ Sidebar with library/search
- ✅ Company-aware collaboration
- ✅ Element abstractions

### After (Restored + Improvements)
- ✅ ~6-7 useEffects (minimal, predictable)
- ✅ Dark mode works correctly
- ✅ Stable, predictable behavior
- ✅ Sidebar with library/search
- ✅ Company-aware collaboration
- ✅ Element abstractions

---

## Implementation Order

1. ✅ Document and plan (this file)
2. ⏭️ Phase 2: Restore working base (copy OLD to NEW)
3. ⏭️ Phase 3: Add sidebar
4. ⏭️ Phase 4: Add company-aware collaboration
5. ⏭️ Phase 5: Add element abstractions (if applicable)
6. ⏭️ Phase 6: Final testing and cleanup

---

## Risk Mitigation

- **Risk**: Losing working NEW features
  - **Mitigation**: All NEW code is in git, can be referenced anytime

- **Risk**: Breaking existing functionality
  - **Mitigation**: Test each phase individually before moving to next

- **Risk**: Introducing new bugs
  - **Mitigation**: Start with known-working code, add features incrementally

- **Risk**: Time/effort spent on circular debugging
  - **Mitigation**: Clear phase boundaries, stop if phase doesn't work
