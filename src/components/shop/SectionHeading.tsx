import { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
}

export const SectionHeading = ({ eyebrow, title, description, align = "left", action }: Props) => (
  <div
    className={`flex flex-col gap-4 ${
      align === "center" ? "mx-auto max-w-2xl items-center text-center" : "items-start"
    } sm:flex-row sm:items-end sm:justify-between`}
  >
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold leading-tight text-balance md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">{description}</p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
