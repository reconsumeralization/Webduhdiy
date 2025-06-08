import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { classNames } from '~/utils/classNames';
import { forwardRef, type ElementRef, type ComponentPropsWithoutRef } from 'react';

type SeparatorProps = ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
  orientation?: 'horizontal' | 'vertical';
};

const Separator = forwardRef<ElementRef<typeof SeparatorPrimitive.Root>, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative, ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={classNames(
        'shrink-0 bg-bolt-elements-borderColor',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
