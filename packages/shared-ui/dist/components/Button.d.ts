import React from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const buttonVariants: (
  props?: {
    variant?:
      | 'link'
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'gradient'
      | 'success'
      | 'warning';
    size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  } & import('class-variance-authority/dist/types').ClassProp,
) => string;
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}
declare const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
>;
export { Button, buttonVariants };
