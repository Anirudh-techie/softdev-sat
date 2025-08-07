// Author: Ani
// Date: 7 August 2025
// Description: Generic components used across the application

interface TaskCardProps {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  onClick?: () => void;
}

export const TaskCard = ({
  title,
  description,
  priority,
  onClick,
}: TaskCardProps) => {
  const borderColors = {
    low: "border-emerald-500/30",
    medium: "border-amber-500/30",
    high: "border-red-500/30",
  };

  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-zinc-800/80 to-zinc-900/80 border ${borderColors[priority]} hover:from-zinc-700/80 hover:to-zinc-800/80 transition-all duration-200`}
    >
      <PriorityIndicator priority={priority} onClick={onClick} />
      <div className="flex-1">
        <p className="text-white font-medium">{title}</p>
        {description && (
          <p className="text-zinc-400 text-sm mt-1">{description}</p>
        )}
      </div>
      <div className="text-xs text-zinc-500 capitalize">{priority}</div>
    </div>
  );
};

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const Header = ({ children, className = "" }: HeaderProps) => (
  <div className={`flex items-center gap-3 mb-4 flex-col ${className}`}>
    <h3 className={className + " font-semibold text-white"}>{children}</h3>
    <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-2"></div>
  </div>
);

interface InputFieldProps {
  label?: string;
  type?: "text" | "date" | "select" | "textarea";
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  children?: React.ReactNode;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = "",
  containerClassName = "",
  labelClassName = "",
  children,
  rows = 3,
  ...props
}: InputFieldProps) {
  const baseInputClasses = `
    w-full px-4 py-3 
    border border-zinc-600/50 rounded-xl text-white placeholder-zinc-400 focus:outline-none hover:border-zinc-500/50
    ${
      error
        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
        : ""
    }
    ${className}
  `.trim();

  const baseLabelClasses = `
    block text-sm font-medium text-zinc-200 mb-2
    ${labelClassName}
  `.trim();

  const containerClasses = `
    mb-6
    ${containerClassName}
  `.trim();

  const renderInput = () => {
    if (type === "select") {
      // TODO: make custom select to show priority colors
      return (
        <select
          value={value}
          onChange={onChange}
          className={`${baseInputClasses} cursor-pointer`}
          {...props}
        >
          {children}
        </select>
      );
    }

    if (type === "textarea") {
      return (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`${baseInputClasses} resize-none`}
          {...props}
        />
      );
    }

    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={baseInputClasses}
        {...props}
      />
    );
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label className={baseLabelClasses}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {renderInput()}

      {error && (
        <div className="mt-2 flex items-center gap-2">
          <div className="w-1 h-1 bg-red-400 rounded-full"></div>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

interface PriorityIndicatorProps {
  priority: "low" | "medium" | "high";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export const PriorityIndicator = ({
  priority,
  size = "md",
  onClick,
}: PriorityIndicatorProps) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colorClasses = {
    low: "bg-gradient-to-br from-emerald-500 to-emerald-400",
    medium: "bg-gradient-to-br from-amber-500 to-amber-400",
    high: "bg-gradient-to-br from-red-500 to-red-400",
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-full ${colorClasses[priority]} ${sizeClasses[size]} shadow-lg`}
    />
  );
};
