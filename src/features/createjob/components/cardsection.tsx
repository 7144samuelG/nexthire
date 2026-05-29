export function CardSection({
    icon,
    title,
    subtitle,
    children,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-3">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-base">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-4">{children}</div>
      </div>
    );
  }
  