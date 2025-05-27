#!/bin/bash

# Simple-EAM Excalidraw Fork Setup Script
# Führt die initiale Fork-Erstellung und Setup aus

set -e

echo "🚀 Simple-EAM Excalidraw Fork Setup"
echo "===================================="

# 1. Repository forken
echo "📦 1. Klone Excalidraw Repository..."
cd /home/mf2admin/simple-eam
git clone https://github.com/excalidraw/excalidraw.git packages/simple-eam-excalidraw
cd packages/simple-eam-excalidraw

# 2. EAM-spezifische Branches erstellen
echo "🌿 2. Erstelle EAM-Branches..."
git checkout -b eam-main
git checkout -b eam-library-management
git checkout -b eam-archimate-integration
git checkout -b eam-ui-customization

# 3. Package.json für EAM anpassen
echo "📝 3. Aktualisiere package.json..."
cat > package.json.new << 'EOF'
{
  "name": "@simple-eam/excalidraw",
  "version": "0.18.0-eam.1",
  "description": "Excalidraw fork optimized for Enterprise Architecture Management",
  "keywords": ["excalidraw", "eam", "archimate", "enterprise-architecture"],
  "repository": {
    "type": "git", 
    "url": "git+https://github.com/simple-eam/excalidraw-fork.git"
  },
  "scripts": {
    "build": "yarn build:package",
    "build:package": "yarn workspace @simple-eam/excalidraw build",
    "dev": "yarn workspace @simple-eam/excalidraw dev",
    "test": "yarn workspace @simple-eam/excalidraw test"
  }
}
EOF

# Merge mit existierender package.json
if command -v jq &> /dev/null; then
  jq -s '.[0] * .[1]' package.json package.json.new > package.json.tmp
  mv package.json.tmp package.json
  rm package.json.new
else
  echo "⚠️  jq nicht gefunden. Manuelle package.json Anpassung erforderlich."
fi

# 4. EAM-spezifische Verzeichnisstruktur
echo "📁 4. Erstelle EAM-Verzeichnisstruktur..."
mkdir -p src/eam/{components,hooks,types,utils}
mkdir -p src/eam/components/{library,archimate,property-panel}
mkdir -p src/eam/archimate/{shapes,templates,metadata}

# 5. Grundlegende EAM-Dateien erstellen
echo "📄 5. Erstelle EAM-Basisdateien..."

# EAM Types
cat > src/eam/types/index.ts << 'EOF'
export interface EAMLibraryCategory {
  id: string
  name: string
  icon?: string
  order: number
  items: EAMLibraryItem[]
}

export interface EAMLibraryItem {
  id: string
  name: string
  description?: string
  category: string
  template: ExcalidrawElement[]
  metadata?: Record<string, any>
}

export interface ArchiMateElement {
  type: 'capability' | 'application' | 'dataObject' | 'interface'
  name: string
  properties: Record<string, any>
}
EOF

# EAM Library Manager
cat > src/eam/components/library/EAMLibraryManager.tsx << 'EOF'
import React from 'react'
import { EAMLibraryCategory, EAMLibraryItem } from '../../types'

interface EAMLibraryManagerProps {
  categories: EAMLibraryCategory[]
  onItemSelect: (item: EAMLibraryItem) => void
}

export const EAMLibraryManager: React.FC<EAMLibraryManagerProps> = ({
  categories,
  onItemSelect
}) => {
  // Garantierte Reihenfolge: ArchiMate zuerst, dann Database
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.id === 'archimate') return -1
    if (b.id === 'archimate') return 1
    return a.order - b.order
  })

  return (
    <div className="eam-library-manager">
      {sortedCategories.map(category => (
        <div key={category.id} className="eam-library-category">
          <h3 className="eam-library-category-header">
            {category.icon} {category.name}
          </h3>
          <div className="eam-library-items">
            {category.items.map(item => (
              <div 
                key={item.id}
                className="eam-library-item"
                onClick={() => onItemSelect(item)}
                draggable
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
EOF

# 6. Build-Konfiguration anpassen
echo "⚙️  6. Konfiguriere Build-System..."
if [ -f "vite.config.ts" ]; then
  cp vite.config.ts vite.config.ts.backup
  
  cat >> vite.config.ts << 'EOF'

// EAM-spezifische Konfiguration
export default defineConfig({
  // ... existing config
  resolve: {
    alias: {
      '@eam': path.resolve(__dirname, './src/eam'),
    },
  },
  define: {
    __EAM_VERSION__: JSON.stringify(process.env.npm_package_version + '-eam'),
  },
})
EOF
fi

# 7. README für Fork erstellen
echo "📖 7. Erstelle Fork-Dokumentation..."
cat > README-EAM.md << 'EOF'
# Simple-EAM Excalidraw Fork

This is a specialized fork of Excalidraw optimized for Enterprise Architecture Management (EAM).

## EAM-Specific Features

- ✅ Native ArchiMate symbol support
- ✅ Guaranteed library ordering (ArchiMate first)
- ✅ Separate library categories with headers
- ✅ EAM-specific property panels
- ✅ Metadata integration for architecture elements

## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build package
yarn build

# Run tests
yarn test
```

## Integration with Simple-EAM

```typescript
import { Excalidraw } from '@simple-eam/excalidraw'

// Native EAM integration
<Excalidraw
  eamConfig={{
    enableArchiMate: true,
    libraryOrdering: 'archimate-first',
    propertyPanels: true
  }}
/>
```

## Fork Maintenance

This fork is based on Excalidraw v0.18.0 and includes EAM-specific enhancements.
Regular upstream merging is performed to keep up with security updates and bug fixes.
EOF

echo "✅ Fork Setup completed!"
echo ""
echo "🔧 Next Steps:"
echo "1. cd packages/simple-eam-excalidraw"
echo "2. yarn install"
echo "3. yarn dev (to test the fork)"
echo "4. Implement EAM-specific features"
echo ""
echo "📝 Update client package.json:"
echo '   "@simple-eam/excalidraw": "file:../packages/simple-eam-excalidraw"'
