"use client";

import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PercentageInputProps {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
}

export function PercentageInput({
  name,
  control,
  label,
  placeholder = "0.0",
}: PercentageInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          <Label htmlFor={name} className="text-xs text-muted-foreground">
            {label}
          </Label>
          <div className="relative">
            <Input
              id={name}
              type={focused ? "number" : "text"}
              step="0.1"
              className="h-8 text-sm font-mono tabular-nums pr-8"
              placeholder={placeholder}
              value={
                focused
                  ? field.value ?? ""
                  : field.value != null
                    ? `${Number(field.value).toFixed(1)}%`
                    : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                field.onChange(val === "" ? null : parseFloat(val));
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false);
                field.onBlur();
              }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
              %
            </span>
          </div>
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
