type CardProps = {
  title: string;
  height?: "normal" | "tall";
  span?: "normal" | "wide";
};

export async function Card({
  title,
  height = "normal",
  span = "normal",
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl p-4
        ${height === "tall" ? "row-span-2" : ""}
        ${span === "wide" ? "col-span-2" : ""}
      `}
    >
      <h3 className="text-sm font-medium text-gray-800 mb-2">
        {title}
      </h3>

      <div className="text-sm text-gray-500">
        Contenido de la card
      </div>
    </div>
  );
}
