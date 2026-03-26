import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { METHODOLOGY_TOOLTIPS } from "@/lib/data/methodology-info";

interface InfoTooltipProps {
  term: string;
}

export function InfoTooltip({ term }: InfoTooltipProps) {
  const info = METHODOLOGY_TOOLTIPS[term];
  if (!info) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground inline-block ml-1 cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="font-medium text-sm">{info.title}</p>
        <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
