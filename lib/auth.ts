export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthSessionState {
    isAuthenticated: boolean;
    userEmail: string | null;
}

export const AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
};

type RecordLike = Record<string, unknown>;

const isRecord = (value: unknown): value is RecordLike => {
    return typeof value === "object" && value !== null;
};

const getString = (value: unknown): string | null => {
    return typeof value === "string" && value.trim().length > 0 ? value : null;
};

export const parseJsonSafely = (text: string): unknown => {
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};

export const extractEmailFromSession = (data: unknown): string | null => {
    if (!isRecord(data)) {
        return null;
    }

    const directEmail = getString(data.email);
    if (directEmail) {
        return directEmail;
    }

    if (isRecord(data.data)) {
        const nestedEmail = getString(data.data.email);
        if (nestedEmail) {
            return nestedEmail;
        }
    }

    if (isRecord(data.user)) {
        return getString(data.user.email);
    }

    return null;
};

export const extractAuthTokens = (data: unknown): AuthTokens | null => {
    if (!isRecord(data)) {
        return null;
    }

    const tokenSource = isRecord(data.tokens)
        ? data.tokens
        : isRecord(data.data) && isRecord(data.data.tokens)
            ? data.data.tokens
            : null;

    if (!tokenSource) {
        return null;
    }

    const accessToken = getString(tokenSource.accessToken);
    const refreshToken = getString(tokenSource.refreshToken);

    if (!accessToken || !refreshToken) {
        return null;
    }

    return { accessToken, refreshToken };
};

export const normalizeAuthSession = (
    responseOk: boolean,
    data: unknown,
): AuthSessionState => {
    const userEmail = extractEmailFromSession(data);
    const valid = isRecord(data) && data.valid === true;

    return {
        isAuthenticated: responseOk && (valid || userEmail !== null),
        userEmail,
    };
};
