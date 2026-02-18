import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";

type HeaderProps = {
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | {
      onNew: () => void;
      newButtonHref?: never;
    }
  | {
      newButtonHref: string;
      onNew?: never;
    }
  | {
      onNew?: never;
      newButtonHref?: never;
    }
);

export const Header = ({
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
  onNew,
  newButtonHref,
}: HeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button disabled={disabled || isCreating} size="sm" onClick={onNew}>
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Button>
      )}
      {newButtonHref && !onNew && (
        <Button asChild size="sm">
          <Link href={newButtonHref} prefetch>
            <PlusIcon className="size-4" />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};
type ContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination: React.ReactNode;
};

export const Container = ({
  children,
  header,
  search,
  pagination,
}: ContainerProps) => {
  return (
    <div className="p-4 mdp-10 md:py-6 h-full">
      <div className="mx-automax-w-screen w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
};

interface EntetitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
export const EntitySearch = ({
  value,
  onChange,
  placeholder = "search",
}: EntetitySearchProps) => {
  return (
    <div className="relative ml-auto">
      <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="max-w-200px bg-background shadow-none border-border pl-8"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

interface EntityPagination {
  page: number;
  totalpages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const EntityPagination = ({
  page,
  totalpages,
  onPageChange,
  disabled,
}: EntityPagination) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalpages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button disabled={page === 1 || disabled} variant="outline" onClick={()=>onPageChange(Math.max(1,page-1))} size="sm">
          Previous
        </Button>
        <Button disabled={page === totalpages ||totalpages===0 || disabled} variant="outline" onClick={()=>onPageChange(Math.min(totalpages,page+1))} size="sm">
          Next
        </Button>
      </div>
    </div>
  );
};