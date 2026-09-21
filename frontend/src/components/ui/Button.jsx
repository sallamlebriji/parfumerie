import { forwardRef } from "react";

const sizes = {
  sm: "px-4 py-2 text-[0.8rem]",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-[0.95rem]"
};

const variants = {
  primary: "bg-brand-gold text-brand-night hover:bg-brand-goldsoft",
  dark: "bg-brand-pine text-brand-porcelain hover:bg-brand-moss",
  outline: "border border-brand-ink/25 bg-transparent text-brand-ink hover:border-brand-ink hover:bg-brand-ink hover:text-brand-porcelain",
  light: "border border-white/35 bg-transparent text-white hover:bg-white hover:text-brand-night",
  ghost: "text-brand-ink hover:bg-brand-ink/5",
  whatsapp: "bg-whatsapp text-white hover:brightness-110",
  success: "bg-emerald-700 text-white hover:bg-emerald-800",
  danger: "bg-brand-wine text-white hover:brightness-110"
};

export const Button = forwardRef(({ as: Component = "button", variant = "primary", size = "md", className = "", children, ...props }, ref) => (
  <Component
    ref={ref}
    className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
    {...props}
  >
    {children}
  </Component>
));

Button.displayName = "Button";
