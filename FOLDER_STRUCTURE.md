# DSA Visualizer - Organized Folder Structure

This document outlines the reorganized folder structure for better readability and maintainability.

## New Folder Structure

### `/src/pages/` - Organized by Data Structure

```
src/pages/
├── DSAModulesPage.jsx              # Main modules overview page
├── array/
│   ├── ArrayInfoPage.jsx           # Array introduction and theory
│   └── ArrayVisualizerPage.jsx     # Interactive array visualizer
├── linkedlist/
│   ├── LinkedListInfoPage.jsx      # Linked List introduction and theory
│   └── LinkedListVisualizerPage.jsx # Interactive linked list visualizer
├── stack/
│   └── StackInfoPage.jsx           # Stack introduction and theory
├── queue/
│   └── QueueInfoPage.jsx           # Queue introduction and theory
├── tree/
│   └── TreeInfoPage.jsx            # Tree introduction and theory
├── graph/
│   └── GraphInfoPage.jsx           # Graph introduction and theory
├── hashtable/
│   └── HashTableInfoPage.jsx       # Hash Table introduction and theory
├── heap/
│   └── HeapInfoPage.jsx            # Heap introduction and theory
├── trie/
│   └── TrieInfoPage.jsx            # Trie introduction and theory
├── sorting/
│   └── SortingInfoPage.jsx         # Sorting algorithms introduction
└── searching/
    └── SearchingInfoPage.jsx       # Searching algorithms introduction
```

### `/src/components/` - Organized by Data Structure

```
src/components/
├── 3d/                             # 3D background components
│   ├── SpaceBackground.jsx
│   ├── AsteroidField.jsx
│   └── FloatingParticles.jsx
├── ui/                             # Reusable UI components
│   ├── DSAModulesGrid.jsx
│   ├── NavigationHeader.jsx
│   ├── FeatureShowcase.jsx
│   ├── FooterSection.jsx
│   └── HeroSection.jsx
├── array/                          # Array-specific components
│   ├── ArrayIntroduction.jsx
│   ├── ArrayOperations.jsx
│   └── ArrayVisualization.jsx
├── linkedlist/                     # Linked List-specific components
│   └── LinkedListVisualization.jsx
├── stack/                          # Stack-specific components (to be created)
├── queue/                          # Queue-specific components (to be created)
├── tree/                           # Tree-specific components (to be created)
├── graph/                          # Graph-specific components (to be created)
├── hashtable/                      # Hash Table-specific components (to be created)
├── heap/                           # Heap-specific components (to be created)
├── trie/                           # Trie-specific components (to be created)
├── sorting/                        # Sorting-specific components (to be created)
├── searching/                      # Searching-specific components (to be created)
├── CodeDisplay.jsx                 # Shared code display component
├── CosmicDustOverlay.jsx          # Shared visual effect
├── LandingPage.jsx                # Main landing page
├── MemoryVisualization.jsx        # Shared memory visualization
└── PageTransition.jsx             # Shared page transition effect
```

## Benefits of This Organization

### 1. **Better Readability**

- Each data structure has its own dedicated folder
- Related files are grouped together
- Clear separation between pages and components

### 2. **Improved Maintainability**

- Easy to locate files related to a specific data structure
- Consistent folder naming convention
- Logical hierarchy that matches the application structure

### 3. **Scalability**

- Easy to add new visualizers or components for each data structure
- Space for future additions like:
  - `StackVisualizerPage.jsx`
  - `QueueVisualizerPage.jsx`
  - `TreeVisualizerPage.jsx`
  - And corresponding components

### 4. **Development Efficiency**

- Developers can quickly find what they need
- Reduces confusion about file locations
- Makes onboarding new team members easier

## Updated Import Paths

All import paths have been automatically updated to reflect the new structure:

- **Before**: `import ArrayInfoPage from './pages/ArrayInfoPage';`
- **After**: `import ArrayInfoPage from './pages/array/ArrayInfoPage';`

- **Before**: `import SpaceBackground from '../components/3d/SpaceBackground';`
- **After**: `import SpaceBackground from '../../components/3d/SpaceBackground';`

## Future Structure Suggestions

As the project grows, consider adding these folders:

```
src/pages/
├── [datastructure]/
│   ├── [DataStructure]InfoPage.jsx
│   ├── [DataStructure]VisualizerPage.jsx
│   └── [DataStructure]Tutorial.jsx        # Step-by-step tutorials

src/components/
├── [datastructure]/
│   ├── [DataStructure]Visualization.jsx
│   ├── [DataStructure]Controls.jsx
│   ├── [DataStructure]CodeDisplay.jsx
│   └── [DataStructure]MemoryView.jsx
```

This organization makes the codebase much more maintainable and easier to navigate!
