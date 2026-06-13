interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cuisine' | 'dietary' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const styles: Record<string, string> = {
    cuisine: 'bg-saffron/30 text-maroon border-saffron/50 font-semibold',
    dietary: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    default: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
