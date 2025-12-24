import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    icon,
    className,
    disabled,
    ...props
}) => {
    const variants = {
        primary: 'bg-action-primary text-white hover:bg-action-primary-hover shadow-glow shadow-action-primary/20',
        secondary: 'bg-ui-bg-hover text-ui-text-muted hover:text-ui-text hover:bg-gray-200 dark:hover:bg-gray-700',
        danger: 'bg-action-danger-subtle text-action-danger hover:bg-action-danger hover:text-white',
        ghost: 'bg-transparent text-ui-text-muted hover:text-ui-text hover:bg-ui-bg-hover'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg font-bold'
    };

    return (
        <button
            className={twMerge(
                'flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 select-none cursor-pointer',
                'hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled}
            {...props}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </button>
    );
};
