type PageActionsProps = {
  children: React.ReactNode;
};

export function PageActions({ children }: PageActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {children}
    </div>
  );
}
