interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cuisine' | 'dietary' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const styles: Record<string, string> = {
    cuisine: 'bg-saffron/20 text-spice border-saffron/30',
    dietary: 'bg-green-50 text-green-700 border-green-200',
    default: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
