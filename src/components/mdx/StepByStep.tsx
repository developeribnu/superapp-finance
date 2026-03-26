"use client";

interface Step {
  title: string;
  description: string;
}

interface StepByStepProps {
  steps: Step[];
}

export function StepByStep({ steps }: StepByStepProps) {
  return (
    <div className="my-6">
      <ol className="relative space-y-6">
        {steps.map((step, idx) => (
          <li key={idx} className="flex gap-4">
            {/* Timeline column */}
            <div className="flex flex-col items-center">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {idx + 1}
              </span>
              {idx < steps.length - 1 && (
                <span className="mt-1 w-0.5 grow bg-blue-200" aria-hidden="true" />
              )}
            </div>
            {/* Content */}
            <div className="pb-2">
              <p className="font-semibold text-gray-900">{step.title}</p>
              <p className="mt-1 text-sm text-gray-600">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
