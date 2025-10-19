// ============================================================================
// RUNTIME TYPE VALIDATION & DATA INTEGRITY CHECKS
// ============================================================================
// Comprehensive runtime type validation, data integrity checks,
// and schema validation utilities for API responses and user inputs.
// ============================================================================

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: any;
}

/**
 * Type validation error
 */
export class TypeValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public expectedType: string,
    public actualType: string,
    public value: any
  ) {
    super(message);
    this.name = 'TypeValidationError';
  }
}

/**
 * Schema validation error
 */
export class SchemaValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public rule: string,
    public value: any
  ) {
    super(message);
    this.name = 'SchemaValidationError';
  }
}

/**
 * Type definitions for validation
 */
export type ValidationType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'null'
  | 'undefined'
  | 'function'
  | 'date'
  | 'email'
  | 'url'
  | 'uuid'
  | 'phone'
  | 'currency'
  | 'json';

/**
 * Validation rule interface
 */
export interface ValidationRule {
  type: ValidationType;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: any[];
  custom?: (value: any) => boolean;
  message?: string;
}

/**
 * Schema definition interface
 */
export interface SchemaDefinition {
  [key: string]: Partial<ValidationRule> | SchemaDefinition | Partial<ValidationRule>[];
}

/**
 * Get runtime type of a value
 */
export function getRuntimeType(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  if (value instanceof RegExp) return 'regexp';
  if (value instanceof Function) return 'function';
  if (value instanceof Error) return 'error';
  if (value instanceof Promise) return 'promise';
  if (value instanceof Map) return 'map';
  if (value instanceof Set) return 'set';
  if (value instanceof WeakMap) return 'weakmap';
  if (value instanceof WeakSet) return 'weakset';
  if (value instanceof ArrayBuffer) return 'arraybuffer';
  if (value instanceof DataView) return 'dataview';
  if (value instanceof Int8Array) return 'int8array';
  if (value instanceof Uint8Array) return 'uint8array';
  if (value instanceof Uint8ClampedArray) return 'uint8clampedarray';
  if (value instanceof Int16Array) return 'int16array';
  if (value instanceof Uint16Array) return 'uint16array';
  if (value instanceof Int32Array) return 'int32array';
  if (value instanceof Uint32Array) return 'uint32array';
  if (value instanceof Float32Array) return 'float32array';
  if (value instanceof Float64Array) return 'float64array';
  if (value instanceof BigInt64Array) return 'bigint64array';
  if (value instanceof BigUint64Array) return 'biguint64array';
  if (value instanceof Symbol) return 'symbol';
  if (value instanceof BigInt) return 'bigint';
  if (value instanceof URL) return 'url';
  if (value instanceof URLSearchParams) return 'urlsearchparams';
  if (value instanceof FormData) return 'formdata';
  if (value instanceof Blob) return 'blob';
  if (value instanceof File) return 'file';
  if (value instanceof FileList) return 'filelist';
  if (value instanceof MediaStream) return 'mediastream';
  if (value instanceof MediaStreamTrack) return 'mediastreamtrack';
  if (value instanceof RTCPeerConnection) return 'rtcpeerconnection';
  if (value instanceof RTCDataChannel) return 'rtcdatachannel';
  if (value instanceof RTCRtpTransceiver) return 'rtcrtptransceiver';
  if (value instanceof RTCRtpSender) return 'rtcrtpsender';
  if (value instanceof RTCRtpReceiver) return 'rtcrtpreceiver';
  // WebRTC types removed due to browser compatibility issues
  
  return typeof value;
}

/**
 * Validate value against a type
 */
export function validateType(
  value: any,
  expectedType: ValidationType,
  field: string = 'value'
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const actualType = getRuntimeType(value);

  // Check if value is required
  if (value === null || value === undefined) {
    if (expectedType === 'null' || expectedType === 'undefined') {
      return { isValid: true, errors, warnings, data: value };
    }
    errors.push(`${field} is required`);
    return { isValid: false, errors, warnings };
  }

  // Type-specific validation
  switch (expectedType) {
    case 'string':
      if (actualType !== 'string') {
        errors.push(`${field} must be a string, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'number':
      if (actualType !== 'number') {
        errors.push(`${field} must be a number, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      if (isNaN(value)) {
        errors.push(`${field} must be a valid number`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'boolean':
      if (actualType !== 'boolean') {
        errors.push(`${field} must be a boolean, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'array':
      if (actualType !== 'array') {
        errors.push(`${field} must be an array, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'object':
      if (actualType !== 'object') {
        errors.push(`${field} must be an object, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'null':
      if (actualType !== 'null') {
        errors.push(`${field} must be null, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'undefined':
      if (actualType !== 'undefined') {
        errors.push(`${field} must be undefined, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'function':
      if (actualType !== 'function') {
        errors.push(`${field} must be a function, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'date':
      if (actualType !== 'date') {
        errors.push(`${field} must be a date, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      if (isNaN(value.getTime())) {
        errors.push(`${field} must be a valid date`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'email':
      if (actualType !== 'string') {
        errors.push(`${field} must be a string, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push(`${field} must be a valid email address`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'url':
      if (actualType !== 'string') {
        errors.push(`${field} must be a string, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      try {
        new URL(value);
      } catch {
        errors.push(`${field} must be a valid URL`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'uuid':
      if (actualType !== 'string') {
        errors.push(`${field} must be a string, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(value)) {
        errors.push(`${field} must be a valid UUID`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'phone':
      if (actualType !== 'string') {
        errors.push(`${field} must be a string, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        errors.push(`${field} must be a valid phone number`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'currency':
      if (actualType !== 'string' && actualType !== 'number') {
        errors.push(`${field} must be a string or number, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      const currencyRegex = /^\$?[0-9]+(\.[0-9]{2})?$/;
      if (!currencyRegex.test(value.toString())) {
        errors.push(`${field} must be a valid currency amount`);
        return { isValid: false, errors, warnings };
      }
      break;

    case 'json':
      if (actualType !== 'string') {
        errors.push(`${field} must be a string, got ${actualType}`);
        return { isValid: false, errors, warnings };
      }
      try {
        JSON.parse(value);
      } catch {
        errors.push(`${field} must be valid JSON`);
        return { isValid: false, errors, warnings };
      }
      break;

    default:
      errors.push(`Unknown validation type: ${expectedType}`);
      return { isValid: false, errors, warnings };
  }

  return { isValid: true, errors, warnings, data: value };
}

/**
 * Validate value against a rule
 */
export function validateRule(
  value: any,
  rule: ValidationRule,
  field: string = 'value'
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if required
  if (rule.required && (value === null || value === undefined)) {
    errors.push(`${field} is required`);
    return { isValid: false, errors, warnings };
  }

  // Skip validation if value is null/undefined and not required
  if (!rule.required && (value === null || value === undefined)) {
    return { isValid: true, errors, warnings, data: value };
  }

  // Type validation
  const typeResult = validateType(value, rule.type, field);
  if (!typeResult.isValid) {
    return typeResult;
  }

  // Additional validations based on type
  switch (rule.type) {
    case 'string':
      if (rule.min && value.length < rule.min) {
        errors.push(`${field} must be at least ${rule.min} characters long`);
      }
      if (rule.max && value.length > rule.max) {
        errors.push(`${field} must be no more than ${rule.max} characters long`);
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${field} does not match required pattern`);
      }
      break;

    case 'number':
      if (rule.min && value < rule.min) {
        errors.push(`${field} must be at least ${rule.min}`);
      }
      if (rule.max && value > rule.max) {
        errors.push(`${field} must be no more than ${rule.max}`);
      }
      break;

    case 'array':
      if (rule.min && value.length < rule.min) {
        errors.push(`${field} must have at least ${rule.min} items`);
      }
      if (rule.max && value.length > rule.max) {
        errors.push(`${field} must have no more than ${rule.max} items`);
      }
      break;

    case 'object':
      if (rule.min && Object.keys(value).length < rule.min) {
        errors.push(`${field} must have at least ${rule.min} properties`);
      }
      if (rule.max && Object.keys(value).length > rule.max) {
        errors.push(`${field} must have no more than ${rule.max} properties`);
      }
      break;
  }

  // Enum validation
  if (rule.enum && !rule.enum.includes(value)) {
    errors.push(`${field} must be one of: ${rule.enum.join(', ')}`);
  }

  // Custom validation
  if (rule.custom && !rule.custom(value)) {
    errors.push(rule.message || `${field} failed custom validation`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: value
  };
}

/**
 * Validate object against schema
 */
export function validateSchema(
  data: any,
  schema: SchemaDefinition,
  field: string = 'data'
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data is an object
  if (typeof data !== 'object' || data === null) {
    errors.push(`${field} must be an object`);
    return { isValid: false, errors, warnings };
  }

  // Validate each field in the schema
  for (const [key, rule] of Object.entries(schema)) {
    const value = data[key];
    const fieldName = `${field}.${key}`;

    if (Array.isArray(rule)) {
      // Array of rules - validate against all
      for (const r of rule) {
        const result = validateRule(value, r as ValidationRule, fieldName);
        if (!result.isValid) {
          errors.push(...result.errors);
        }
        warnings.push(...result.warnings);
      }
    } else if (typeof rule === 'object' && 'type' in rule) {
      // Single validation rule
      const result = validateRule(value, rule as ValidationRule, fieldName);
      if (!result.isValid) {
        errors.push(...result.errors);
      }
      warnings.push(...result.warnings);
    } else if (typeof rule === 'object') {
      // Nested schema
      if (value !== null && value !== undefined) {
        const result = validateSchema(value, rule as SchemaDefinition, fieldName);
        if (!result.isValid) {
          errors.push(...result.errors);
        }
        warnings.push(...result.warnings);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data
  };
}

/**
 * Validate API response
 */
export function validateApiResponse<T>(
  response: any,
  schema: SchemaDefinition,
  expectedType?: string
): T {
  // Check if response exists
  if (response === null || response === undefined) {
    throw new TypeValidationError(
      'API response is null or undefined',
      'response',
      expectedType || 'object',
      getRuntimeType(response),
      response
    );
  }

  // Validate response structure
  const result = validateSchema(response, schema, 'response');
  
  if (!result.isValid) {
    throw new SchemaValidationError(
      `API response validation failed: ${result.errors.join(', ')}`,
      'response',
      'schema',
      response
    );
  }

  // Check for warnings
  if (result.warnings.length > 0) {
    console.warn('API response validation warnings:', result.warnings);
  }

  return result.data as T;
}

/**
 * Validate user input
 */
export function validateUserInput(
  input: any,
  rules: ValidationRule[],
  field: string = 'input'
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const rule of rules) {
    const result = validateRule(input, rule, field);
    if (!result.isValid) {
      errors.push(...result.errors);
    }
    warnings.push(...result.warnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: input
  };
}

/**
 * Sanitize and validate data
 */
export function sanitizeAndValidate<T>(
  data: any,
  schema: SchemaDefinition,
  sanitize: (data: any) => any = (d) => d
): T {
  // Sanitize data first
  const sanitizedData = sanitize(data);
  
  // Validate sanitized data
  const result = validateSchema(sanitizedData, schema);
  
  if (!result.isValid) {
    throw new SchemaValidationError(
      `Data validation failed: ${result.errors.join(', ')}`,
      'data',
      'schema',
      sanitizedData
    );
  }

  return result.data as T;
}

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  // User schema
  user: {
    id: { type: 'string' as ValidationType, required: true },
    email: { type: 'email' as ValidationType, required: true },
    firstName: { type: 'string' as ValidationType, required: true, min: 1, max: 50 },
    lastName: { type: 'string' as ValidationType, required: true, min: 1, max: 50 },
    role: { type: 'string' as ValidationType, required: true, enum: ['citizen', 'agency', 'admin'] },
    createdAt: { type: 'date' as ValidationType, required: true },
    updatedAt: { type: 'date' as ValidationType, required: true }
  },

  // Project schema
  project: {
    id: { type: 'string' as ValidationType, required: true },
    name: { type: 'string' as ValidationType, required: true, min: 1, max: 100 },
    description: { type: 'string' as ValidationType, required: false, max: 500 },
    budget: { type: 'number' as ValidationType, required: true, min: 0 },
    spent: { type: 'number' as ValidationType, required: true, min: 0 },
    status: { type: 'string' as ValidationType, required: true, enum: ['pending', 'approved', 'rejected', 'in_progress', 'completed'] },
    startDate: { type: 'date' as ValidationType, required: true },
    endDate: { type: 'date' as ValidationType, required: true },
    agencyId: { type: 'string' as ValidationType, required: true },
    createdAt: { type: 'date' as ValidationType, required: true },
    updatedAt: { type: 'date' as ValidationType, required: true }
  },

  // Transaction schema
  transaction: {
    id: { type: 'string' as ValidationType, required: true },
    amount: { type: 'number' as ValidationType, required: true, min: 0 },
    type: { type: 'string' as ValidationType, required: true, enum: ['deposit', 'withdrawal', 'transfer'] },
    status: { type: 'string' as ValidationType, required: true, enum: ['pending', 'completed', 'failed'] },
    description: { type: 'string' as ValidationType, required: false, max: 200 },
    timestamp: { type: 'date' as ValidationType, required: true },
    hash: { type: 'string' as ValidationType, required: true }
  },

  // API response schema
  apiResponse: {
    success: { type: 'boolean' as ValidationType, required: true },
    data: { type: 'object' as ValidationType, required: false },
    message: { type: 'string' as ValidationType, required: false },
    error: { type: 'string' as ValidationType, required: false },
    timestamp: { type: 'date' as ValidationType, required: true }
  }
};

/**
 * Type-safe validation wrapper
 */
export function createValidator<T>(schema: SchemaDefinition) {
  return (data: any): T => {
    return validateApiResponse<T>(data, schema);
  };
}

/**
 * Runtime type checking utility
 */
export function isType<T>(value: any, type: ValidationType): value is T {
  const result = validateType(value, type);
  return result.isValid;
}

/**
 * Type guard utilities
 */
export const TypeGuards = {
  isString: (value: any): value is string => isType<string>(value, 'string'),
  isNumber: (value: any): value is number => isType<number>(value, 'number'),
  isBoolean: (value: any): value is boolean => isType<boolean>(value, 'boolean'),
  isArray: (value: any): value is any[] => isType<any[]>(value, 'array'),
  isObject: (value: any): value is object => isType<object>(value, 'object'),
  isDate: (value: any): value is Date => isType<Date>(value, 'date'),
  isEmail: (value: any): value is string => isType<string>(value, 'email'),
  isURL: (value: any): value is string => isType<string>(value, 'url'),
  isUUID: (value: any): value is string => isType<string>(value, 'uuid'),
  isPhone: (value: any): value is string => isType<string>(value, 'phone'),
  isCurrency: (value: any): value is string | number => isType<string | number>(value, 'currency'),
  isJSON: (value: any): value is string => isType<string>(value, 'json')
};
