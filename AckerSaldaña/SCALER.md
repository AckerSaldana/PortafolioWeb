# Responsive Scaler Documentation

A responsive scaling system that maintains exact proportions across screen sizes while keeping mobile fully responsive.

## Overview

The ResponsiveScaler maintains your portfolio's exact proportions on desktop/tablet screens by scaling the entire application based on viewport size. On mobile devices (< 768px), it automatically disables to use standard responsive design instead.

## How It Works

**Desktop/Tablet (≥ 768px):**
- Calculates scale based on viewport width vs. design width (2400px)
- Scales content horizontally while allowing natural vertical scrolling
- Sets CSS custom property `--viewport-scale` for viewport-relative sizing
- Smoothly animates scale changes with GSAP
- Use `.vh-100-scaled` or `.min-vh-100-scaled` classes for full-height sections

**Mobile (< 768px):**
- Scaling is disabled
- Uses standard responsive Tailwind classes
- Full-width layout with normal scrolling

**Viewport Height Correction:**
When content is scaled, viewport-relative units like `vh` need correction to maintain proper proportions. The scaler automatically:
- Sets `--viewport-scale` CSS variable with the current scale value
- Provides helper classes that calculate: `height: calc(100vh / var(--viewport-scale))`
- Ensures sections maintain their intended viewport height regardless of scale

**Example:**
- **1920px screen (Full HD):** scale = 0.80, content scaled to 80% size (matching lower resolutions)
- **1280px screen (Laptop):** scale = 0.533, content scaled down significantly
- **2560px screen (2K/4K):** scale = 1.0 (clamped by maxScale), content at 100% size - no upscaling
- **Result:** Hero section always fills exactly one screen height, content never scales up beyond design size, and 1920x1080 displays content at the same relative size as lower resolutions

## Files

### Core Files
- `src/utils/scaler.js` - ResponsiveScaler class
- `src/hooks/useResponsiveScaler.js` - React hook
- `src/index.css` - Scaler wrapper styles

### Integration
- `src/App.jsx` - Scaler implementation in HomePage

## Usage

### Basic Implementation

```jsx
import { useResponsiveScaler } from './hooks/useResponsiveScaler';

function MyComponent() {
  const { wrapperRef } = useResponsiveScaler({
    designWidth: 2400, // Ensures 1920x1080 displays at 80% scale
    designHeight: 1080,
    minScale: 0.3,
    maxScale: 1.0, // No upscaling on large screens
    mobileBreakpoint: 768,
    centerContent: true
  });

  return (
    <div ref={wrapperRef} className="scaler-wrapper">
      {/* Your content here */}
    </div>
  );
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `designWidth` | number | 2400 | Base design width in pixels (2400 ensures 1920x1080 scales to 80%) |
| `designHeight` | number | 1080 | Base design height in pixels |
| `minScale` | number | 0.3 | Minimum scale limit |
| `maxScale` | number | **1.0** | **Maximum scale limit (1.0 recommended - no upscaling)** |
| `mobileBreakpoint` | number | 768 | Disable scaling below this width |
| `centerContent` | boolean | true | Center content when extra space |
| `debounceDelay` | number | 150 | Resize debounce delay (ms) |
| `onScale` | function | null | Callback after scaling |
| `enabled` | boolean | true | Enable/disable scaler |

**⚠️ Important:** Set `maxScale: 1.0` to prevent upscaling on large monitors (2K, 4K). Upscaling can make content inaccessible and too large. The scaler should only scale DOWN on small screens, never UP on large screens.

### Advanced Usage

```jsx
const { wrapperRef, scalerRef, refresh, getScale } = useResponsiveScaler({
  designWidth: 1920,
  designHeight: 1080,
  onScale: (scale, offsetX, offsetY) => {
    console.log('New scale:', scale);
    console.log('Offsets:', offsetX, offsetY);
  }
});

// Manually refresh scaling
refresh(true); // with animation
refresh(false); // instant

// Get current scale value
const currentScale = getScale();
```

## Integration with GSAP & Lenis

The scaler automatically integrates with:

### GSAP ScrollTrigger
- Automatically calls `ScrollTrigger.refresh()` after scaling
- All your existing ScrollTrigger animations continue to work
- No code changes needed

### Lenis Smooth Scroll
- Automatically calls `window.lenis.resize()` after scaling
- Maintains smooth scrolling experience
- Works seamlessly with scaled content

## Important Notes

### Initialization Order
The scaler is initialized in the correct order:
1. Scaler calculates and applies scale
2. Lenis smooth scroll initializes
3. ScrollTrigger registers animations

This ensures everything works together properly.

### CSS Considerations

**DO:**
- Use fixed pixel values based on 1920px design width
- Use the `.scaler-wrapper` class on your wrapper element
- Use standard responsive classes for mobile

**DON'T:**
- Don't add `transform` CSS to `.scaler-wrapper` (managed by GSAP)
- Don't change `transform-origin` on wrapper
- Don't add `overflow: hidden` to wrapper (breaks scrolling)

### Mobile Behavior

On screens < 768px:
- Scaling is completely disabled
- Transform is removed
- Width becomes 100%
- All responsive Tailwind classes work normally

## Examples

### Example 1: Basic Setup (Current Implementation)

```jsx
function HomePage() {
  const { wrapperRef } = useResponsiveScaler({
    designWidth: 1920,
    designHeight: 1080,
    minScale: 0.3,
    maxScale: 1.5,
    mobileBreakpoint: 768,
    centerContent: true
  });

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0a' }}>
      <TargetCursor />
      <ScrollProgress />
      <ParticleBackground />

      <div ref={wrapperRef} className="scaler-wrapper">
        <Navbar />
        <HeroGSAP />
        <AboutMeGSAP />
        <SkillsGSAP />
        <TVSectionGSAP />
        <ExperienceGSAP />
        <ContactGSAP />
        <Footer />
      </div>
    </div>
  );
}
```

### Example 2: With Callback

```jsx
const { wrapperRef } = useResponsiveScaler({
  designWidth: 1920,
  designHeight: 1080,
  onScale: (scale, offsetX, offsetY) => {
    // Update analytics
    console.log('Viewport scaled to:', scale);

    // Adjust other elements
    adjustParticleCount(scale);
  }
});
```

### Example 3: Conditional Enabling

```jsx
const isDevelopment = import.meta.env.DEV;

const { wrapperRef } = useResponsiveScaler({
  designWidth: 1920,
  designHeight: 1080,
  enabled: !isDevelopment // Disable in dev mode
});
```

## Troubleshooting

### Issue: Content appears blurry
**Solution:** The scaler uses `backface-visibility: hidden` and `will-change: transform` for performance. This is normal for scaled content.

### Issue: ScrollTrigger animations not working
**Solution:** Make sure ScrollTrigger is initialized AFTER the scaler. The scaler automatically calls `ScrollTrigger.refresh()`.

### Issue: Lenis scroll feels wrong
**Solution:** The scaler automatically calls `window.lenis.resize()`. Make sure Lenis is available on `window.lenis`.

### Issue: Mobile layout broken
**Solution:** Check that your mobile breakpoint (default 768px) matches your responsive design breakpoint. Adjust if needed.

### Issue: Content not centered
**Solution:** Set `centerContent: true` in options. If still not centered, check for conflicting CSS transforms.

## Performance

- **Debounced Resize:** Resize events are debounced (150ms default) to prevent excessive recalculations
- **GSAP Animations:** Scale transitions use GSAP for smooth, performant animations
- **Mobile Skip:** On mobile, scaling is completely skipped for better performance
- **Will-Change:** Uses `will-change: transform` for GPU acceleration

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (scaling disabled)

## API Reference

### ResponsiveScaler Class

#### Methods

**`init()`**
- Initializes the scaler
- Sets up event listeners
- Performs initial scale calculation

**`updateScale(animate = true)`**
- Recalculates and applies scale
- `animate`: Whether to animate the transition

**`removeScale(animate = true)`**
- Removes scaling (used for mobile)
- `animate`: Whether to animate the removal

**`refresh(animate = true)`**
- Manually trigger a scale update
- `animate`: Whether to animate

**`getScale()`**
- Returns current scale value
- Returns: `number`

**`destroy()`**
- Cleanup method
- Removes event listeners
- Resets wrapper styles

### useResponsiveScaler Hook

#### Returns

```typescript
{
  wrapperRef: RefObject,  // Ref to attach to wrapper element
  scalerRef: RefObject,   // Ref to the scaler instance
  refresh: (animate?: boolean) => void,  // Manually refresh
  getScale: () => number  // Get current scale value
}
```

## Best Practices

1. **Single Scaler:** Only use one scaler per page
2. **Wrapper Everything:** Put all scrollable content inside the wrapper
3. **Fixed Background:** Keep fixed backgrounds (particles, cursor) outside wrapper
4. **Mobile First:** Design mobile layouts first, then use scaler for desktop
5. **Test Resizing:** Always test resize behavior during development

## Migration Guide

### From Responsive to Scaled

**Before:**
```jsx
<div className="w-full max-w-screen-xl mx-auto">
  <Hero />
</div>
```

**After:**
```jsx
const { wrapperRef } = useResponsiveScaler();

<div ref={wrapperRef} className="scaler-wrapper">
  <Hero />
</div>
```

Now you can use fixed pixel values in Hero based on 1920px width.

## Future Enhancements

Possible future improvements:
- [ ] Support for multiple scaling strategies (fit-width, fit-height, cover)
- [ ] Per-component scaling overrides
- [ ] Automatic detection of design dimensions from first render
- [ ] Integration with React DevTools
- [ ] Performance monitoring dashboard

## Support

For issues or questions:
1. Check this documentation
2. Review the console for warnings/errors
3. Check browser compatibility
4. Verify GSAP and Lenis are loaded
