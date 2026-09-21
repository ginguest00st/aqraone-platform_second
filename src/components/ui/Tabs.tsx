interface Tab {
  id?: string;
  key?: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function Tabs({ tabs, active, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex border-b border-[#E5E5E5] ${className}`}>
      {tabs.map((tab) => {
        const tabId = tab.id || tab.key || "";
        return (
          <button
            key={tabId}
            onClick={() => onChange(tabId)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              active === tabId
                ? "border-[#D4AF37] text-[#D4AF37]"
                : "border-transparent text-[#6B6B6B] hover:text-[#202020]"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${active === tabId ? "bg-[#FFF5D6] text-[#D4AF37]" : "bg-[#E5E5E5] text-[#6B6B6B]"}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
