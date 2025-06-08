'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface DragAndDropOptions {
  onDrop?: (files: FileList) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  accept?: string[];
  multiple?: boolean;
  maxSize?: number; // in bytes
}

export function useDragAndDrop(options: DragAndDropOptions = {}) {
  const {
    onDrop,
    onDragOver,
    onDragLeave,
    accept = [],
    multiple = true,
    maxSize = 10 * 1024 * 1024, // 10MB default
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [dragCount, setDragCount] = useState(0);
  const dropZoneRef = useRef<HTMLElement>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file type
      if (accept.length > 0) {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        const isValidType = accept.some((acceptedType) => {
          if (acceptedType.startsWith('.')) {
            return fileName.endsWith(acceptedType);
          }
          if (acceptedType.includes('/*')) {
            const mimeBase = acceptedType.split('/')[0];
            return fileType.startsWith(mimeBase);
          }
          return fileType === acceptedType;
        });

        if (!isValidType) {
          (window as any).showToast?.({
            type: 'error',
            title: 'Invalid file type',
            message: `File type ${fileType} is not allowed`,
          });
          return false;
        }
      }

      // Check file size
      if (file.size > maxSize) {
        (window as any).showToast?.({
          type: 'error',
          title: 'File too large',
          message: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
        });
        return false;
      }

      return true;
    },
    [accept, maxSize],
  );

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setDragCount((prev) => prev + 1);
      if (!isDragging) {
        setIsDragging(true);
      }
    },
    [isDragging],
  );

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDragOver?.(e);
    },
    [onDragOver],
  );

  const handleDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setDragCount((prev) => {
        const newCount = prev - 1;
        if (newCount === 0) {
          setIsDragging(false);
        }
        return newCount;
      });

      onDragLeave?.(e);
    },
    [onDragLeave],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(false);
      setDragCount(0);

      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) return;

      // Filter files based on validation
      const validFiles = Array.from(files).filter(validateFile);

      if (validFiles.length === 0) return;

      // Check multiple files restriction
      if (!multiple && validFiles.length > 1) {
        (window as any).showToast?.({
          type: 'error',
          title: 'Multiple files not allowed',
          message: 'Please select only one file',
        });
        return;
      }

      // Create FileList-like object from valid files
      const fileList = {
        ...validFiles,
        length: validFiles.length,
        item: (index: number) => validFiles[index] || null,
      } as FileList;

      onDrop?.(fileList);
    },
    [onDrop, validateFile, multiple],
  );

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragenter', handleDragEnter);
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, [handleDragEnter, handleDragOver, handleDragLeave, handleDrop]);

  const getRootProps = useCallback(
    () => ({
      ref: dropZoneRef,
      style: {
        outline: 'none',
      },
    }),
    [],
  );

  const getInputProps = useCallback(
    () => ({
      type: 'file' as const,
      multiple,
      accept: accept.join(','),
      style: { display: 'none' },
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          onDrop?.(files);
        }
      },
    }),
    [accept, multiple, onDrop],
  );

  return {
    isDragging,
    getRootProps,
    getInputProps,
    dropZoneRef,
  };
}

// Specialized hook for file uploads
export function useFileDropZone(options: {
  onFiles: (files: File[]) => void;
  accept?: string[];
  maxFiles?: number;
  maxSize?: number;
}) {
  const { onFiles, accept, maxFiles = 10, maxSize } = options;

  return useDragAndDrop({
    onDrop: (fileList) => {
      const files = Array.from(fileList);
      if (files.length > maxFiles) {
        (window as any).showToast?.({
          type: 'error',
          title: 'Too many files',
          message: `Maximum ${maxFiles} files allowed`,
        });
        return;
      }
      onFiles(files);
    },
    accept,
    multiple: maxFiles > 1,
    maxSize,
  });
}
