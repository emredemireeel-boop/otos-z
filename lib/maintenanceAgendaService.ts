export type MaintenanceFuelType = "Benzin" | "Dizel" | "Elektrik";

export interface StoredMaintenanceItem {
    enabled: boolean;
    dueDate: string;
    notify: boolean;
}

export interface StoredMaintenanceAgenda {
    annualKm: number;
    fuelType: MaintenanceFuelType;
    timezone: "Europe/Istanbul";
    items: Record<string, StoredMaintenanceItem>;
}

interface AgendaResponse {
    success: boolean;
    agenda?: StoredMaintenanceAgenda | null;
    message?: string;
}

async function parseResponse(response: Response): Promise<AgendaResponse> {
    const payload = await response.json().catch(() => ({})) as AgendaResponse;
    if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Bakım ajandası işlemi tamamlanamadı.");
    }
    return payload;
}

export async function loadMaintenanceAgenda(idToken: string): Promise<StoredMaintenanceAgenda | null> {
    const response = await fetch("/api/maintenance-agenda", {
        method: "GET",
        cache: "no-store",
        headers: { Authorization: `Bearer ${idToken}` },
    });
    return (await parseResponse(response)).agenda ?? null;
}

export async function saveMaintenanceAgenda(idToken: string, agenda: StoredMaintenanceAgenda): Promise<void> {
    const response = await fetch("/api/maintenance-agenda", {
        method: "PUT",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(agenda),
    });
    await parseResponse(response);
}
