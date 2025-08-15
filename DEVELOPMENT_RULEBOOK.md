# Development Rule Book

## Core Development Principles

This rule book must be followed strictly without any deviation when working on the DSA Visualizer project.

### Rule 1: File Creation Policy
- **NEVER create unnecessary files without explicit permission**
- Always ask before creating new files
- Justify the need for any new file creation
- If uncertain about file necessity, seek clarification first

### Rule 2: Component Reusability
- **ALWAYS use existing reusable components**
- Utilize already defined background and color themes
- Check existing components before creating new ones
- Leverage the established theme system from `src/theme.js` and `src/contexts/ThemeContext.js`
- Reference existing UI components in `src/components/ui/`

### Rule 3: Code Organization
- **DO NOT put all code in one file**
- Create appropriate folder structures for new features
- Organize files logically within folders
- Maintain separation of concerns
- Follow the existing project structure patterns

### Rule 4: Conflict Resolution
- **When conflicts arise, always ask for clarification**
- Present the conflict clearly
- Wait for explicit instructions before proceeding
- Follow the user's decision exactly as specified

### Rule 5: Quality Standards
- **NO quick fixes or temporary solutions**
- NO dummy components created just for demonstration
- Every component must be fully functional and production-ready
- Take time to understand existing patterns before implementing

### Rule 6: Component Consistency
- **MUST reuse existing components, themes, and backgrounds**
- Never create new themes or color schemes without permission
- Follow the exact same design patterns as reference implementations
- Ask questions before writing code if anything is unclear

### Rule 7: Documentation and Logging
- **Maintain detailed logs of all changes made**
- Reference change logs before making new modifications
- Ensure continuity and avoid repeating mistakes
- Document reasoning behind implementation decisions

## Existing Project Structure to Leverage

### Theme System
- Use `src/contexts/ThemeContext.js` for theme management
- Reference `src/theme.js` for color schemes
- Utilize existing CSS classes from `src/styles/globals.css`

### Reusable Components
- Background: `src/components/ThreeDBackground.jsx`, `src/components/3d/SpaceBackground.jsx`
- UI Components: `src/components/ui/` folder
- Layout: `src/components/ui/Layout.jsx`
- Navigation: `src/components/ui/NavigationHeader.jsx`

### Folder Organization Pattern
- Feature-specific folders (e.g., `array/`, `linkedlist/`, `graph/`)
- Component categorization (`ui/`, `3d/`, etc.)
- Logical separation of concerns

## Enforcement
This rule book takes precedence over all other considerations. Any deviation requires explicit user approval.

---
*Created: August 9, 2025*
*Status: ACTIVE - Must be followed strictly*
