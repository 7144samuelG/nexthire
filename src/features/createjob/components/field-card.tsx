function Field({
  label,
  required,
  optional,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
        {optional && <span className="text-xs text-gray-400 font-normal ml-0.5">(optional)</span>}
      </label>
      {children}
      {error  && <span className="text-xs text-red-500">{error}</span>}
      {!error && hint && <span className="text-xs text-gray-400">{hint}</span>}
    </div>
  );
}
