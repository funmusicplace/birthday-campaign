"use client";

import { useState } from "react";

const defaultAmountsUsdDollars = ["25", "50", "100", "250", "500"];

function FieldRadio({
  checked,
  className,
  label,
  name,
  onChange,
  required,
  value,
}: {
  checked?: boolean;
  className?: string;
  label?: string;
  name: string;
  onChange?: (event: any) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <div className={`relative ${className || ""}`}>
      <input
        checked={checked}
        className="block absolute inset-0 appearance-none h-full z-[-1]"
        id={`input-${name}-${value}`}
        name={name}
        onChange={onChange}
        type="radio"
        required={required}
        value={value}
      />
      <label
        className="block p-2 rounded-md h-full capitalize text-center bg-gray-100 hover:bg-gray-200 border-4 border-white [:checked+&]:border-gray-800 [:checked+&]:font-bold"
        htmlFor={`input-${name}-${value}`}
      >
        {label || value}
      </label>
    </div>
  );
}

export default function Form({ className }: { className?: string }) {
  const [amountUsdDollars, setAmountUsdDollars] = useState("");
  const [customAmountUsdDollars, setCustomAmountUsdDollars] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  return (
    <form
      className={`bg-white p-4 md:p-8 rounded-lg w-full flex flex-col gap-4 ${className || ""}`}
      id="form"
    >
      <h2>Join the party!</h2>
      <p>
        If you're able, please consider annual donations for maximum sustenance.
        You can cancel anytime.
      </p>
      <fieldset>
        <legend className="text-sm font-bold">Select a donation type</legend>
        <div className="mt-1 w-full grid grid-cols-2 gap-2">
          <FieldRadio name="type" required value="annual" />
          <FieldRadio name="type" required value="one-time" />
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-bold">Select or enter an amount</legend>
        <div className="mt-1 w-full grid grid-cols-3 gap-2">
          {defaultAmountsUsdDollars.map((defaultAmount) => {
            return (
              <FieldRadio
                checked={!isCustomMode && defaultAmount === amountUsdDollars}
                key={defaultAmount}
                label={`\$${defaultAmount}`}
                name="amount"
                onChange={(event) => {
                  setAmountUsdDollars(event.target.value);
                  setIsCustomMode(false);
                }}
                required
                value={defaultAmount}
              />
            );
          })}
          <input
            aria-label={
              customAmountUsdDollars ? `\$${customAmountUsdDollars}` : "Custom"
            }
            aria-description="Go to the next field to enter a custom amount."
            checked={isCustomMode}
            className="sr-only"
            name="amount"
            onChange={(event) => {
              setIsCustomMode(true);
            }}
            required
            type="radio"
            value="custom"
          />
          <label className="flex justify-center items-center p-2 h-full capitalize text-center bg-gray-100 hover:bg-gray-200 border-4 border-white rounded-md [:checked+&]:border-black [:checked+&]:font-bold cursor-text">
            <span
              className={
                customAmountUsdDollars ? "" : "hidden in-focus-within:inline"
              }
            >
              $
            </span>
            <input
              className="field-sizing-content min-w-0 max-w-full focus:outline-none text-center placeholder:text-black placeholder:font-normal"
              onBlur={(event) => {
                if (!event.target.value) {
                  event.target.placeholder = "Custom";
                }
              }}
              onChange={(event) => {
                setAmountUsdDollars(event.target.value);
                setCustomAmountUsdDollars(event.target.value);
                setIsCustomMode(true);
              }}
              onFocus={(event) => {
                event.target.placeholder = "";
                setIsCustomMode(true);

                if (event.target.value) {
                  setAmountUsdDollars(event.target.value);
                }
              }}
              placeholder="Custom"
              required={isCustomMode}
              type="text"
            />
          </label>
        </div>
      </fieldset>
      <button className="p-2 rounded-md bg-mi-red hover:bg-black text-white">
        Continue to pay
      </button>
    </form>
  );
}
