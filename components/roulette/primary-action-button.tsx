type PrimaryActionButtonProps = {
  variant: "start" | "retry";
  onClick: () => void;
  disabled?: boolean;
};

const copy = {
  start: { label: "スタート！", icon: "🎰" },
  retry: { label: "もう一回！", icon: "🔄" },
} as const;

export function PrimaryActionButton({
  variant,
  onClick,
  disabled,
}: PrimaryActionButtonProps) {
  const { label, icon } = copy[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-orange-500 text-base font-semibold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span aria-hidden>{icon}</span>
      {label}
    </button>
  );
}
