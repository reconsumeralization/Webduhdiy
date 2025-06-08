import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode, forwardRef } from 'react';
import { classNames } from '~/utils/classNames';

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-xs px-2.5 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps<any>>(
  ({ options, value, onChange, className, size = 'md' }, ref) => {
    const activeOption = options.find((option) => option.value === value);

    return (
      <div
        ref={ref}
        className={classNames(
          'relative flex items-center bg-bolt-elements-background-depth-2 p-1 rounded-lg',
          className,
        )}
      >
        <AnimatePresence>
          {activeOption && (
            <motion.div
              layoutId="segmented-control-active-bg"
              className="absolute inset-0 bg-bolt-elements-background-depth-1 rounded-md shadow-sm"
              style={{
                width: `calc((100% - 0.5rem) / ${options.length})`,
                x: `${options.findIndex((o) => o.value === value) * 100}%`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </AnimatePresence>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => !option.disabled && onChange(option.value)}
            disabled={option.disabled}
            className={classNames(
              'relative z-10 w-full rounded-md transition-colors duration-200',
              sizeClasses[size],
              {
                'text-bolt-elements-textPrimary': value === option.value,
                'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary': value !== option.value,
                'cursor-not-allowed opacity-50': !!option.disabled,
              },
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  },
);

SegmentedControl.displayName = 'SegmentedControl'; 