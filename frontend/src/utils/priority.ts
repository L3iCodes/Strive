export const priorityMap = {
  none: { classname: "" },
  low: { classname: "bg-success/30 text-success" },
  medium: { classname: "bg-warning/30 text-warning" },
  high: { classname: "bg-error/30 text-error" },
} as const;

export type PriorityLevel = keyof typeof priorityMap;