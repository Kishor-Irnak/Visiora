import React from "react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { KPI } from "../../types";

export const KPICard: React.FC<KPI> = ({ label, value, change, trend }) => {
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  // Badge styling for dark mode: slightly transparent backgrounds
  const badgeVariant =
    trend === "up" ? "success" : trend === "down" ? "destructive" : "secondary";

  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-2 sm:p-4 flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground tracking-wide">
            {label}
          </p>
          {change !== undefined && (
            <Badge
              variant={badgeVariant as any}
              className="shrink-0 flex items-center gap-1 font-medium px-2.5 py-0.5"
            >
              <TrendIcon className="h-3.5 w-3.5" />
              {Math.abs(change)}%
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {value}
          </h3>
          <div className="flex items-center text-xs text-muted-foreground font-medium">
            {trend === "up" ? (
              <span className="flex items-center gap-1.5">
                <span className="text-green-600 dark:text-green-400">
                  Trending up
                </span>
                <span>this month</span>
              </span>
            ) : trend === "down" ? (
              <span className="flex items-center gap-1.5">
                <span className="text-red-600 dark:text-red-400">Down</span>
                <span>from last period</span>
              </span>
            ) : (
              "No significant change"
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
