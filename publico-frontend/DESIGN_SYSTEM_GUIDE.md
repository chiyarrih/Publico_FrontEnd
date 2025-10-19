# 🎨 Publico Design System Guide

## Quick Reference for Developers

### 🎯 Core Philosophy
**Simple, Clean, User-Friendly**
- Modern gradients for depth
- Consistent spacing and borders
- Smooth transitions everywhere
- Accessible color contrasts

---

## 🌈 Color Palette

### Primary Colors
```css
Blue/Indigo Gradient    → Main actions, primary elements
Green/Teal Gradient     → Success, completion
Amber/Orange Gradient   → Warnings, pending
Red/Rose               → Errors, critical
Purple/Pink Gradient    → Special features
```

### Usage Examples
```tsx
// Buttons
<button className="btn-primary">Save</button>
<button className="btn-secondary">Cancel</button>
<button className="btn-danger">Delete</button>

// Status
<span className="pill pill-green">Active</span>
<span className="pill pill-yellow">Pending</span>
<span className="pill pill-red">Failed</span>
```

---

## 🧩 Components

### Cards
```tsx
// Standard card with shadow and hover
<div className="card">
  <div className="p-6">Content</div>
</div>

// Card with title
<Card title="My Card">
  Content here
</Card>
```

### Forms
```tsx
// Input field
<input className="input-field" placeholder="Enter text" />

// Select dropdown
<select className="select-field">
  <option>Option 1</option>
</select>

// Textarea
<textarea className="textarea-field" rows={4} />
```

### Buttons
```tsx
// Primary - Main actions
<button className="btn-primary">
  Submit
</button>

// Secondary - Alternative actions
<button className="btn-secondary">
  Cancel
</button>

// Ghost - Subtle actions
<button className="btn-ghost">
  Learn More
</button>

// Danger - Destructive actions
<button className="btn-danger">
  Delete
</button>
```

### Status Pills
```tsx
<span className="pill pill-green">Verified</span>
<span className="pill pill-blue">In Progress</span>
<span className="pill pill-yellow">Pending</span>
<span className="pill pill-gray">Draft</span>
<span className="pill pill-red">Failed</span>
<span className="pill pill-purple">Premium</span>
<span className="pill pill-indigo">Featured</span>
```

### Alerts
```tsx
// Info
<div className="alert alert-info">
  <svg>...</svg>
  <span>Information message</span>
</div>

// Success
<div className="alert alert-success">
  <svg>...</svg>
  <span>Success message</span>
</div>

// Warning
<div className="alert alert-warning">
  <svg>...</svg>
  <span>Warning message</span>
</div>

// Error
<div className="alert alert-error">
  <svg>...</svg>
  <span>Error message</span>
</div>
```

### Progress Bars
```tsx
// Use the Progress component
<Progress pct={75} />

// Or raw HTML
<div className="progress">
  <div className="progress-bar bg-gradient-to-r from-blue-600 to-indigo-600" 
       style={{ width: '75%' }} />
</div>
```

---

## 📐 Spacing System

### Padding/Margin Scale
```
2  → 0.5rem (8px)   - Tight
3  → 0.75rem (12px) - Compact
4  → 1rem (16px)    - Standard
5  → 1.25rem (20px) - Comfortable
6  → 1.5rem (24px)  - Spacious
8  → 2rem (32px)    - Section gaps
```

### Standard Spacings
```tsx
// Card padding
<div className="p-6">Standard card content</div>

// Section spacing
<div className="space-y-8">Multiple sections</div>

// Element spacing
<div className="space-y-4">Form elements</div>

// Button spacing
<div className="flex gap-3">Buttons</div>
```

---

## 🔤 Typography

### Headings
```tsx
// Page title
<h1 className="page-title">Dashboard</h1>

// Section title
<h2 className="section-title">Projects</h2>

// Page subtitle
<p className="page-subtitle">Real-time transparency</p>
```

### Text Sizes
```tsx
// Extra small
<p className="text-xs">Helper text</p>

// Small
<p className="text-sm">Secondary info</p>

// Base
<p className="text-base">Body text</p>

// Large
<p className="text-lg">Emphasized text</p>

// Extra large
<p className="text-xl">Important text</p>
```

### Font Weights
```tsx
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">Semibold (600)</p>
<p className="font-bold">Bold (700)</p>
```

---

## 🎭 Special Effects

### Gradients
```tsx
// Blue gradient (primary)
<div className="gradient-blue">...</div>

// Green gradient (success)
<div className="gradient-green">...</div>

// Purple gradient (special)
<div className="gradient-purple">...</div>
```

### Glass Effect
```tsx
<div className="glass">
  Frosted glass appearance
</div>
```

### Smooth Transitions
```tsx
<div className="transition-smooth">
  Smooth 300ms transitions
</div>
```

---

## 🎬 Animations

### Built-in Animations
```tsx
// Spin (loading)
<div className="animate-spin">...</div>

// Pulse (notification)
<div className="animate-pulse">...</div>

// Scale on click
<button className="active:scale-95">Click me</button>
```

### Hover Effects
```tsx
// Shadow on hover
<div className="hover:shadow-lg transition-shadow">...</div>

// Background change
<div className="hover:bg-gray-50 transition-colors">...</div>

// Text color change
<a className="hover:text-blue-700 transition-colors">Link</a>
```

---

## 📱 Responsive Design

### Breakpoints
```tsx
// Mobile first approach
<div className="
  w-full          // Mobile: full width
  md:w-1/2        // Tablet: half width
  lg:w-1/3        // Desktop: third width
">
  Responsive element
</div>
```

### Common Patterns
```tsx
// Hide on mobile
<div className="hidden lg:block">Desktop only</div>

// Show on mobile
<div className="lg:hidden">Mobile only</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  Grid items
</div>
```

---

## ♿ Accessibility

### Focus States
```tsx
// All interactive elements automatically get focus rings
<button className="...">
  Accessible button
</button>
```

### ARIA Labels
```tsx
<button aria-label="Close modal">
  <svg>...</svg>
</button>

<div role="main" aria-label="Dashboard">
  Main content
</div>
```

### Keyboard Navigation
- All buttons: `Enter` or `Space`
- Links: `Enter`
- Forms: `Tab` to navigate, `Enter` to submit

---

## 🚦 Do's and Don'ts

### ✅ Do's
- Use design system classes
- Maintain consistent spacing
- Add hover states to interactive elements
- Use semantic HTML
- Include ARIA labels
- Test on mobile devices
- Use gradients for primary actions
- Add loading states

### ❌ Don'ts
- Don't use arbitrary colors
- Don't skip hover states
- Don't forget focus states
- Don't use tiny font sizes (<12px)
- Don't overcomplicate layouts
- Don't forget mobile responsiveness
- Don't mix old and new design patterns

---

## 🎯 Common Patterns

### Dashboard Card
```tsx
<div className="card">
  <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
    <div className="section-title">Title</div>
    <button className="btn-ghost">Action</button>
  </div>
  <div className="p-6">
    Card content here
  </div>
</div>
```

### Form Group
```tsx
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Email
    </label>
    <input 
      type="email" 
      className="input-field"
      placeholder="Enter your email"
    />
  </div>
</div>
```

### Loading State
```tsx
<div className="flex flex-col items-center justify-center h-96">
  <div className="relative">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
  </div>
  <p className="mt-4 text-gray-600 font-medium">Loading...</p>
</div>
```

### Error State
```tsx
<div className="card max-w-md p-8 text-center">
  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
    <svg className="h-8 w-8 text-red-600">...</svg>
  </div>
  <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Title</h3>
  <p className="text-gray-600 mb-6">Error message here</p>
  <button className="btn-primary">Retry</button>
</div>
```

---

## 🔧 Customization

### Extending the Design System

If you need custom variants, add them to `style.css`:

```css
@layer components {
  .my-custom-button {
    @apply btn-primary bg-gradient-to-r from-purple-600 to-pink-600;
  }
}
```

### Custom Colors

Add to tailwind.config.js:

```js
theme: {
  extend: {
    colors: {
      brand: {
        primary: '#yourcolor',
      }
    }
  }
}
```

---

## 📚 Resources

### Design Inspiration
- Tailwind UI
- shadcn/ui
- Radix UI
- Material Design 3

### Tools
- Tailwind CSS IntelliSense (VS Code)
- Figma for mockups
- ColorSpace for gradients

---

## 🎉 Quick Start Checklist

When creating a new component:

- [ ] Use design system classes
- [ ] Add hover states
- [ ] Include focus states
- [ ] Test on mobile
- [ ] Add loading state if needed
- [ ] Include error state if needed
- [ ] Add ARIA labels
- [ ] Use semantic HTML
- [ ] Follow spacing system
- [ ] Test keyboard navigation

---

**Happy Coding! 🚀**

For questions or suggestions, refer to the main `UI_IMPROVEMENTS_SUMMARY.md`

