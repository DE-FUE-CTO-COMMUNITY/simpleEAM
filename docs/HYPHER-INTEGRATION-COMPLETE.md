# Hypher-based Text Wrapping Implementation

## Overview

This implementation extends the Simple-EAM system with advanced text wrapping functionality featuring intelligent hyphenation using the Hypher library.

## Key Functions

### 1. `wrapTextToFitWidth` - Intelligent Text Wrapping

- **Purpose**: Wraps text with optimal hyphenation for German and English texts
- **Features**:
  - Automatic language detection (German/English)
  - Pixel-accurate width measurement using Canvas API
  - Intelligent hyphenation with Hypher library
  - Emergency splitting for overlong words
  - Maximum line limit for better formatting

### 2. `calculateOptimalTextDimensions` - Precise Dimension Calculation

- **Purpose**: Calculates optimal text dimensions based on container size
- **Features**:
  - Canvas-based text measurement
  - Hypher-based text wrapping
  - Automatic adjustment to container boundaries
  - Returns width, height, and wrapped text

### 3. `measureTextWidth` - Pixel-accurate Text Measurement

- **Purpose**: Measures exact text width using Canvas API
- **Features**:
  - Font-family and font-size support
  - Pixel-accurate measurement
  - Cached canvas context for performance

## Language Support

### German Hyphenation

- Uses `hyphenation.de` patterns
- Correct handling of umlauts
- Compound words are properly hyphenated

### English Hyphenation

- Uses `hyphenation.en-us` patterns
- Standard English hyphenation rules
- Optimized for technical terms

## Usage

### Basic Integration

```typescript
import { wrapTextToFitWidth, calculateOptimalTextDimensions } from './textContainerUtils'

// Simple text wrapping
const wrappedText = wrapTextToFitWidth('Businessprocessmanagement', 150, 16, 'Arial')

// Complete dimension calculation
const dimensions = calculateOptimalTextDimensions(
  'Longer text with multiple words',
  containerElement,
  16,
  'Arial'
)
```

### Integration with Existing Functions

The following functions have already been updated:

- `calculateTopCenteredTextPosition`
- `calculateCenteredTextPosition`
- `updateTextWithContainerBinding`

## Technical Details

### Dependencies

- `hypher`: Base library for hyphenation
- `hyphenation.de`: German hyphenation patterns
- `hyphenation.en-us`: English hyphenation patterns

### Performance Optimizations

- Cached canvas context for text measurement
- Lazy loading of Hypher instances
- Efficient language detection

### Fallback Mechanisms

- On Hypher errors: Basic word splitting
- On Canvas errors: Approximation using character count
- On language detection errors: English as default

## Language Detection

### Automatic Detection

```typescript
function detectLanguage(text: string): 'de' | 'en' {
  const germanIndicators = ['ä', 'ö', 'ü', 'ß', 'ung', 'keit', 'schaft', 'lich']
  const foundGermanIndicators = germanIndicators.some(indicator =>
    text.toLowerCase().includes(indicator)
  )
  return foundGermanIndicators ? 'de' : 'en'
}
```

### Supported Indicators

- **German**: Umlauts (ä, ö, ü), Eszett (ß), Endings (-ung, -keit, -schaft, -lich)
- **English**: Standard fallback for all other texts

## Configuration

### Customizable Parameters

- `maxWidth`: Maximum text width in pixels
- `fontSize`: Font size for calculations
- `fontFamily`: Font family for measurements
- `maxLines`: Maximum number of lines (default: 2)

### Container Integration

The functions work seamlessly with ExcalidrawElement containers and consider:

- Container dimensions
- Padding and spacing
- Centering and alignment

## Testing

### Automated Tests

The file `textWrapperTest.ts` contains comprehensive tests for:

- German hyphenation
- English hyphenation
- Dimension calculation
- Various container sizes

### Manual Tests

```bash
# Test Hypher library
node test-hypher.js

# Check TypeScript compilation
yarn tsc --noEmit
```

## Compatibility

### Existing Functions

All existing text positioning and binding functions have been updated to use the new Hypher-based logic without causing breaking changes.

### Backward Compatibility

- All existing API signatures remain unchanged
- Existing calls work without modifications
- Improved output with same input

## Error Handling

### Robust Implementation

- Graceful degradation on Hypher errors
- Fallback to manual splitting
- Continuous functionality even with library errors

### Logging and Debugging

- Detailed error handling
- Debugging functions for development
- Performance monitoring integration

## Future Enhancements

### Planned Improvements

- Additional language support (French, Spanish)
- Extended text formatting (bold, italic)
- Optimized performance for large texts
- Intelligent line height adjustment

### Extensibility

The architecture is designed to be easily extended:

- New languages can be added through additional Hypher patterns
- Extended text formatting can be integrated into Canvas measurement
- Additional wrapping strategies can be implemented as plugins
