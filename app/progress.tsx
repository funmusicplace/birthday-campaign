"use client";

import { useEffect, useState } from "react";

import api from "./api";
import { formatCurrency } from "./utils";

const ARTIST_ID = process.env.NEXT_PUBLIC_ARTIST_ID || "4";
const CAMPAIGN_START_DATE =
  process.env.NEXT_PUBLIC_CAMPAIGN_START_DATE || "2026-11-01";
const CAMPAIGN_GOAL = Number(process.env.NEXT_PUBLIC_CAMPAIGN_GOAL) || 100;

interface SupporterSubscription {
  name: string;
  amount: number;
  message?: string;
  datePurchased: string;
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });

const TIME_DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] =
  [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
  ];

function formatTimeAgo(dateString: string): string {
  let duration = (new Date(dateString).getTime() - Date.now()) / 1000;

  for (const division of TIME_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }

  return dateString;
}

export default function Progress() {
  const [subscriptions, setSubscriptions] = useState<SupporterSubscription[]>(
    [],
  );
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);

  useEffect(() => {
    api
      .getMany<SupporterSubscription>(`artists/${ARTIST_ID}/supporters`, {
        sinceDate: CAMPAIGN_START_DATE,
      })
      .then((response) => {
        setSubscriptions(
          [...response.results].sort(
            (a, b) =>
              new Date(b.datePurchased).getTime() -
              new Date(a.datePurchased).getTime(),
          ),
        );
        setTotalSubscriptions(response.totalSupporters);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (totalSubscriptions === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="progress">
          {totalSubscriptions} of {CAMPAIGN_GOAL} supporters
        </label>
        <div className="relative w-full h-5 bg-[rgba(0,0,0,.1)] rounded-full overflow-hidden">
          <div
            aria-valuenow={totalSubscriptions}
            aria-valuemax={CAMPAIGN_GOAL}
            aria-valuemin={0}
            className="h-full bg-black transition-width ease-in-out duration-750 relative"
            id="progress"
            role="progressbar"
            style={{ width: `${(totalSubscriptions / CAMPAIGN_GOAL) * 100}%` }}
          ></div>
        </div>
      </div>
      <ul className="flex flex-col divide-y divide-[rgba(0,0,0,.25)]">
        {subscriptions.slice(0, 5).map((subscription, index) => {
          return (
            <li
              className="flex justify-between p-1"
              key={`${subscription.name}-${subscription.datePurchased}-${index}`}
            >
              <span>Someone donated {formatCurrency(subscription.amount)}</span>
              <span>{formatTimeAgo(subscription.datePurchased)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
