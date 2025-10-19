// ============================================================================
// SECURITY UTILITIES
// ============================================================================
// Comprehensive security utilities for input sanitization, validation,
// and XSS prevention across the application.
// ============================================================================

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove all HTML tags
    .replace(/<[^>]*>/g, '')
    // Decode HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    // Remove javascript: and data: protocols
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Trim whitespace
    .trim();
}

/**
 * Validates and sanitizes HTML content for safe display
 */
export function sanitizeHTML(html: string, allowedTags: string[] = []): string {
  if (typeof html !== 'string') {
    return '';
  }

  // If no allowed tags specified, remove all HTML
  if (allowedTags.length === 0) {
    return sanitizeInput(html);
  }

  // Create regex pattern for allowed tags
  const allowedPattern = new RegExp(`<(?!/?(?:${allowedTags.join('|')})\\b)[^>]*>`, 'gi');
  
  return html
    .replace(allowedPattern, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format (international)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates file upload
 */
export function validateFile(file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
} = {}): { valid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    allowedExtensions = []
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
    };
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`
      };
    }
  }

  return { valid: true };
}

/**
 * Validates numeric input with range constraints
 */
export function validateNumber(
  value: string | number,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
    required?: boolean;
  } = {}
): { valid: boolean; error?: string; value?: number } {
  const { min, max, integer = false, required = false } = options;

  if (required && (value === '' || value === null || value === undefined)) {
    return { valid: false, error: 'This field is required' };
  }

  if (value === '' || value === null || value === undefined) {
    return { valid: true };
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: 'Must be a valid number' };
  }

  if (integer && !Number.isInteger(num)) {
    return { valid: false, error: 'Must be a whole number' };
  }

  if (min !== undefined && num < min) {
    return { valid: false, error: `Must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { valid: false, error: `Must be at most ${max}` };
  }

  return { valid: true, value: num };
}

/**
 * Validates date input
 */
export function validateDate(date: string | Date): { valid: boolean; error?: string; value?: Date } {
  if (!date) {
    return { valid: false, error: 'Date is required' };
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }

  // Check if date is in the future (for certain validations)
  const now = new Date();
  if (dateObj > now) {
    return { valid: false, error: 'Date cannot be in the future' };
  }

  return { valid: true, value: dateObj };
}

/**
 * Validates URL format
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Escapes HTML special characters
 */
export function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Generates CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates CSRF token
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken && token.length > 0;
}

/**
 * Sanitizes object properties recursively
 */
export function sanitizeObject(obj: any, allowedKeys: string[] = []): any {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeInput(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, allowedKeys));
  }

  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip if key is not in allowed keys (when specified)
    if (allowedKeys.length > 0 && !allowedKeys.includes(key)) {
      continue;
    }

    // Sanitize the key
    const sanitizedKey = sanitizeInput(key);
    
    // Sanitize the value
    sanitized[sanitizedKey] = sanitizeObject(value, allowedKeys);
  }

  return sanitized;
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    return true;
  }

  getRemainingAttempts(identifier: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxAttempts - validAttempts.length);
  }

  getResetTime(identifier: string): number | null {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length === 0) {
      return null;
    }

    const oldestAttempt = Math.min(...validAttempts);
    return oldestAttempt + this.windowMs;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

/**
 * Content Security Policy validation
 */
export function validateCSP(nonce: string): boolean {
  // Basic nonce validation (should be 16+ characters, alphanumeric)
  const nonceRegex = /^[a-zA-Z0-9]{16,}$/;
  return nonceRegex.test(nonce);
}

/**
 * Secure random string generator
 */
export function generateSecureRandom(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash function for sensitive data
 */
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates file content for malicious patterns
 */
export async function validateFileContent(file: File): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  // Check for suspicious file types
  const suspiciousTypes = [
    'application/x-executable',
    'application/x-msdownload',
    'application/x-msdos-program'
  ];

  if (suspiciousTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed for security reasons' };
  }

  // For text files, check for suspicious content
  if (file.type.startsWith('text/') || file.type === 'application/json') {
    try {
      const content = await file.text();
      
      // Check for script tags
      if (/<script\b/i.test(content)) {
        return { valid: false, error: 'File contains potentially malicious scripts' };
      }
      
      // Check for suspicious patterns
      const suspiciousPatterns = [
        /javascript:/i,
        /data:text\/html/i,
        /eval\s*\(/i,
        /function\s*\(/i
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(content)) {
          return { valid: false, error: 'File contains suspicious content' };
        }
      }
    } catch (error) {
      return { valid: false, error: 'Unable to validate file content' };
    }
  }

  return { valid: true };
}
