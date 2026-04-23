// utils/api.ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: BodyInit | null;
    queryParams?: Record<string, string | number | boolean>;
}

async function apiRequest<T>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    const url = buildUrl(endpoint, options.queryParams);

    const config: RequestInit = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        body: options.body,
        credentials: 'include',
    };

    const res = await fetch(url, config);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(errorData.message || `Erreur HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
}

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    if (!params || Object.keys(params).length === 0) {
        return `${API_BASE}${endpoint}`;
    }

    const query = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString();

    return `${API_BASE}${endpoint}?${query}`;
}

export const api = {
    get: <T = unknown>(endpoint: string, params?: Record<string, any>): Promise<T> =>
        apiRequest<T>(endpoint, { method: 'GET', queryParams: params }),

    post: <T = unknown>(endpoint: string, body?: any): Promise<T> =>
        apiRequest<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined
        }),

    put: <T = unknown>(endpoint: string, body?: any): Promise<T> =>
        apiRequest<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined
        }),

    patch: <T = unknown>(endpoint: string, body?: any): Promise<T> =>
        apiRequest<T>(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined
        }),

    delete: <T = unknown>(endpoint: string, params?: Record<string, any>): Promise<T> =>
        apiRequest<T>(endpoint, { method: 'DELETE', queryParams: params }),
};