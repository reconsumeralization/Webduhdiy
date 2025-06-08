'use client';

import { useState, useCallback, useMemo } from 'react';

interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

interface FormField<T = any> {
  value: T;
  error: string | null;
  touched: boolean;
  rules?: ValidationRule<T>;
}

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: Partial<Record<string, ValidationRule<any>>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

type FieldsState<T> = { [K in keyof T]: FormField<T[K]> };

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>,
) {
  const { initialValues, validationRules = {}, onSubmit } = options;

  // Build initial fields state with correct typing
  const [fields, setFields] = useState<FieldsState<T>>(() => {
    const initialFields = {} as FieldsState<T>;
    (Object.keys(initialValues) as Array<keyof T>).forEach((key) => {
      const keyStr = String(key);
      (initialFields as any)[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
        rules: validationRules[keyStr],
      };
    });
    return initialFields;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    <K extends keyof T>(fieldName: K, value: T[K]): string | null => {
      const keyStr = String(fieldName);
      const rules = validationRules[keyStr];
      if (!rules) return null;

      if (
        rules.required &&
        (!value || (typeof value === 'string' && value.trim() === ''))
      ) {
        return `${String(fieldName)} is required`;
      }

      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          return `${String(fieldName)} must be at least ${rules.minLength} characters`;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
          return `${String(fieldName)} must be no more than ${rules.maxLength} characters`;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          return `${String(fieldName)} format is invalid`;
        }
      }

      if (rules.custom) {
        return rules.custom(value);
      }

      return null;
    },
    [validationRules],
  );

  const setValue = useCallback(
    <K extends keyof T>(fieldName: K, value: T[K], shouldTouch = true) => {
      setFields((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          value,
          touched: shouldTouch || prev[fieldName].touched,
          error: validateField(fieldName, value),
        },
      }));
    },
    [validateField],
  );

  const setError = useCallback(
    <K extends keyof T>(fieldName: K, error: string | null) => {
      setFields((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          error,
        },
      }));
    },
    [],
  );

  const touchField = useCallback(<K extends keyof T>(fieldName: K) => {
    setFields((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched: true,
      },
    }));
  }, []);

  const reset = useCallback(() => {
    setFields(() => {
      const resetFields = {} as FieldsState<T>;
      (Object.keys(initialValues) as Array<keyof T>).forEach((key) => {
        const keyStr = String(key);
        (resetFields as any)[key] = {
          value: initialValues[key],
          error: null,
          touched: false,
          rules: validationRules[keyStr],
        };
      });
      return resetFields;
    });
    setIsSubmitting(false);
  }, [initialValues, validationRules]);

  const validateAll = useCallback(() => {
    let isValid = true;

    setFields((prev) => {
      const newFields = {} as FieldsState<T>;

      (Object.keys(prev) as Array<keyof T>).forEach((key) => {
        const field = prev[key];
        const error = validateField(key, field.value);

        (newFields as any)[key] = {
          ...field,
          error,
          touched: true,
        };

        if (error) {
          isValid = false;
        }
      });

      return newFields;
    });

    return isValid;
  }, [validateField]);

  const values = useMemo(() => {
    const result = {} as T;
    (Object.keys(fields) as Array<keyof T>).forEach((key) => {
      (result as any)[key] = fields[key].value;
    });
    return result;
  }, [fields]);

  const errors = useMemo(() => {
    const result = {} as { [K in keyof T]: string | null };
    (Object.keys(fields) as Array<keyof T>).forEach((key) => {
      (result as any)[key] = fields[key].error;
    });
    return result;
  }, [fields]);

  const isValid = useMemo(() => {
    return Object.values(errors).every((error) => error === null);
  }, [errors]);

  const isDirty = useMemo(() => {
    return (Object.keys(fields) as Array<keyof T>).some((key) => {
      return fields[key].value !== initialValues[key];
    });
  }, [fields, initialValues]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validateAll()) {
        return;
      }

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [validateAll, onSubmit, values],
  );

  const getFieldProps = useCallback(
    <K extends keyof T>(fieldName: K) => ({
      value: fields[fieldName].value,
      onChange: (value: T[K]) => setValue(fieldName, value),
      onBlur: () => touchField(fieldName),
      error: fields[fieldName].touched ? fields[fieldName].error : null,
      name: String(fieldName),
    }),
    [fields, setValue, touchField],
  );

  return {
    fields,
    values,
    errors,
    isValid,
    isDirty,
    isSubmitting,
    setValue,
    setError,
    touchField,
    reset,
    validateAll,
    handleSubmit,
    getFieldProps,
  };
}
