interface TagBadgeProps {
  tag: "FAVORITE" | "CHEF'S PICK" | "NEW";
}

const tagStyles: Record<string, string> = {
  FAVORITE: "bg-pink text-white",
  "CHEF'S PICK": "bg-teal text-white",
  NEW: "bg-yellow text-earth-dark",
};

export default function TagBadge({ tag }: TagBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${tagStyles[tag] || "bg-pink text-white"}`}
    >
      {tag}
    </span>
  );
}
