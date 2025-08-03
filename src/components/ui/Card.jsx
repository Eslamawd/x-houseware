import React from "react";
import { cn } from "../../lib/utils";

const Card = ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
);
const ForwardedCard = React.forwardRef(Card);

const CardHeader = ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
);
const ForwardedCardHeader = React.forwardRef(CardHeader);

const CardTitle = ({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);
const ForwardedCardTitle = React.forwardRef(CardTitle);

const CardDescription = ({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);
const ForwardedCardDescription = React.forwardRef(CardDescription);

const CardContent = ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  />
);
const ForwardedCardContent = React.forwardRef(CardContent);

const CardFooter = ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
);
const ForwardedCardFooter = React.forwardRef(CardFooter);


export {
  ForwardedCard as Card,
  ForwardedCardHeader as CardHeader,
  ForwardedCardTitle as CardTitle,
  ForwardedCardDescription as CardDescription,
  ForwardedCardContent as CardContent,
  ForwardedCardFooter as CardFooter
};
// export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
// export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };



