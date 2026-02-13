import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index !== 0 && (
            <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground/60" />
          )}

          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-blue-500 transition"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-blue-500 font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
