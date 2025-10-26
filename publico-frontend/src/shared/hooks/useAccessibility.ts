// ============================================================================
// ACCESSIBILITY UTILITIES & HOOKS
// ============================================================================
// Comprehensive accessibility features including ARIA labels,
// keyboard navigation, focus management, and screen reader support.
// ============================================================================

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

/**
 * Focus management utilities
 */
export interface FocusOptions {
  trapFocus?: boolean;
  restoreFocus?: boolean;
  initialFocus?: RefObject<HTMLElement>;
  onFocusChange?: (element: HTMLElement | null) => void;
}

/**
 * Hook for focus management
 */
export function useFocusManagement(options: FocusOptions = {}) {
  const {
    trapFocus = false,
    restoreFocus = false,
    initialFocus,
    onFocusChange
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  // Focus first element
  const focusFirst = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [getFocusableElements]);

  // Focus last element
  const focusLast = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [getFocusableElements]);

  // Focus specific element
  const focusElement = useCallback((element: HTMLElement) => {
    element.focus();
    setFocusedElement(element);
    onFocusChange?.(element);
  }, [onFocusChange]);

  // Trap focus within container
  const handleTrapFocus = useCallback((e: KeyboardEvent) => {
    if (!trapFocus || !containerRef.current) return;

    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab (backward)
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (forward)
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [trapFocus, getFocusableElements]);

  // Handle focus events
  const handleFocus = useCallback((e: FocusEvent) => {
    const target = e.target as HTMLElement;
    setFocusedElement(target);
    onFocusChange?.(target);
  }, [onFocusChange]);

  // Setup focus management
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Store previous active element
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    // Add event listeners
    container.addEventListener('keydown', handleTrapFocus as EventListener);
    container.addEventListener('focusin', handleFocus as EventListener);

    // Initial focus
    if (initialFocus?.current) {
      initialFocus.current.focus();
    } else if (trapFocus) {
      focusFirst();
    }

    return () => {
      container.removeEventListener('keydown', handleTrapFocus as EventListener);
      container.removeEventListener('focusin', handleFocus as EventListener);

      // Restore previous focus
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [trapFocus, restoreFocus, initialFocus, focusFirst, handleFocus]);

  return {
    containerRef,
    focusedElement,
    focusFirst,
    focusLast,
    focusElement,
    getFocusableElements
  };
}

/**
 * Hook for keyboard navigation
 */
export function useKeyboardNavigation(
  items: any[],
  options: {
    onSelect?: (item: any, index: number) => void;
    onNavigate?: (index: number) => void;
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical' | 'both';
  } = {}
) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const {
    onSelect,
    onNavigate,
    loop = true,
    orientation = 'both'
  } = options;

  const navigate = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (items.length === 0) return;

    let newIndex = currentIndex;

    switch (direction) {
      case 'up':
      case 'left':
        newIndex = currentIndex > 0 ? currentIndex - 1 : (loop ? items.length - 1 : currentIndex);
        break;
      case 'down':
      case 'right':
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : (loop ? 0 : currentIndex);
        break;
    }

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      onNavigate?.(newIndex);
    }
  }, [currentIndex, items.length, loop, onNavigate]);

  const select = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < items.length) {
      onSelect?.(items[currentIndex], currentIndex);
    }
  }, [currentIndex, items, onSelect]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          navigate('up');
        }
        break;
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          navigate('down');
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          navigate('left');
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          navigate('right');
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        select();
        break;
      case 'Home':
        e.preventDefault();
        setCurrentIndex(0);
        onNavigate?.(0);
        break;
      case 'End':
        e.preventDefault();
        setCurrentIndex(items.length - 1);
        onNavigate?.(items.length - 1);
        break;
    }
  }, [navigate, select, orientation, items.length, onNavigate]);

  return {
    currentIndex,
    setCurrentIndex,
    navigate,
    select,
    handleKeyDown
  };
}

/**
 * Hook for ARIA live regions
 */
export function useAriaLiveRegion() {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message]);
    
    // Clear announcement after a delay
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(msg => msg !== message));
    }, 1000);
  }, []);

  const clearAnnouncements = useCallback(() => {
    setAnnouncements([]);
  }, []);

  return {
    announcements,
    announce,
    clearAnnouncements
  };
}

/**
 * Hook for screen reader support
 */
export function useScreenReader() {
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  useEffect(() => {
    // Detect screen reader usage
    const detectScreenReader = () => {
      // Check for common screen reader indicators
      const hasScreenReader = (
        window.speechSynthesis ||
        'speechSynthesis' in window ||
        navigator.userAgent.includes('NVDA') ||
        navigator.userAgent.includes('JAWS') ||
        navigator.userAgent.includes('VoiceOver') ||
        (typeof window !== 'undefined' && (window as any).matchMedia && (window as any).matchMedia('(prefers-reduced-motion: reduce)').matches)
      );

      setIsScreenReaderActive(!!hasScreenReader);
    };

    detectScreenReader();

    // Listen for changes in reduced motion preference
    const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const handleChange = () => detectScreenReader();
    
    mediaQuery?.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery?.removeEventListener('change', handleChange);
    };
  }, []);

  return {
    isScreenReaderActive
  };
}

/**
 * Hook for high contrast mode detection
 */
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const detectHighContrast = () => {
      // Check for high contrast mode
      const mediaQuery = window.matchMedia('(prefers-contrast: high)');
      setIsHighContrast(mediaQuery.matches);
    };

    detectHighContrast();

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    mediaQuery.addEventListener('change', detectHighContrast);

    return () => {
      mediaQuery.removeEventListener('change', detectHighContrast);
    };
  }, []);

  return {
    isHighContrast
  };
}

/**
 * Hook for reduced motion detection
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const detectReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    };

    detectReducedMotion();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', detectReducedMotion);

    return () => {
      mediaQuery.removeEventListener('change', detectReducedMotion);
    };
  }, []);

  return {
    prefersReducedMotion
  };
}

/**
 * Hook for color scheme detection
 */
export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'no-preference'>('no-preference');

  useEffect(() => {
    const detectColorScheme = () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setColorScheme(mediaQuery.matches ? 'dark' : 'light');
    };

    detectColorScheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectColorScheme);

    return () => {
      mediaQuery.removeEventListener('change', detectColorScheme);
    };
  }, []);

  return {
    colorScheme
  };
}

/**
 * Hook for text size detection
 */
export function useTextSize() {
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large' | 'extra-large'>('medium');

  useEffect(() => {
    const detectTextSize = () => {
      // Check for text size preferences
      const mediaQuery = window.matchMedia('(min-resolution: 2dppx)');
      
      // This is a simplified detection - in practice, you'd want more sophisticated detection
      if (window.devicePixelRatio >= 2) {
        setTextSize('large');
      } else {
        setTextSize('medium');
      }
    };

    detectTextSize();
  }, []);

  return {
    textSize
  };
}

/**
 * Utility function to generate ARIA labels
 */
export function generateAriaLabel(
  element: string,
  context?: string,
  state?: string,
  additional?: string
): string {
  const parts = [element];
  
  if (context) parts.push(context);
  if (state) parts.push(state);
  if (additional) parts.push(additional);
  
  return parts.join(', ');
}

/**
 * Utility function to generate ARIA descriptions
 */
export function generateAriaDescription(
  action: string,
  target?: string,
  result?: string
): string {
  const parts = [action];
  
  if (target) parts.push(target);
  if (result) parts.push(result);
  
  return parts.join(' ');
}

/**
 * Utility function to check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.getAttribute('aria-hidden') !== 'true' &&
    !element.hasAttribute('hidden')
  );
}

/**
 * Utility function to get accessible name
 */
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check aria-labelledby
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent || '';
  }

  // Check for associated label
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent || '';
  }

  // Check for title attribute
  const title = element.getAttribute('title');
  if (title) return title;

  // Check for placeholder
  const placeholder = element.getAttribute('placeholder');
  if (placeholder) return placeholder;

  // Check for alt text (images)
  const alt = element.getAttribute('alt');
  if (alt) return alt;

  // Fallback to text content
  return element.textContent?.trim() || '';
}

/**
 * Utility function to announce to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  // Create or update live region
  let liveRegion = document.getElementById('aria-live-region');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }

  // Update live region
  liveRegion.textContent = message;
  
  // Clear after announcement
  setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = '';
    }
  }, 1000);
}

/**
 * Hook for accessible form validation
 */
export function useAccessibleFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((
    name: string,
    value: any,
    rules: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      custom?: (value: any) => string | null;
    }
  ) => {
    const errorMessages: string[] = [];

    if (rules.required && (!value || value.toString().trim() === '')) {
      errorMessages.push('This field is required');
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      errorMessages.push(`Must be at least ${rules.minLength} characters`);
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      errorMessages.push(`Must be no more than ${rules.maxLength} characters`);
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errorMessages.push('Invalid format');
    }

    if (value && rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        errorMessages.push(customError);
      }
    }

    const error = errorMessages.length > 0 ? errorMessages[0] : '';
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return error === '';
  }, []);

  const touchField = useCallback((name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const getFieldError = useCallback((name: string) => {
    return touched[name] ? errors[name] : '';
  }, [errors, touched]);

  const hasErrors = useCallback(() => {
    return Object.values(errors).some(error => error !== '');
  }, [errors]);

  return {
    errors,
    touched,
    validateField,
    touchField,
    clearErrors,
    getFieldError,
    hasErrors
  };
}
