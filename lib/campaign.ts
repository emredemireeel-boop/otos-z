export const LAUNCH_CAMPAIGN = {
    id: "ilk-1000-uye-2026",
    name: "İlk 1000 Üye",
    startAt: "2026-09-05T00:00:00+03:00",
    endAt: "2026-10-05T23:59:59+03:00",
    memberLimit: 1000,
    xpMultiplier: 2,
    shareBonus: 50,
} as const;

export function isLaunchCampaignActive(date = new Date()) {
    const time = date.getTime();
    return time >= Date.parse(LAUNCH_CAMPAIGN.startAt) && time <= Date.parse(LAUNCH_CAMPAIGN.endAt);
}

export function getXpMultiplier(date = new Date()) {
    return isLaunchCampaignActive(date) ? LAUNCH_CAMPAIGN.xpMultiplier : 1;
}
