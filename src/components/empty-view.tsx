"use client"
import { PackageOpenIcon } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Button } from "./ui/button";

interface EmptyViewProps  {
    onNew?: () => void;
    message?: string;
  }
  
  export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
    return (
      <Empty className="border border-dashed bg-white">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageOpenIcon />
          </EmptyMedia>
          <EmptyTitle>No Jobs</EmptyTitle>
          {!!message && <EmptyDescription>{message}</EmptyDescription>}
          {!!onNew && (
            <EmptyContent>
              <Button onClick={onNew}>Add a New</Button>
            </EmptyContent>
          )}
        </EmptyHeader>
      </Empty>
    );
  };