"use client";

import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useCallback } from "react";

interface CurrencyInputProps {
  name: string;
  control: Control<any>;
  label: string;
  currency?: string;
  suffix?: string;
  placeholder?: string;
}

export function CurrencyInput({
  name,
  control,
  label,
  currency = "USD",
  suffix = "M",
  placeholder = "0.0",
}: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);

  const formatDisplay = useCallback(
    (val: number | null | undefined) => {
      if (val === null || val === undefined || val === 0) return "";
      const prefix = currency === "USD" ? "$" : "";
      return `${prefix}${val.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${suffix}`;
    },
    [currency, suffix]
  );

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
              className="h-8 text-sm font-mono tabular-nums pr-8"
              placeholder={placeholder}
              value={
                focused
                  ? field.value ?? ""
                  : formatDisplay(field.value)
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
            {!focused && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                {suffix}
              </span>
            )}
          </div>
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
