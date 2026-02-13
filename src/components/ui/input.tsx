import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border bg-background px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary/40",
        className
      )}
    />
  );
}
