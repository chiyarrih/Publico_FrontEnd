// ============================================================================
// SECURE FILE UPLOAD COMPONENT
// ============================================================================
// Comprehensive file upload component with validation, security checks,
// progress tracking, and accessibility features.
// ============================================================================

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { validateFile, validateFileContent, sanitizeInput } from '../utils/security';
import { useAriaLiveRegion } from '../hooks/useAccessibility';
import { createErrorHandler } from '../utils/errorHandling';
import { useCleanup } from '../hooks/usePerformance';

/**
 * File upload configuration
 */
export interface FileUploadConfig {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
  maxFiles?: number;
  multiple?: boolean;
  accept?: string;
  validateContent?: boolean;
  showPreview?: boolean;
  showProgress?: boolean;
  autoUpload?: boolean;
}

/**
 * File upload status
 */
export enum FileUploadStatus {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  ERROR = 'error',
  VALIDATING = 'validating'
}

/**
 * Uploaded file interface
 */
export interface UploadedFile {
  id: string;
  file: File;
  status: FileUploadStatus;
  progress: number;
  error?: string;
  preview?: string;
  url?: string;
}

/**
 * File upload props
 */
export interface FileUploadProps {
  config: FileUploadConfig;
  onUpload: (files: File[]) => Promise<any>;
  onSuccess?: (result: any, files: UploadedFile[]) => void;
  onError?: (error: Error, files: UploadedFile[]) => void;
  onProgress?: (progress: number, files: UploadedFile[]) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  placeholder?: string;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: FileUploadConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
  maxFiles: 5,
  multiple: false,
  validateContent: true,
  showPreview: true,
  showProgress: true,
  autoUpload: false
};

/**
 * Secure file upload component
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  config,
  onUpload,
  onSuccess,
  onError,
  onProgress,
  className = '',
  disabled = false,
  label = 'Upload Files',
  description = 'Select files to upload',
  placeholder = 'Choose files or drag and drop'
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const { announce } = useAriaLiveRegion();
  const handleError = createErrorHandler();
  const { addEventListener, cleanupAll } = useCleanup();
  
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  /**
   * Validate file before adding to list
   */
  const validateFileBeforeAdd = useCallback((file: File): { valid: boolean; error?: string } => {
    // Basic file validation
    const basicValidation = validateFile(file, {
      maxSize: finalConfig.maxSize,
      allowedTypes: finalConfig.allowedTypes,
      allowedExtensions: finalConfig.allowedExtensions
    });

    if (!basicValidation.valid) {
      return basicValidation;
    }

    // Check file count limit
    if (files.length >= (finalConfig.maxFiles || 10)) {
      return { valid: false, error: `Maximum ${finalConfig.maxFiles || 10} files allowed` };
    }

    // Check for duplicate files
    const isDuplicate = files.some(f => 
      f.file.name === file.name && 
      f.file.size === file.size && 
      f.file.lastModified === file.lastModified
    );

    if (isDuplicate) {
      return { valid: false, error: 'File already selected' };
    }

    return { valid: true };
  }, [files, finalConfig]);

  /**
   * Add file to upload list
   */
  const addFile = useCallback(async (file: File) => {
    const validation = validateFileBeforeAdd(file);
    
    if (!validation.valid) {
      handleError(new Error(validation.error));
      return;
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const uploadedFile: UploadedFile = {
      id: fileId,
      file,
      status: FileUploadStatus.IDLE,
      progress: 0
    };

    // Generate preview for images
    if (finalConfig.showPreview && file.type.startsWith('image/')) {
      try {
        const preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        uploadedFile.preview = preview;
      } catch (error) {
        console.warn('Failed to generate preview:', error);
      }
    }

    setFiles(prev => [...prev, uploadedFile]);
    announce(`File ${file.name} added to upload list`);
  }, [validateFileBeforeAdd, handleError, finalConfig, announce]);

  /**
   * Remove file from upload list
   */
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file) {
        announce(`File ${file.file.name} removed from upload list`);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, [announce]);

  /**
   * Validate file content
   */
  const validateFileContentInternal = useCallback(async (file: File): Promise<boolean> => {
    if (!finalConfig.validateContent) return true;

    try {
      const validation = await validateFileContent(file);
      return validation.valid;
    } catch (error) {
      console.error('Content validation error:', error);
      return false;
    }
  }, [finalConfig.validateContent]);

  /**
   * Upload files
   */
  const uploadFiles = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setOverallProgress(0);

    try {
      // Validate all files
      const validationPromises = files.map(async (uploadedFile) => {
        const isValid = await validateFileContentInternal(uploadedFile.file);
        if (!isValid) {
          throw new Error(`Invalid content in file: ${uploadedFile.file.name}`);
        }
        return uploadedFile;
      });

      const validFiles = await Promise.all(validationPromises);

      // Update status to uploading
      setFiles(prev => prev.map(f => ({ ...f, status: FileUploadStatus.UPLOADING })));

      // Simulate progress (in real implementation, this would come from the upload service)
      const progressInterval = setInterval(() => {
        setOverallProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Upload files
      const result = await onUpload(validFiles.map(f => f.file));

      // Update status to success
      setFiles(prev => prev.map(f => ({ ...f, status: FileUploadStatus.SUCCESS, progress: 100 })));

      onSuccess?.(result, validFiles);
      announce('Files uploaded successfully');
    } catch (error) {
      // Update status to error
      setFiles(prev => prev.map(f => ({ 
        ...f, 
        status: FileUploadStatus.ERROR, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      })));

      handleError(error);
      onError?.(error as Error, files);
      announce('File upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [files, validateFileContent, onUpload, onSuccess, onError, handleError, announce]);

  /**
   * Handle file input change
   */
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    selectedFiles.forEach(file => {
      addFile(file);
    });

    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [addFile]);

  /**
   * Handle drag and drop
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(file => {
      addFile(file);
    });
  }, [addFile]);

  /**
   * Handle click on drop zone
   */
  const handleDropZoneClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  /**
   * Setup event listeners
   */
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    addEventListener(dropZone, 'dragover', handleDragOver as unknown as EventListener);
    addEventListener(dropZone, 'dragleave', handleDragLeave as unknown as EventListener);
    addEventListener(dropZone, 'drop', handleDrop as unknown as EventListener);

    return () => {
      cleanupAll();
    };
  }, [handleDragOver, handleDragLeave, handleDrop, addEventListener, cleanupAll]);

  /**
   * Auto-upload when files are added
   */
  useEffect(() => {
    if (finalConfig.autoUpload && files.length > 0 && !isUploading) {
      uploadFiles();
    }
  }, [finalConfig.autoUpload, files.length, isUploading, uploadFiles]);

  return (
    <div className={`file-upload ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 mb-4">
          {description}
        </p>
      )}

      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onClick={handleDropZoneClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        role="button"
        tabIndex={0}
        aria-label="File upload area"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleDropZoneClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={finalConfig.multiple}
          accept={finalConfig.accept}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
          aria-describedby="file-upload-description"
        />

        <div className="space-y-2">
          <div className="text-4xl text-gray-400">
            📁
          </div>
          <p className="text-sm text-gray-600">
            {placeholder}
          </p>
          <p className="text-xs text-gray-500">
            Max file size: {Math.round((finalConfig.maxSize || 10 * 1024 * 1024) / (1024 * 1024))}MB
          </p>
          {finalConfig.allowedTypes && (
            <p className="text-xs text-gray-500">
              Allowed types: {finalConfig.allowedTypes.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Selected Files ({files.length})
          </h4>
          
          {files.map((uploadedFile) => (
            <FileItem
              key={uploadedFile.id}
              file={uploadedFile}
              onRemove={() => removeFile(uploadedFile.id)}
              showPreview={finalConfig.showPreview || false}
              showProgress={finalConfig.showProgress || false}
            />
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && !finalConfig.autoUpload && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={uploadFiles}
            disabled={disabled || isUploading}
            className={`
              px-4 py-2 rounded-md font-medium transition-colors
              ${disabled || isUploading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }
            `}
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      )}

      {/* Overall Progress */}
      {isUploading && finalConfig.showProgress && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Overall Progress</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Individual file item component
 */
interface FileItemProps {
  file: UploadedFile;
  onRemove: () => void;
  showPreview: boolean;
  showProgress: boolean;
}

const FileItem: React.FC<FileItemProps> = ({
  file,
  onRemove,
  showPreview,
  showProgress
}) => {
  const getStatusIcon = () => {
    switch (file.status) {
      case FileUploadStatus.UPLOADING:
        return '⏳';
      case FileUploadStatus.SUCCESS:
        return '✅';
      case FileUploadStatus.ERROR:
        return '❌';
      default:
        return '📄';
    }
  };

  const getStatusColor = () => {
    switch (file.status) {
      case FileUploadStatus.UPLOADING:
        return 'text-blue-600';
      case FileUploadStatus.SUCCESS:
        return 'text-green-600';
      case FileUploadStatus.ERROR:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
      {/* Preview */}
      {showPreview && file.preview && (
        <div className="flex-shrink-0">
          <img
            src={file.preview}
            alt={file.file.name}
            className="w-12 h-12 object-cover rounded"
          />
        </div>
      )}

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.file.name}
          </p>
          <span className={`text-xs ${getStatusColor()}`}>
            {file.status}
          </span>
        </div>
        
        <p className="text-xs text-gray-500">
          {(file.file.size / (1024 * 1024)).toFixed(2)} MB
        </p>

        {/* Error Message */}
        {file.error && (
          <p className="text-xs text-red-600 mt-1">
            {file.error}
          </p>
        )}

        {/* Progress Bar */}
        {showProgress && file.status === FileUploadStatus.UPLOADING && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
        aria-label={`Remove ${file.file.name}`}
      >
        <span className="text-lg">×</span>
      </button>
    </div>
  );
};
