interface TimelineStep {
  label: string;
  desc?: string;
  date?: string;
  status: "done" | "active" | "pending";
}

interface TimelineProps {
  steps: TimelineStep[];
}

export default function Timeline({ steps }: TimelineProps) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              step.status === "done" ? "bg-[#2E8B57] text-white" :
              step.status === "active" ? "bg-[#D4AF37] text-white" :
              "bg-[#E5E5E5] text-[#6B6B6B]"
            }`}>
              {step.status === "done" ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 flex-1 my-1 ${step.status === "done" ? "bg-[#2E8B57]" : "bg-[#E5E5E5]"}`} style={{minHeight: 24}} />
            )}
          </div>
          <div className="pb-5 pt-1">
            <p className={`text-sm font-semibold ${step.status === "active" ? "text-[#D4AF37]" : step.status === "done" ? "text-[#202020]" : "text-[#6B6B6B]"}`}>{step.label}</p>
            {step.desc && <p className="text-xs text-[#6B6B6B] mt-0.5">{step.desc}</p>}
            {step.date && <p className="text-xs text-[#6B6B6B] mt-0.5">{step.date}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
