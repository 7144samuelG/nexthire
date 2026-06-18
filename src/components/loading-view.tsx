import { Loader2Icon } from "lucide-react";

interface StateViewProps {
    message?: string;
  }
  

export const LoadingView = ({ message }: StateViewProps) => {
    return (
      <div className="flex items-center justify-center h-full gap-y-4 ">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
  
        {!!message && <p className="text-sm text-primary">{message}</p>}
      </div>
    );
  };