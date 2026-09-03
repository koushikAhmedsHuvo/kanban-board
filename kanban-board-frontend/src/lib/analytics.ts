export function track(event: string, properties?: Record<string, unknown>) { if (process.env.NODE_ENV !== "production") console.info("[analytics]", event, properties); }
export function identify(userId: string, traits?: Record<string, unknown>) { if (process.env.NODE_ENV !== "production") console.info("[analytics] identify", userId, traits); }
