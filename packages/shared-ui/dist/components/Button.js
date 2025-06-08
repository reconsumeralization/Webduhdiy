"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonVariants = exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const class_variance_authority_1 = require("class-variance-authority");
const clsx_1 = require("clsx");
const buttonVariants = (0, class_variance_authority_1.cva)(
// Base styles
'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95', {
    variants: {
        variant: {
            default: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:from-primary-700 hover:to-primary-800 hover:shadow-xl',
            destructive: 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:from-red-700 hover:to-red-800',
            outline: 'border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800',
            secondary: 'bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-900 hover:from-neutral-200 hover:to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 dark:text-neutral-100 dark:hover:from-neutral-700 dark:hover:to-neutral-600',
            ghost: 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
            link: 'text-primary-600 underline-offset-4 hover:underline dark:text-primary-400',
            gradient: 'bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:from-primary-600 hover:via-purple-600 hover:to-pink-600',
            success: 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:from-green-700 hover:to-green-800',
            warning: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg hover:from-amber-700 hover:to-amber-800',
        },
        size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            xl: 'h-12 rounded-lg px-10 text-base',
            icon: 'h-10 w-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
exports.buttonVariants = buttonVariants;
const Button = react_1.default.forwardRef(({ className, variant, size, asChild = false, loading = false, icon, iconPosition = 'left', children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;
    const buttonContent = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [loading && ((0, jsx_runtime_1.jsxs)("svg", { className: "mr-2 h-4 w-4 animate-spin", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })), !loading && icon && iconPosition === 'left' && ((0, jsx_runtime_1.jsx)("span", { className: "mr-2", children: icon })), children, !loading && icon && iconPosition === 'right' && ((0, jsx_runtime_1.jsx)("span", { className: "ml-2", children: icon }))] }));
    return ((0, jsx_runtime_1.jsx)("button", { className: (0, clsx_1.clsx)(buttonVariants({ variant, size, className })), ref: ref, disabled: isDisabled, ...props, children: buttonContent }));
});
exports.Button = Button;
Button.displayName = 'Button';
