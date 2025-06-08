import { forwardRef } from 'react';
import { IconButton, type IconButtonProps } from '~/components/ui/IconButton';
import { Settings } from 'lucide-react';

export const SettingsButton = forwardRef<HTMLButtonElement, Omit<IconButtonProps, 'icon'>>(({ ...props }, ref) => {
  return (
    <IconButton ref={ref} {...props}>
      <Settings />
    </IconButton>
  );
});
