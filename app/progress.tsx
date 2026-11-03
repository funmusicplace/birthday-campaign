import { connection } from "next/server";

import api from "./api";
import { clearAccessToken, getAccessToken } from "./oauth";
import { formatCurrency } from "./utils";

const ARTIST_ID = process.env.NEXT_PUBLIC_ARTIST_ID || "4";
const CAMPAIGN_START_DATE =
  process.env.NEXT_PUBLIC_CAMPAIGN_START_DATE || "2026-11-01";
const CAMPAIGN_GOAL = Number(process.env.NEXT_PUBLIC_CAMPAIGN_GOAL) || 100;

interface SupporterDonation {
  id: string;
  amount: number;
  currency?: string;
  datePurchased: string;
  tips?: unknown[];
  artistUserSubscriptionCharges?: unknown[];
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

export default async function Progress() {
  await connection();

  const startDate = new Date(CAMPAIGN_START_DATE).getTime();
  let donations: SupporterDonation[] = [];

  try {
    const accessToken = await getAccessToken();
    const searchParams = new URLSearchParams({
      artistIds: ARTIST_ID,
      take: "500",
    });
    const response = await api.request<{ results: SupporterDonation[] }>(
      `manage/sales?${searchParams.toString()}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    donations = response.results
      .filter(
        (item) =>
          new Date(item.datePurchased).getTime() >= startDate &&
          ((item.tips && item.tips.length > 0) ||
            (item.artistUserSubscriptionCharges &&
              item.artistUserSubscriptionCharges.length > 0)),
      )
      .sort(
        (a, b) =>
          new Date(b.datePurchased).getTime() -
          new Date(a.datePurchased).getTime(),
      );
  } catch (error) {
    clearAccessToken();
    console.error(error);
  }

  const totalDonations = donations.length;

  if (totalDonations === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="progress">
          {totalDonations} of {CAMPAIGN_GOAL} supporters
        </label>
        <div className="relative w-full h-5 bg-[rgba(0,0,0,.1)] rounded-full overflow-hidden">
          <div
            aria-valuenow={totalDonations}
            aria-valuemax={CAMPAIGN_GOAL}
            aria-valuemin={0}
            className="h-full bg-black starting:w-0! transition-[width] ease-in-out duration-750 relative"
            id="progress"
            role="progressbar"
            style={{ width: `${(totalDonations / CAMPAIGN_GOAL) * 100}%` }}
          ></div>
        </div>
      </div>
      <ul className="flex flex-col divide-y divide-[rgba(0,0,0,.25)]">
        {donations.slice(0, 5).map((donation) => {
          return (
            <li className="flex justify-between p-1" key={donation.id}>
              <span>
                Someone donated{" "}
                {formatCurrency(donation.amount, donation.currency)}
              </span>
              <span>{formatTimeAgo(donation.datePurchased)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
