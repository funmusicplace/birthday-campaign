"use client";

import { type FormEvent, useEffect, useState } from "react";

import api from "./api";
import { formatCurrency } from "./utils";

const ARTIST_ID = process.env.NEXT_PUBLIC_ARTIST_ID || "4";
const defaultAmountsUsdCents = [2500, 5000, 10000, 25000, 50000];

interface SubscriptionTier {
  allowVariable?: boolean;
  id: number;
  interval: "MONTH" | "YEAR";
  minAmount?: number;
}

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
  value: string | number;
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
        className="block p-2 rounded-md h-full capitalize text-center bg-stone-100 hover:bg-stone-200 border-4 border-white [:checked+&]:border-stone-800 [:checked+&]:font-bold"
        htmlFor={`input-${name}-${value}`}
      >
        {label || value}
      </label>
    </div>
  );
}

export default function Form({ className }: { className?: string }) {
  const [annualTier, setAnnualTier] = useState<SubscriptionTier>();
  const [donationType, setDonationType] = useState<"annual" | "one-time">();
  const [amountUsdCents, setAmountUsdCents] = useState<number>();
  const [customAmountUsdCents, setCustomAmountUsdCents] = useState<number>();
  const [isCustomMode, setIsCustomMode] = useState(false);

  useEffect(() => {
    api
      .get<{ subscriptionTiers: SubscriptionTier[] }>(`artists/${ARTIST_ID}`)
      .then((response) => {
        const firstAnnualTier = response.result.subscriptionTiers.find(
          (tier) =>
            tier.interval === "YEAR" &&
            tier.minAmount === 100 &&
            tier.allowVariable,
        );
        setAnnualTier(firstAnnualTier);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!amountUsdCents) {
      return;
    }

    const item =
      donationType === "one-time"
        ? { type: "tip" as const, amount: amountUsdCents }
        : annualTier
          ? {
              type: "subscription" as const,
              tierId: annualTier.id,
              amount: amountUsdCents,
            }
          : undefined;

    if (!item) {
      return;
    }

    api
      .post<
        {
          artistId: number;
          hosted: boolean;
          items: (typeof item)[];
          successUrl: string;
        },
        { redirectUrl?: string }
      >("purchase", {
        artistId: Number(ARTIST_ID),
        hosted: true,
        items: [item],
        successUrl: `${window.location.origin}${window.location.pathname}?success=true`,
      })
      .then((response) => {
        if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <form
      className={`bg-white p-4 md:p-8 rounded-lg w-full flex flex-col gap-4 ${className || ""}`}
      id="form"
      onSubmit={handleSubmit}
    >
      <h2>Join the party!</h2>
      <p>
        If you're able, please consider annual donations for maximum sustenance.
        You can cancel anytime.
      </p>
      <fieldset>
        <legend className="text-sm font-bold">Select a donation type</legend>
        <div className="mt-1 w-full grid grid-cols-2 gap-2">
          <FieldRadio
            checked={donationType === "annual"}
            name="type"
            onChange={() => setDonationType("annual")}
            required
            value="annual"
          />
          <FieldRadio
            checked={donationType === "one-time"}
            name="type"
            onChange={() => setDonationType("one-time")}
            required
            value="one-time"
          />
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-bold">Select or enter an amount</legend>
        <div className="mt-1 w-full grid grid-cols-3 gap-2">
          {defaultAmountsUsdCents.map((defaultAmount) => {
            return (
              <FieldRadio
                checked={!isCustomMode && defaultAmount === amountUsdCents}
                key={defaultAmount}
                label={formatCurrency(defaultAmount)}
                name="amount"
                onChange={(event) => {
                  setAmountUsdCents(Number(event.target.value));
                  setIsCustomMode(false);
                }}
                required
                value={defaultAmount}
              />
            );
          })}
          <input
            aria-label={
              customAmountUsdCents
                ? formatCurrency(customAmountUsdCents)
                : "Custom"
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
          <label className="group flex justify-center items-center p-2 h-full capitalize text-center bg-stone-100 hover:bg-stone-200 border-4 border-white rounded-md [:checked+&]:border-stone-800 [:checked+&]:font-bold cursor-text">
            <span
              className={
                customAmountUsdCents ? "" : "hidden group-focus-within:inline"
              }
            >
              $
            </span>
            <input
              className="field-sizing-content min-w-[2px] max-w-full focus:outline-none text-center placeholder:text-black placeholder:font-normal"
              onBlur={(event) => {
                if (!event.target.value) {
                  event.target.placeholder = "Custom";
                }
              }}
              onChange={(event) => {
                const cents = event.target.value
                  ? Number(event.target.value) * 100
                  : undefined;
                setAmountUsdCents(cents);
                setCustomAmountUsdCents(cents);
                setIsCustomMode(true);
              }}
              onFocus={(event) => {
                event.target.placeholder = "";
                setIsCustomMode(true);

                if (event.target.value) {
                  setAmountUsdCents(Number(event.target.value) * 100);
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
