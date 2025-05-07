"use server";
import { cookies } from "next/headers";

// Fetcher function for API requests
export async function fetcher(
    url,
    options = {},
    retries = 3
) {
    const {
        baseUrl = "",
        cacheStrategy = "default",
        revalidate = false,
        defaultHeaders = true,
        ...fetchOptions
    } = options;

    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("auth-token")?.value;

        const headers = {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(defaultHeaders ? { "Content-Type": "application/json" } : {}),
            ...fetchOptions.headers,
        };

        const cacheOptions = {
            cache: cacheStrategy,
        };
        if (revalidate !== false) {
            cacheOptions.next = { revalidate };
        }

        const res = await fetch(`${baseUrl}${url}`, {
            ...fetchOptions,
            headers,
            credentials: "include",
            ...cacheOptions,
        });

        const response = await res.json();

        if (!res.ok) {
            console.error(`Fetch failed: ${res.status} - ${JSON.stringify(response)}`);
        }

        return response;
    } catch (error) {
        console.error(`[Fetch Error] ${url}:`, error);

        if (
            retries > 0 &&
            error instanceof Error &&
            !error.message.includes("422")
        ) {
            console.warn(`Retrying... (${4 - retries}/3)`);
            return fetcher(url, options, retries - 1);
        }

        throw error;
    }
}
