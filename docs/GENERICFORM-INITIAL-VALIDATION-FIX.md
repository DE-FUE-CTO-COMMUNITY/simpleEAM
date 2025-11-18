# GenericForm Initial Validation Fix

## Problem

In the GenericForm component, no validation was performed during initial load in Create mode. All fields were shown as valid, even though invalid fields (e.g., empty required fields) were present.

## Cause

The default behavior of TanStack Form only shows validation errors for fields that have been touched (`isTouched`) or changed (`isDirty`). In Create mode, all fields are initially untouched, preventing validation errors from being displayed.

## Solution

### 1. Initial Validation in Create Mode

**New useEffect hook** to perform initial validation:

```tsx
React.useEffect(() => {
  if (isOpen && form && isCreateMode) {
    // In Create mode we perform an initial validation
    // We use a small timeout to ensure the form is fully initialized
    const timer = setTimeout(() => {
      try {
        // Validate all fields with the 'change' event type
        form.validateAllFields('change')
      } catch (error) {
        console.warn('Initial validation failed:', error)
      }
    }, 100)

    return () => clearTimeout(timer)
  }
}, [form, isOpen, isCreateMode])
```

### 2. Extended Validation Logic

**New logic for shouldShowError**:

```tsx
// Extended validation logic for better UX in Create mode
// In Create mode we show validation errors for invalid fields immediately,
// even if they haven't been touched yet. In Edit mode we use the standard behavior.
const shouldShowError = isCreateMode
  ? !formField.state.meta.isValid
  : !formField.state.meta.isValid &&
    (formField.state.meta.isTouched || formField.state.meta.isDirty)

// In Create mode we force showing validation errors for required fields
// that don't have a value yet, regardless of touch status
const forceShowErrorInCreateMode =
  isCreateMode &&
  field.required &&
  (formField.state.value === '' ||
    formField.state.value === null ||
    formField.state.value === undefined)

const finalShouldShowError = shouldShowError || forceShowErrorInCreateMode
```

### 3. Improved Helper Text Logic

**Default error message for empty required fields**:

```tsx
const getHelperText = () => {
  if (finalShouldShowError && formField.state.meta.errors.length > 0) {
    // Existing error handling...
    return formField.state.meta.errors.map(/* ... */).join(', ')
  }

  // In Create mode we show a default message for required fields without value
  if (forceShowErrorInCreateMode) {
    return `${field.label} is a required field`
  }

  return field.helperText || ''
}
```

## Modified Files

1. **GenericForm.tsx**:
   - New initial validation logic in Create mode
   - Extended `shouldShowError` logic
   - Improved `getHelperText` function
   - All UI components now use `finalShouldShowError`

## Behavior

### Before

- **Create mode**: All fields are shown as valid, even if empty
- **Edit mode**: Validation errors only after user interaction

### After

- **Create mode**: Required fields are immediately shown as invalid with message "{Fieldname} is a required field"
- **Edit mode**: Unchanged - validation errors only after user interaction

## Test Status

✅ **TypeScript compilation successful**  
✅ **No ESLint errors**  
✅ **All `shouldShowError` correctly replaced by `finalShouldShowError`**

## Benefits

1. **Better UX in Create mode**: Users immediately see which fields need to be filled
2. **Consistent behavior**: Edit mode retains proven behavior
3. **Clear error messages**: Default messages for empty required fields
4. **TanStack Form best practices**: Using official API methods

## References

- [TanStack Form Validation Guide](https://tanstack.com/form/latest/docs/react/guides/validation)
- [TanStack Form Field API](https://tanstack.com/form/latest/docs/framework/react/reference/useField)
