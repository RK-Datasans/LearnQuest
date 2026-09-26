interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export default function LoadingSpinner({
  message = 'Analyzing academic profile...',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 ${className}`}>
      <div className="relative w-10 h-10">
        <div className="w-10 h-10 border-3 border-indigo-100 rounded-full" />
        <div className="absolute top-0 left-0 w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-slate-600 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
}
