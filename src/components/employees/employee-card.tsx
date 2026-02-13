import Image from "next/image";
import { Calendar, Hash, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type EmployeeCardProps = {
  name: string;
  role: string;
  avatar: string;
  empCode: string;
  joiningDate: string;
  tags: string[];
};

export function EmployeeCard({
  name,
  role,
  avatar,
  empCode,
  joiningDate,
  tags,
}: EmployeeCardProps) {
  return (
    <div className="group flex min-w-0 flex-col rounded-xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-indigo-100 sm:rounded-2xl sm:p-5 sm:hover:-translate-y-1">
      {/* Header with Avatar and Info */}
      <div className="mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm sm:h-14 sm:w-14">
          <Image
            src={avatar}
            alt={name}
            fill
            sizes="(max-width: 640px) 48px, 56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">{name}</h3>
          <div className="mt-0.5 flex items-center text-xs text-gray-500">
            <Briefcase size={12} className="mr-1.5 shrink-0 text-indigo-500" />
            <span className="truncate">{role}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5 sm:mb-6 sm:gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="soft" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Details Footer */}
      <div className="mt-auto space-y-2 pt-3 text-xs sm:space-y-3 sm:pt-4 sm:text-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center text-gray-500">
            <Hash size={14} className="mr-1.5 shrink-0 text-indigo-400 sm:mr-2 sm:h-[15px] sm:w-[15px]" />
            <span>ID</span>
          </div>
          <span className="truncate font-medium text-gray-900 font-mono bg-gray-50 px-1.5 py-0.5 rounded sm:px-2">{empCode}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center text-gray-500">
            <Calendar size={14} className="mr-1.5 shrink-0 text-indigo-400 sm:mr-2 sm:h-[15px] sm:w-[15px]" />
            <span>Joined</span>
          </div>
          <span className="truncate font-medium text-gray-900">{joiningDate}</span>
        </div>
      </div>
    </div>
  );
}
