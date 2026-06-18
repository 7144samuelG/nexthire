import { AlertTriangleIcon } from "lucide-react";

interface ErrorViewProps {
    message?: string;
  }
  
  export const ErrorView = ({ message }: ErrorViewProps) => {
    return (
      <div className="flex items-center justify-center h-full gap-y-4 ">
        <AlertTriangleIcon className="size-6  text-muted-foreground" />
  
        {!!message && <p className="text-sm text-primary">{message}</p>}
      </div>
    );
  };