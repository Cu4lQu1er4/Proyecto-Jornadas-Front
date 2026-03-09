type CardProps = {
  title: string;
  value?: string | number;
  height?: "normal" | "tall";
  span?: "normal" | "wide";
};

export function Card({
  title,
  value,
  height = "normal",
  span = "normal", 
}: CardProps) {
  return (
    <div
      className={`
        bg-white border border-border rounded-2xl p-6
        flex flex-col gap-2
        ${height === "tall" ? "row-span-2" : ""}
        ${span === "wide" ? "col-span-2" : ""}  
      `}
    >
      <span className="text-sm text-text-muted">
        {title}
      </span>

      <span className="text-2xl font-semibold text-text">
        {value ?? "-"}
      </span>
    </div>
  );
}