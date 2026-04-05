type PrimaryActionButtonProps = {
  variant: "start" | "retry";
  onClick: () => void;
  disabled?: boolean;
};

const copy = {
  start: "スタート！",
  retry: "もう一回！",
} as const;

export function PrimaryActionButton({
  variant,
  onClick,
  disabled,
}: PrimaryActionButtonProps) {
  const label = copy[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-14 w-full max-w-sm items-center justify-center rounded-full bg-orange-500 text-base font-semibold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}
