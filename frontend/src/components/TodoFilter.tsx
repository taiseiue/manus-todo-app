export type FilterType = "all" | "active" | "completed";

interface TodoFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export default function TodoFilter({ filter, onFilterChange, counts }: TodoFilterProps) {
  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "active", label: "未完了" },
    { key: "completed", label: "完了済み" },
  ];

  return (
    <div className="flex items-center gap-2 mb-6">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            filter === f.key
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {f.label}
          <span
            className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
              filter === f.key ? "bg-indigo-500 text-indigo-100" : "bg-gray-200 text-gray-500"
            }`}
          >
            {counts[f.key]}
          </span>
        </button>
      ))}
    </div>
  );
}
