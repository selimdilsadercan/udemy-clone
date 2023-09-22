import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "default" | "success";
  size?: "default" | "sm";
  value: number;
}

const colorOptions = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeOptions = {
  default: "text-sm",
  sm: "text-xs",
};

const CourseProgress = ({ variant, size, value }: Props) => {
  return (
    <div>
      <Progress className="h-2" value={value} variant={variant} />

      <p
        className={cn(
          "font-medium text-sky-700 mt-2",
          colorOptions[variant || "default"],
          sizeOptions[size || "default"]
        )}
      >
        {Math.round(value)}% Completed
      </p>
    </div>
  );
};

export default CourseProgress;
