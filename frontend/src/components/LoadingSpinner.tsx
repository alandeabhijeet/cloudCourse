
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className = "" }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Loader2 className={`animate-spin ${className}`} size={size} />
    </div>
  );
}

export default LoadingSpinner;
