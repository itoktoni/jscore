# Safe Area Implementation

This project implements a simplified safe area support for mobile devices with a fixed 3rem top padding on mobile platforms.

## How it works

1. The implementation detects mobile platforms (iOS/Android) using Capacitor
2. On mobile devices, it applies a fixed 3rem top padding using CSS variables
3. On web browsers, it uses 0px padding as fallback
4. CSS classes are provided to easily apply safe area padding to elements

## Files

- `src/utils/safeArea.js` - Utility class for handling safe area detection
- `src/assets/css/safe-area.css` - CSS classes for applying safe area padding/margins
- `src/composables/useSafeArea.js` - Composable for using safe area in Vue components
- `src/main.js` - Initializes the safe area utility only on mobile platforms

## CSS Variables

The implementation exposes the following CSS variables:

- `--safe-area-top` - Top safe area inset (3rem on mobile, 0px on web)
- `--safe-area-right` - Right safe area inset (0px)
- `--safe-area-bottom` - Bottom safe area inset (0px)
- `--safe-area-left` - Left safe area inset (0px)

## CSS Classes

The implementation provides the following utility classes:

- `.safe-area-header` - Header padding with safe area support
- `.safe-area-content` - Content padding with safe area support
- `.safe-area-drawer` - Drawer padding with safe area support

## Usage in Components

### Using CSS Classes

Simply add the appropriate CSS class to your elements:

```html
<header class="safe-area-header">
  <!-- Header content -->
</header>

<main class="safe-area-content">
  <!-- Main content -->
</main>
```

### Using the Composable

In Vue components, you can use the composable to detect mobile platforms:

```javascript
import { useSafeArea } from '@/composables/useSafeArea'

export default {
  setup() {
    const { isMobilePlatform } = useSafeArea()

    return {
      isMobilePlatform
    }
  }
}
```

Then use it in your template:

```html
<div v-if="isMobilePlatform()">
  <!-- Content only shown on mobile platforms -->
</div>
```

## Mobile Optimization

The implementation includes mobile-specific optimizations:

1. Fixed 3rem top padding on mobile devices
2. Responsive padding adjustments for mobile screens
3. Platform-specific initialization
4. CSS media queries to apply mobile styles only on smaller screens

## Fallback Support

For web browsers, the implementation provides fallback values of 0px for all insets.