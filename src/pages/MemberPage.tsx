import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
} from "react";
import type { MemberConfig } from "@/members";

type DiscordStatus =
    | "online"
    | "idle"
    | "dnd"
    | "offline";

interface LanyardData {
    discord_user: {
        username: string;
        global_name: string | null;
        avatar: string | null;
        id: string;
        avatar_decoration_data?: {
            asset?: string | null;
        } | null;
    };
    discord_status: DiscordStatus;
}

interface FallbackUser {
    id: string;
    username: string;
    global_name: string | null;
    avatar: {
        link: string;
    } | null;
}

const STATUS_COLORS: Record<
    DiscordStatus,
    string
> = {
    online: "#23a559",
    idle: "#f0b232",
    dnd: "#f23f43",
    offline: "#80848e",
};

// ──────────────────────────────────────────────────────────────────────
// GLOBAL LANYARD SETTINGS
// ──────────────────────────────────────────────────────────────────────

const LANYARD_SETTINGS: {
    enabled: boolean;
    url?: string;
    size: number;
    offsetX: number;
    offsetY: number;
} = {
    enabled: true,

    // url: "/lanyard.png",

    size: 110,

    offsetX: 0,
    offsetY: 0,
};

const ASCII_ART = `▓█████▄  ██▓ ██▒   █▓ ██▓ ███▄    █ ▓█████  ▄▄▄▄    ██▓     ▒█████   ▒█████  ▓█████▄ 
▒██▀ ██▌▓██▒▓██░   █▒▓██▒ ██ ▀█   █ ▓█   ▀ ▓█████▄ ▓██▒    ▒██▒  ██▒▒██▒  ██▒▒██▀ ██▌
░██   █▌▒██▒ ▓██  █▒░▒██▒▓██  ▀█ ██▒▒███   ▒██░ ▒██▒░██    ▒██░  ██▒▒██░  ██▒░██   █▌
░▓█▄   ▌░██░  ▒██ █░░░██░▓██▒  ▐▌██▒▒▓█  ▄ ▒██░█▀  ▒██░    ▒██   ██░▒██   ██░░▓█▄   ▌
░▒████▓ ░██░   ▒▀█░  ░██░▒██░   ▓██░░▒████▒░▓█  ▀█▓░██████▒░ ████▓▒░░ ████▓▒░░▒████▓ 
 ▒▒▓  ▒ ░▓     ░ ▐░  ░▓  ░ ▒░   ▒ ▒ ░░ ▒░ ░░▒▓███▀▒░ ▒░▓  ░░ ▒░▒░▒░ ░ ▒░▒░▒░  ▒▒▓  ▒
 ░ ▒  ▒  ▒ ░   ░ ░░   ▒ ░░ ░░   ░ ▒░ ░ ░  ░▒░▒   ░ ░ ░ ▒  ░  ░ ▒ ▒░   ░ ▒ ▒░  ░ ▒  ▒
 ░ ░  ░  ▒ ░     ░░   ▒ ░   ░   ░ ░    ░    ░   ░   ░    ░ ░   ░ ░ ░ ▒  ░ ░ ░ ▒   ░ ░  ░
   ░     ░        ░   ░           ░    ░  ░  ░ ░          ░  ░    ░ ░      ░ ░     ░     
 ░               ░                                ░                              ░    `;

function getAvatarUrl(
    userId: string,
    avatarHash: string | null,
) {
    if (!avatarHash) {
        return `https://cdn.discordapp.com/embed/avatars/${Number(
            BigInt(userId) % 6n,
        )}.png`;
    }

    const ext =
        avatarHash.startsWith("a_")
            ? "gif"
            : "png";

    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=256`;
}

function getDecorationUrl(
    asset: string | null | undefined,
) {
    if (!asset) {
        return null;
    }

    return `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png?size=512`;
}

function getYouTubeId(
    url: string,
) {
    try {
        const parsed =
            new URL(url);

        if (
            parsed.hostname.includes(
                "youtu.be",
            )
        ) {
            return (
                parsed.pathname
                    .replace("/", "")
                    .trim() || null
            );
        }

        return parsed.searchParams.get(
            "v",
        );
    } catch {
        return null;
    }
}

function formatTime(
    seconds: number,
) {
    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remaining =
        Math.floor(seconds % 60);

    return `${minutes}:${String(
        remaining,
    ).padStart(2, "0")}`;
}

// Convert a HEX color to rgba so the panel styling
// does not depend on CSS color-mix support.
function hexToRgba(
    hex: string,
    alpha: number,
) {
    const clean =
        hex.replace("#", "").trim();

    let normalized = clean;

    if (normalized.length === 3) {
        normalized =
            normalized
                .split("")
                .map(
                    (char) =>
                        `${char}${char}`,
                )
                .join("");
    }

    if (
        normalized.length !== 6 ||
        !/^[0-9a-fA-F]{6}$/.test(
            normalized,
        )
    ) {
        return `rgba(204,34,34,${alpha})`;
    }

    const red =
        parseInt(
            normalized.slice(0, 2),
            16,
        );

    const green =
        parseInt(
            normalized.slice(2, 4),
            16,
        );

    const blue =
        parseInt(
            normalized.slice(4, 6),
            16,
        );

    return `rgba(${red},${green},${blue},${alpha})`;
}

function useTypingEffect(
    text: string,
    speed = 50,
) {
    const [
        displayed,
        setDisplayed,
    ] = useState("");

    const [
        done,
        setDone,
    ] = useState(false);

    useEffect(() => {
        setDisplayed("");
        setDone(false);

        let i = 0;

        const timer =
            window.setInterval(() => {
                setDisplayed(
                    text.slice(
                        0,
                        i + 1,
                    ),
                );

                i++;

                if (
                    i >=
                    text.length
                ) {
                    window.clearInterval(
                        timer,
                    );

                    setDone(true);
                }
            }, speed);

        return () =>
            window.clearInterval(
                timer,
            );
    }, [
        text,
        speed,
    ]);

    return {
        displayed,
        done,
    };
}

interface MusicInfo {
    title: string;
    artist: string;
}

// ──────────────────────────────────────────────────────────────────────
// SOCIAL ICONS
// ──────────────────────────────────────────────────────────────────────

function normalizeSocial(
    label: string,
) {
    return label
        .toLowerCase()
        .trim()
        .replace(/[\s_-]+/g, "");
}

function SocialIcon({
    label,
}: {
    label: string;
}) {
    const social =
        normalizeSocial(
            label,
        );

    const common =
        "w-4 h-4";

    if (
        social === "instagram" ||
        social === "ig"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-2.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
            </svg>
        );
    }

    if (
        social === "tiktok"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M15.5 2h2.7c.18 1.63 1.1 2.93 2.8 3.55V8.4c-1.05-.02-2.2-.3-3.25-.9v7.4a6.1 6.1 0 1 1-6.1-6.1c.42 0 .84.04 1.25.12v2.95a3.28 3.28 0 1 0 1.85 3.03V2.98c.26-.3.5-.62.75-.98z" />
            </svg>
        );
    }

    if (
        social === "twitter" ||
        social === "x"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M18.244 2H21.5l-7.11 8.13L22.75 22h-6.4l-5.01-6.54L5.62 22H2.36l7.6-8.69L1.75 2h6.56l4.53 5.97L18.244 2zm-1.14 17.73h1.8L7.8 4.15H5.87l11.234 15.58z" />
            </svg>
        );
    }

    if (
        social === "youtube" ||
        social === "yt"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.4.58A3 3 0 0 0 .5 6.2C0 8.05 0 12 0 12s0 3.95.5 5.8a3 3 0 0 0 2.1 2.12c1.86.58 9.4.58 9.4.58s7.54 0 9.4-.58a3 3 0 0 0 2.1-2.12c.5-1.85.5-5.8.5-5.8s0-3.95-.5-5.8zM9.55 15.5v-7l6.2 3.5-6.2 3.5z" />
            </svg>
        );
    }

    if (
        social === "twitch"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M3 2h18v13.2l-5.1 4.8h-3.6L9.8 22H6.2v-2H3V2zm2 2v14h3v2.1l2.6-2.1h4.4l4-3.8V4H5zm4.5 3h2v5h-2V7zm5 0h2v5h-2V7z" />
            </svg>
        );
    }

    if (
        social === "spotify"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.59 14.47a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.1-10.56-1.15a.75.75 0 1 1-.33-1.46c4.58-1.05 8.5-.59 11.66 1.34.35.21.46.67.26 1.02zm1.39-3.1a.94.94 0 0 1-1.29.31c-3.23-1.98-8.15-2.55-11.97-1.39a.94.94 0 1 1-.55-1.8c4.36-1.32 9.8-.68 13.5 1.58.43.26.57.83.31 1.3zm.12-3.24C14.23 7.9 7.88 7.69 4.2 8.8a1.13 1.13 0 1 1-.65-2.16c4.23-1.28 11.27-1.02 15.58 1.53a1.13 1.13 0 0 1-1.03 1.96z" />
            </svg>
        );
    }

    if (
        social === "github"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.18c-3.22.7-3.9-1.38-3.9-1.38-.52-1.3-1.27-1.65-1.27-1.65-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.57-.29-5.28-1.29-5.28-5.75 0-1.27.45-2.3 1.18-3.11-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.16 1.19A10.9 10.9 0 0 1 12 6c.98 0 1.96.13 2.88.38 2.2-1.5 3.16-1.19 3.16-1.19.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.11 0 4.47-2.72 5.45-5.3 5.74.41.36.78 1.06.78 2.15v3.18c0 .31.21.67.8.55A11.5 11.5 0 0 0 12 .5z" />
            </svg>
        );
    }

    if (
        social === "discord"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M20.32 4.37a19.8 19.8 0 0 0-4.88-1.52.07.07 0 0 0-.08.04c-.21.38-.45.87-.61 1.25a18.26 18.26 0 0 0-5.49 0c-.16-.39-.4-.88-.62-1.25a.08.08 0 0 0-.08-.04A19.7 19.7 0 0 0 3.68 4.37a.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06c0 .02.01.04.03.05a19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.23-2a.08.08 0 0 0-.04-.1 13.1 13.1 0 0 1-1.87-.9.08.08 0 0 1-.01-.13c.13-.1.25-.2.37-.29a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08.01c.12.1.25.2.37.29.03.03.03.09-.01.13-.6.35-1.23.65-1.87.9a.08.08 0 0 0-.04.1c.36.7.77 1.36 1.23 2 .02.03.05.04.08.03a19.84 19.84 0 0 0 6-3.03.07.07 0 0 0 .03-.05c.5-5.18-.84-9.67-3.55-13.66a.07.07 0 0 0-.03-.03zM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.4s.95-2.4 2.15-2.4 2.17 1.08 2.15 2.4c0 1.32-.95 2.4-2.15 2.4zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4s.95-2.4 2.15-2.4 2.17 1.08 2.15 2.4c0 1.32-.95 2.4-2.15 2.4z" />
            </svg>
        );
    }

    if (
        social === "reddit"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M21 12.1c0-1.2-.98-2.18-2.18-2.18-.59 0-1.12.23-1.51.61-1.48-1.06-3.46-1.73-5.66-1.81l.96-3.02 2.63.56a1.56 1.56 0 1 0 .27-1.32l-3-.64a.66.66 0 0 0-.77.44l-1.07 4.02c-2.28.06-4.36.74-5.9 1.84a2.18 2.18 0 1 0-2.15 3.65c-.03.2-.05.4-.05.61 0 3.2 3.76 5.79 8.4 5.79s8.4-2.59 8.4-5.79c0-.21-.02-.42-.05-.62A2.18 2.18 0 0 0 21 12.1zM8.56 15.07c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6.9 3.09c-.97.91-2.58 1.36-4.46 1.36s-3.49-.45-4.46-1.36a.65.65 0 1 1 .89-.94c.71.67 1.95 1 3.57 1s2.86-.33 3.57-1a.65.65 0 1 1 .89.94zm-.02-3.09c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
        );
    }

    if (
        social === "telegram"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M21.4 4.6 18.2 20c-.24 1.08-.88 1.35-1.78.84l-4.94-3.64-2.38 2.3c-.26.26-.48.48-.98.48l.35-5.03 9.16-8.28c.4-.35-.09-.55-.62-.2L5.68 13.8.76 12.26c-1.07-.34-1.09-1.08.22-1.6L20.2 3.2c.9-.33 1.69.2 1.2 1.4z" />
            </svg>
        );
    }

    if (
        social === "snapchat"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M12 2.3c-3.1 0-5.05 1.82-5.05 5.17 0 1.35-.04 2.2-.8 3.09-.4.47-.9.83-1.52 1.08-.35.14-.53.41-.48.72.06.37.46.57 1.05.76.44.14.89.3 1.16.61.29.33.35.75.11 1.3-.22.5-.2.93.06 1.17.28.28.77.23 1.39.11.5-.1.95-.15 1.3.06.32.19.58.62.87 1.09.42.68.99 1.6 1.91 1.6.92 0 1.49-.92 1.91-1.6.29-.47.55-.9.87-1.09.35-.21.8-.16 1.3-.06.62.12 1.11.17 1.39-.11.26-.24.28-.67.06-1.17-.24-.55-.18-.97.11-1.3.27-.31.72-.47 1.16-.61.59-.19.99-.39 1.05-.76.05-.31-.13-.58-.48-.72-.62-.25-1.12-.61-1.52-1.08-.76-.89-.8-1.74-.8-3.09C17.05 4.12 15.1 2.3 12 2.3z" />
            </svg>
        );
    }

    if (
        social === "facebook" ||
        social === "fb"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M14 8h3V4h-3c-2.76 0-5 2.24-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9c0-.55.45-1 1-1z" />
            </svg>
        );
    }

    if (
        social === "linkedin"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M5 3.5A2.5 2.5 0 1 1 5 8a2.5 2.5 0 0 1 0-4.5zM3 9h4v12H3V9zm6 0h3.84v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.62c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.15 1.46-2.15 2.97V21H9V9z" />
            </svg>
        );
    }

    if (
        social === "steam"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M12.1 2C6.6 2 2.13 6.24 2 11.57l5.42 2.24a3.55 3.55 0 0 1 4.03-.2l2.42-1.76v-.05a4.48 4.48 0 1 1 1.35 3.2l-2.32 1.69a3.55 3.55 0 0 1-6.9.56L2.09 15.45C3.29 19.25 6.9 22 11.15 22 16.7 22 21.2 17.52 21.2 12S16.7 2 12.1 2zm4.46 3.4a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zm0 1.4a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8zM8.55 14.02a2.15 2.15 0 1 0 0 4.3 2.15 2.15 0 0 0 0-4.3zm0 1.3a.85.85 0 1 1 0 1.7.85.85 0 0 1-.85-.85z" />
            </svg>
        );
    }

    if (
        social === "roblox"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="m6.1 2 15.9 5.1-4.1 14.9L2 16.9 6.1 2zm2.1 5.1-1.9 6.9 6.9 2.2 1.9-6.9-6.9-2.2z" />
            </svg>
        );
    }

    if (
        social === "threads"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M17.67 11.07c-.16-3.01-1.82-4.7-4.5-4.7-1.55 0-2.83.56-3.7 1.62l1.63 1.17c.47-.57 1.15-.91 2.02-.91 1.37 0 2.22.8 2.38 2.32-2.68-.23-5.82.04-5.82 2.86 0 1.9 1.46 3.19 3.55 3.19 1.46 0 2.64-.62 3.3-1.68.4.72.57 1.57.53 2.51-.13 2.64-2.01 4.18-5.1 4.18-3.78 0-6.45-2.39-6.45-6.91 0-4.46 2.44-7.26 6.32-7.26 2.02 0 3.6.77 4.7 2.29l1.63-1.17C16.86 4.6 14.66 3.5 12 3.5 6.95 3.5 3.5 7 3.5 12.72 3.5 18.63 7.05 22 12.2 22c4.97 0 8.1-2.86 8.1-7.13 0-1.56-.29-2.77-.87-3.8-.45-.08-1.04-.03-1.76 0zm-4.2 3.64c-1 0-1.66-.47-1.66-1.26 0-1.04 1.1-1.3 2.12-1.3.53 0 1.11.06 1.68.17-.18 1.45-1.03 2.39-2.14 2.39z" />
            </svg>
        );
    }

    if (
        social === "pinterest"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M12 2a10 10 0 0 0-3.64 19.31c-.08-1.65-.01-3.64.41-5.54l1.03-4.36s-.26-.51-.26-1.27c0-1.19.69-2.08 1.55-2.08.73 0 1.08.55 1.08 1.21 0 .74-.47 1.84-.71 2.86-.2 1.2.6 2.18 1.77 2.18 2.12 0 3.55-2.23 3.55-4.87 0-2.01-1.35-3.52-3.8-3.52-2.77 0-4.5 2.07-4.5 4.38 0 .8.24 1.36.63 1.84.18.21.2.3.14.55l-.2.76c-.07.25-.28.34-.52.25-1.43-.58-2.09-2.12-2.09-3.85 0-2.86 2.41-6.29 7.2-6.29 3.84 0 6.37 2.78 6.37 5.77 0 3.95-2.2 6.91-5.46 6.91-1.1 0-2.14-.6-2.49-1.28l-.65 2.56c-.47 1.9-1.4 3.8-2.09 4.98A10 10 0 1 0 12 2z" />
            </svg>
        );
    }

    if (
        social === "kick"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M4 3h5v6h2V6h5v3h2v9h-2v3h-5v-3H9v6H4V3zm5 11v3h5v-3h-2v-2h-3v2z" />
            </svg>
        );
    }

    if (
        social === "soundcloud"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M1.5 15.5c0 1.45 1.05 2.5 2.5 2.5h9V9.3c-.46-.12-.94-.18-1.43-.18-2.8 0-5.07 2.2-5.2 4.98a2.1 2.1 0 0 0-1.37-.5c-.41 0-.8.12-1.13.31A2.5 2.5 0 0 0 1.5 15.5zm12.5 2.5h4.3a4.9 4.9 0 0 0 0-9.8c-.45 0-.89.06-1.3.18A5.63 5.63 0 0 0 14 6.5v11.5z" />
            </svg>
        );
    }

    if (
        social === "bandcamp"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M2 7h8.7l-4.3 10H2L6.3 7H15l-2.1 5H8.7l-2.1 5H2L6.3 7z" />
            </svg>
        );
    }

    if (
        social === "bluesky"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M12 10.8C10.9 8.7 7.93 4.8 5.17 2.91 2.53 1.1 1.53 1.4 1.02 1.64.42 1.92.31 2.85.31 3.4c0 .55.3 4.52.5 5.25.65 2.38 2.98 3.18 5.11 2.9-3.73.55-7.02 1.9-2.7 6.6 4.77 4.62 8.05-.98 8.78-2.73.73 1.75 4.01 7.35 8.78 2.73 4.32-4.7 1.03-6.05-2.7-6.6 2.13.28 4.46-.52 5.11-2.9.2-.73.5-4.7.5-5.25 0-.55-.11-1.48-.71-1.76-.51-.24-1.51-.54-4.15 1.27C16.07 4.8 13.1 8.7 12 10.8z" />
            </svg>
        );
    }

    if (
        social === "mastodon"
    ) {
        return (
            <svg
                className={common}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M21.52 7.24c0-3.74-2.45-4.84-2.45-4.84C17.84 1.88 15.46 1.5 12.03 1.5h-.06c-3.43 0-5.81.38-7.04.9 0 0-2.45 1.1-2.45 4.84v5.55c0 3.6.58 6.8 4.5 8.12 1.45.49 2.96.78 4.5.88.22-.03.43-.09.63-.17.43-.18.61-.46.61-.46s-.01-1.08-.01-1.34c-3.64.12-4.62-2.2-4.62-2.2-1.2-3.11-1.17-8.03-1.17-8.03 0-2.15.2-3.9 1.2-4.77 1.2-1.06 3.9-.97 3.9-.97s2.7-.09 3.9.97c1 .87 1.2 2.62 1.2 4.77 0 0 .03 4.92-1.17 8.03 0 0-.98 2.32-4.62 2.2 0 .26-.01 1.34-.01 1.34s.18.28.61.46c.2.08.41.14.63.17 1.54-.1 3.05-.39 4.5-.88 3.92-1.32 4.5-4.52 4.5-8.12V7.24z" />
            </svg>
        );
    }

    // Generic fallback.
    return (
        <svg
            className={common}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <path d="M10 13.5a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1.1 1.1" />
            <path d="M14 10.5a5 5 0 0 0-7.07 0l-2 2A5 5 0 0 0 12 19.57l1.1-1.1" />
        </svg>
    );
}

export default function MemberPage({
    member: m,
}: {
    member: MemberConfig;
}) {
    const [
        lanyard,
        setLanyard,
    ] =
        useState<LanyardData | null>(
            null,
        );

    const [
        fallback,
        setFallback,
    ] =
        useState<FallbackUser | null>(
            null,
        );

    const [
        loaded,
        setLoaded,
    ] = useState(false);

    const [
        introVisible,
        setIntroVisible,
    ] = useState(true);

    const [
        isPlaying,
        setIsPlaying,
    ] = useState(false);

    const [
        currentTime,
        setCurrentTime,
    ] = useState(0);

    const [
        duration,
        setDuration,
    ] = useState(0);

    const [
        musicInfo,
        setMusicInfo,
    ] = useState<MusicInfo>({
        title:
            "now playing",
        artist:
            m.name ??
            m.key,
    });

    const musicFrameRef =
        useRef<HTMLIFrameElement | null>(
            null,
        );

    const bioText =
        (m.bio ?? "").replace(
            /\\n/g,
            "\n",
        );

    const {
        displayed,
        done,
    } =
        useTypingEffect(
            bioText,
        );

    const youtubeId =
        getYouTubeId(
            m.music ?? "",
        );

    const artworkUrl =
        `/${m.key}/cover.png`;

    useEffect(() => {
        if (!m.discordId) {
            setLoaded(true);
            return;
        }

        let alive = true;

        const loadProfile =
            async () => {
                try {
                    const response =
                        await fetch(
                            `https://api.lanyard.rest/v1/users/${m.discordId}`,
                        );

                    const json =
                        await response.json();

                    if (
                        alive &&
                        json.success
                    ) {
                        setLanyard(
                            json.data,
                        );

                        setLoaded(
                            true,
                        );

                        return;
                    }
                } catch { }

                try {
                    const response =
                        await fetch(
                            `https://japi.rest/discord/v1/user/${m.discordId}`,
                        );

                    if (response.ok) {
                        const json =
                            await response.json();

                        const data =
                            json?.data;

                        if (
                            alive &&
                            data?.id
                        ) {
                            setFallback({
                                id: data.id,
                                username:
                                    data.username ??
                                    "unknown",
                                global_name:
                                    data.global_name ??
                                    null,
                                avatar:
                                    data.avatar
                                        ? {
                                            link: getAvatarUrl(
                                                data.id,
                                                data.avatar,
                                            ),
                                        }
                                        : null,
                            });
                        }
                    }
                } catch { }

                if (alive) {
                    setLoaded(true);
                }
            };

        loadProfile();

        return () => {
            alive = false;
        };
    }, [
        m.discordId,
    ]);

    const user =
        lanyard?.discord_user ??
        null;

    const status =
        lanyard?.discord_status ??
        "offline";

    const hasLanyard =
        !!lanyard;

    const lanyardSettings =
        LANYARD_SETTINGS;

    // All per-member colors come from members.ts.
    const buttonColors = {
        social:
            m.buttonColors?.social ??
            "#cc2222",

        discord:
            m.buttonColors?.discord ??
            "#cc2222",

        panel:
            m.buttonColors?.panel ??
            "#cc2222",
    };

    // Panel colors are turned into rgba values once,
    // then reused by the Music and Websites panels.
    const panelStyle = {
        "--panel-color":
            buttonColors.panel,

        "--panel-border":
            hexToRgba(
                buttonColors.panel,
                0.45,
            ),

        "--panel-glow-strong":
            hexToRgba(
                buttonColors.panel,
                0.55,
            ),

        "--panel-glow-medium":
            hexToRgba(
                buttonColors.panel,
                0.25,
            ),

        "--panel-glow-soft":
            hexToRgba(
                buttonColors.panel,
                0.10,
            ),

        "--panel-inset":
            hexToRgba(
                buttonColors.panel,
                0.035,
            ),

        "--panel-text":
            hexToRgba(
                buttonColors.panel,
                0.78,
            ),

        "--panel-dot":
            hexToRgba(
                buttonColors.panel,
                0.72,
            ),

        "--panel-dot-soft":
            hexToRgba(
                buttonColors.panel,
                0.20,
            ),

        "--panel-header-border":
            hexToRgba(
                buttonColors.panel,
                0.25,
            ),

        "--panel-cover-border":
            hexToRgba(
                buttonColors.panel,
                0.35,
            ),

        "--panel-cover-bg":
            hexToRgba(
                buttonColors.panel,
                0.07,
            ),

        "--panel-bar":
            hexToRgba(
                buttonColors.panel,
                0.80,
            ),

        "--panel-button-text":
            hexToRgba(
                buttonColors.panel,
                0.75,
            ),

        "--panel-button-border":
            hexToRgba(
                buttonColors.panel,
                0.55,
            ),

        "--panel-button-bg":
            hexToRgba(
                buttonColors.panel,
                0.07,
            ),

        "--panel-button-hover-text":
            hexToRgba(
                buttonColors.panel,
                0.90,
            ),

        "--panel-button-hover-border":
            hexToRgba(
                buttonColors.panel,
                0.82,
            ),

        "--panel-button-hover-bg":
            hexToRgba(
                buttonColors.panel,
                0.14,
            ),

        "--panel-divider":
            hexToRgba(
                buttonColors.panel,
                0.50,
            ),

        "--panel-affiliate-border":
            hexToRgba(
                buttonColors.panel,
                0.38,
            ),

        "--panel-affiliate-glow":
            hexToRgba(
                buttonColors.panel,
                0.08,
            ),
    } as CSSProperties;

    const discordDecorationUrl =
        user
            ? getDecorationUrl(
                user
                    .avatar_decoration_data
                    ?.asset,
            )
            : null;

    const decorationUrl =
        lanyardSettings.enabled === false
            ? null
            : lanyardSettings.url?.trim() ||
            discordDecorationUrl;

    const lanyardScale =
        Math.max(
            0.05,
            (lanyardSettings.size ?? 100) /
            100,
        );

    const lanyardOffsetX =
        lanyardSettings.offsetX ?? 0;

    const lanyardOffsetY =
        lanyardSettings.offsetY ?? 0;

    const lanyardTransform =
        `translate(-50%, -50%) scale(${lanyardScale})`;

    const avatarUrl =
        m.discordId
            ? user
                ? getAvatarUrl(
                    user.id,
                    user.avatar,
                )
                : fallback?.avatar
                    ?.link ??
                getAvatarUrl(
                    m.discordId,
                    null,
                )
            : `https://cdn.discordapp.com/embed/avatars/0.png`;

    const username =
        user?.username ??
        fallback?.username ??
        m.name ??
        m.key;

    const globalName =
        user?.global_name ??
        fallback?.global_name ??
        username;

    const overlay =
        m.backgroundOverlay ??
        0.45;

    const socials =
        m.socials ?? [];

    const discordLinks =
        (m.discordLinks ?? []).filter(
            (link) =>
                link.url?.trim(),
        );

    // Each member can define their own affiliates in members.ts.
    // Affiliate entries only need a banner path and a URL.
    const affiliates = ((m as MemberConfig & {
        affiliates?: {
            name?: string;
            url: string;
            banner: string;
        }[];
    }).affiliates ?? []).filter(
        (affiliate) =>
            affiliate.url?.trim() &&
            affiliate.banner?.trim(),
    );

    useEffect(() => {
        if (
            !m.music ||
            !youtubeId
        ) {
            setMusicInfo({
                title:
                    "now playing",
                artist:
                    m.name ??
                    m.key,
            });

            return;
        }

        let alive = true;

        const loadMusicInfo =
            async () => {
                try {
                    const response =
                        await fetch(
                            `https://www.youtube.com/oembed?url=${encodeURIComponent(
                                m.music!,
                            )}&format=json`,
                        );

                    if (!response.ok) {
                        return;
                    }

                    const data =
                        await response.json();

                    if (!alive) {
                        return;
                    }

                    setMusicInfo({
                        title:
                            data.title ??
                            "now playing",
                        artist:
                            data.author_name ??
                            m.name ??
                            m.key,
                    });
                } catch {
                    // Keep fallback.
                }
            };

        loadMusicInfo();

        return () => {
            alive = false;
        };
    }, [
        m.music,
        m.name,
        m.key,
        youtubeId,
    ]);

    useEffect(() => {
        const handleMessage =
            (
                event: MessageEvent,
            ) => {
                if (
                    typeof event.data !==
                    "string"
                ) {
                    return;
                }

                try {
                    const data =
                        JSON.parse(
                            event.data,
                        );

                    if (
                        data?.event !==
                        "infoDelivery"
                    ) {
                        return;
                    }

                    const info =
                        data?.info;

                    if (!info) {
                        return;
                    }

                    const time =
                        Number(
                            info.currentTime,
                        );

                    const length =
                        Number(
                            info.duration,
                        );

                    const playerState =
                        Number(
                            info.playerState,
                        );

                    if (
                        Number.isFinite(
                            time,
                        )
                    ) {
                        setCurrentTime(
                            time,
                        );
                    }

                    if (
                        Number.isFinite(
                            length,
                        ) &&
                        length > 0
                    ) {
                        setDuration(
                            length,
                        );
                    }

                    if (
                        playerState === 1
                    ) {
                        setIsPlaying(true);
                    }

                    if (
                        playerState === 0 ||
                        playerState === 2
                    ) {
                        setIsPlaying(
                            false,
                        );
                    }
                } catch {
                    // Ignore.
                }
            };

        window.addEventListener(
            "message",
            handleMessage,
        );

        return () =>
            window.removeEventListener(
                "message",
                handleMessage,
            );
    }, []);

    useEffect(() => {
        if (
            !m.music ||
            !youtubeId
        ) {
            return;
        }

        const pollPlayer =
            () => {
                const frame =
                    musicFrameRef.current;

                if (
                    !frame?.contentWindow
                ) {
                    return;
                }

                try {
                    frame.contentWindow.postMessage(
                        JSON.stringify({
                            event:
                                "listening",
                            channel:
                                "widget",
                        }),
                        "*",
                    );

                    frame.contentWindow.postMessage(
                        JSON.stringify({
                            event:
                                "command",
                            func:
                                "getCurrentTime",
                            args: [],
                        }),
                        "*",
                    );

                    frame.contentWindow.postMessage(
                        JSON.stringify({
                            event:
                                "command",
                            func:
                                "getDuration",
                            args: [],
                        }),
                        "*",
                    );
                } catch {
                    // Ignore.
                }
            };

        pollPlayer();

        const timer =
            window.setInterval(
                pollPlayer,
                250,
            );

        return () =>
            window.clearInterval(
                timer,
            );
    }, [
        m.music,
        youtubeId,
    ]);

    function postPlayerCommand(
        func: string,
        args: unknown[] = [],
    ) {
        const frame =
            musicFrameRef.current;

        if (
            !frame?.contentWindow
        ) {
            return;
        }

        try {
            frame.contentWindow.postMessage(
                JSON.stringify({
                    event:
                        "command",
                    func,
                    args,
                }),
                "*",
            );
        } catch {
            // Ignore.
        }
    }

    function startMusic() {
        if (
            !m.music ||
            !youtubeId
        ) {
            return;
        }

        const play =
            () => {
                postPlayerCommand(
                    "unMute",
                );

                postPlayerCommand(
                    "playVideo",
                );
            };

        play();

        window.setTimeout(
            play,
            150,
        );

        window.setTimeout(
            play,
            600,
        );

        setIsPlaying(
            true,
        );
    }

    function toggleMusic() {
        if (isPlaying) {
            postPlayerCommand(
                "pauseVideo",
            );

            setIsPlaying(false);
        } else {
            startMusic();
        }
    }

    function seekMusic(
        percentage: number,
    ) {
        if (
            duration <= 0
        ) {
            return;
        }

        const target =
            duration *
            Math.min(
                1,
                Math.max(
                    0,
                    percentage,
                ),
            );

        postPlayerCommand(
            "seekTo",
            [target, true],
        );

        setCurrentTime(
            target,
        );
    }

    function openExternal(
        url: string,
    ) {
        window.open(
            url,
            "_blank",
            "noopener,noreferrer",
        );
    }

    function enterPage() {
        if (!introVisible) {
            return;
        }

        setIntroVisible(
            false,
        );

        startMusic();
    }

    const progress =
        duration > 0
            ? Math.min(
                100,
                Math.max(
                    0,
                    (currentTime /
                        duration) *
                    100,
                ),
            )
            : 0;

    const socialButtonStyle =
        {
            "--member-button-color":
                buttonColors.social,

            "--member-button-bg":
                `${buttonColors.social}0D`,

            "--member-button-border":
                `${buttonColors.social}55`,

            "--member-button-hover-bg":
                `${buttonColors.social}1A`,

            "--member-button-hover-border":
                `${buttonColors.social}99`,
        } as CSSProperties;

    return (
        <div
            className="fixed inset-0 w-full h-screen flex justify-center relative overflow-hidden"
            style={{
                overscrollBehavior: "none",
            }}
        >

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&display=swap');

        html,
        body,
        #root {
          width: 100%;
          height: 100%;
          margin: 0;
          overflow: hidden !important;
          overscroll-behavior: none !important;
        }

        html,
        body,
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: smooth;
        }

        *::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }

        @keyframes memberIntroFlicker {
          0%,
          100% {
            opacity: 1;
            filter: brightness(1);
            transform: translate(0, 0);
          }

          3% {
            opacity: .72;
            filter: brightness(1.5);
            transform: translate(-1px, 0);
          }

          4% {
            opacity: 1;
            filter: brightness(1);
            transform: translate(1px, 0);
          }

          8% {
            opacity: .42;
            filter: brightness(1.8);
          }

          9% {
            opacity: 1;
            filter: brightness(1);
            transform: translate(0, 0);
          }

          31% {
            opacity: .68;
            transform: translate(1px, 0);
          }

          32% {
            opacity: 1;
            transform: translate(0, 0);
          }

          56% {
            opacity: .5;
            filter: brightness(1.75);
          }

          57% {
            opacity: 1;
            filter: brightness(1);
          }

          79% {
            opacity: .72;
            transform: translate(-1px, 0);
          }

          80% {
            opacity: .96;
            transform: translate(0, 0);
          }

          94% {
            opacity: .55;
            filter: brightness(1.7);
          }

          95% {
            opacity: 1;
            filter: brightness(1);
          }
        }

        @keyframes memberIntroGlow {
          0%,
          100% {
            transform: scale(.96);
            opacity: .3;
          }

          50% {
            transform: scale(1.04);
            opacity: .65;
          }
        }

        @keyframes memberIntroLine {
          0% {
            transform: scaleX(.35);
            opacity: .2;
          }

          50% {
            transform: scaleX(1);
            opacity: .85;
          }

          100% {
            transform: scaleX(.35);
            opacity: .2;
          }
        }

        @keyframes memberPageEnter {
          0% {
            opacity: 0;
            filter: blur(10px);
            transform: translateY(8px);
          }

          100% {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
        }

        @keyframes musicBars {
          0%,
          100% {
            transform: scaleY(.3);
            opacity: .35;
          }

          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        .member-intro-ascii {
          animation:
            memberIntroFlicker
            3.2s
            steps(1, end)
            infinite;
        }

        .member-page-content {
          animation:
            memberPageEnter
            .7s
            cubic-bezier(.16, 1, .3, 1)
            forwards;
        }

        .side-panel {
          width: 270px;
          height: 430px;
          border-color: var(--panel-border) !important;
        }

        /* MUSIC — tilts toward the profile */
        .side-panel-left {
          transform: perspective(900px) rotateY(25deg) translateX(25px);
          transform-origin: right center;

          box-shadow:
            0 12px 30px rgba(0, 0, 0, .65),
            0 0 7px var(--panel-glow-strong),
            0 0 20px var(--panel-glow-medium),
            0 0 42px var(--panel-glow-soft),
            inset 0 0 28px var(--panel-inset);
        }

        /* AFFILIATES — tilts toward the profile */
        .side-panel-right {
          transform: perspective(900px) rotateY(-25deg) translateX(-25px);
          transform-origin: left center;

          box-shadow:
            0 12px 30px rgba(0, 0, 0, .65),
            0 0 7px var(--panel-glow-strong),
            0 0 20px var(--panel-glow-medium),
            0 0 42px var(--panel-glow-soft),
            inset 0 0 28px var(--panel-inset);
        }

        .member-panel-color {
          color: var(--panel-text);
        }

        .member-panel-dot {
          background: var(--panel-dot);
          box-shadow:
            0 0 8px var(--panel-glow-strong);
        }

        .member-panel-cover {
          border-color: var(--panel-cover-border) !important;
          background: var(--panel-cover-bg);
        }

        .member-panel-bar {
          background: var(--panel-bar);
        }

        .member-panel-progress {
          background: var(--panel-bar);
        }

        .member-panel-button {
          color: var(--panel-button-text);
          border-color: var(--panel-button-border);
          background: var(--panel-button-bg);
        }

        .member-panel-button:hover {
          color: var(--panel-button-hover-text);
          border-color: var(--panel-button-hover-border);
          background: var(--panel-button-hover-bg);

          box-shadow:
            0 0 14px var(--panel-glow-medium);
        }

        .member-panel-divider {
          background: var(--panel-divider);
        }

        .member-panel-border {
          border-color: var(--panel-affiliate-border) !important;
        }

        .member-panel-glow {
          box-shadow:
            0 0 16px var(--panel-affiliate-glow);
        }

        /* Per-member social button color */
        .member-color-button {
          color: var(--member-button-color);
          border-color: var(--member-button-border);
          background: var(--member-button-bg);

          transition:
            color .2s ease,
            border-color .2s ease,
            background .2s ease,
            transform .2s ease,
            box-shadow .2s ease;
        }

        .member-color-button:hover {
          color: var(--member-button-color);
          border-color: var(--member-button-hover-border);
          background: var(--member-button-hover-bg);
          box-shadow: 0 0 14px var(--member-button-bg);
        }

        .affiliate-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .affiliate-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        @media (max-width: 1399px) {
          .side-panel {
            width: 255px;
          }
        }

        @media (max-width: 1279px) {
          .side-panel {
            width: 100%;
            max-width: 430px;
            height: 330px;
          }
        }
      `}</style>

            {/* BACKGROUND */}
            {m.backgroundImage ? (
                <>
                    <div
                        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage:
                                `url(${m.backgroundImage})`,
                        }}
                    />

                    <div
                        className="fixed inset-0 -z-10"
                        style={{
                            background:
                                `rgba(0,0,0,${overlay})`,
                        }}
                    />
                </>
            ) : (
                <div
                    className="fixed inset-0 -z-10"
                    style={{
                        backgroundColor:
                            "#0a0a0f",
                    }}
                />
            )}

            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)",
                }}
            />

            {/* HIDDEN YOUTUBE PLAYER */}
            {youtubeId && (
                <iframe
                    ref={
                        musicFrameRef
                    }
                    title="personal music"
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&playsinline=1&enablejsapi=1&controls=0&loop=1&playlist=${youtubeId}&rel=0&modestbranding=1`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={{
                        position:
                            "fixed",
                        width:
                            "1px",
                        height:
                            "1px",
                        left:
                            "-10px",
                        bottom:
                            "-10px",
                        opacity:
                            0.01,
                        pointerEvents:
                            "none",
                        border: 0,
                    }}
                />
            )}

            {/* CLICK TO ENTER */}
            {introVisible && (
                <div className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden bg-black">

                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(circle at center, rgba(150, 0, 20, 0.12), transparent 48%), radial-gradient(circle at center, transparent 35%, rgba(0,0,0,.78) 100%)",
                        }}
                    />

                    <div
                        className="absolute inset-0 pointer-events-none opacity-30"
                        style={{
                            background:
                                "repeating-linear-gradient(0deg, rgba(190,20,42,.035) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(190,20,42,.02) 0 1px, transparent 1px 5px)",
                        }}
                    />

                    <button
                        type="button"
                        onClick={
                            enterPage
                        }
                        className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center cursor-pointer bg-transparent border-0"
                        aria-label="Click to enter"
                    >
                        <div className="w-full flex flex-col items-center justify-center">

                            <div
                                className="mb-7 font-mono text-[9px] sm:text-[11px] tracking-[0.45em] uppercase text-red-500/80"
                                style={{
                                    textShadow:
                                        "0 0 8px rgba(220,38,38,.45), 0 0 20px rgba(180,20,30,.25)",
                                }}
                            >
                            </div>

                            <div className="relative max-w-[95vw] overflow-x-auto">

                                <div
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{
                                        width:
                                            "45vw",
                                        height:
                                            "45vw",
                                        maxWidth:
                                            "650px",
                                        maxHeight:
                                            "650px",
                                        borderRadius:
                                            "50%",
                                        background:
                                            "radial-gradient(circle, rgba(190,20,42,.2), rgba(120,18,28,.06) 35%, transparent 70%)",
                                        filter:
                                            "blur(35px)",
                                        animation:
                                            "memberIntroGlow 3.2s ease-in-out infinite",
                                    }}
                                />

                                <pre
                                    className="relative member-intro-ascii select-none whitespace-pre font-mono text-[clamp(4px,1vw,12px)] leading-[1.01] mx-auto"
                                    style={{
                                        color:
                                            "#cc2222",
                                        textShadow:
                                            "0 0 7px rgba(200,30,30,.85), 0 0 18px rgba(180,20,20,.58), 0 0 40px rgba(120,18,28,.3)",
                                    }}
                                >
                                    {ASCII_ART}
                                </pre>

                            </div>

                            <div className="mt-8 flex flex-col items-center gap-3">

                                <div
                                    className="h-px w-40 bg-gradient-to-r from-transparent via-red-800 to-transparent"
                                    style={{
                                        animation:
                                            "memberIntroLine 2.4s ease-in-out infinite",
                                    }}
                                />

                                <div className="font-mono text-[8px] tracking-[0.22em] uppercase text-white/20">
                                    founded by krammy
                                </div>

                            </div>

                        </div>
                    </button>
                </div>
            )}

            {/* MAIN PAGE */}
            {!introVisible && (
                <div className="relative z-10 w-full max-w-[1400px] px-4 pt-8 pb-12 member-page-content">

                    <div className="text-center mb-8 pointer-events-none">

                        <span
                            className="font-mono text-[9px] tracking-[0.35em] uppercase text-red-700/45"
                            style={{
                                textShadow:
                                    "0 0 7px rgba(220,38,38,.25)",
                            }}
                        >
                            divinebloox.xyz/{m.key}
                        </span>

                    </div>

                    {/* ========================================================= */}
                    {/* MUSIC  |  PROFILE  |  AFFILIATES                         */}
                    {/* ========================================================= */}

                    <div className="grid grid-cols-1 xl:grid-cols-[270px_430px_270px] gap-30 items-start justify-center">

                        {/* ======================================================= */}
                        {/* MUSIC BOX                                               */}
                        {/* ======================================================= */}

                        <aside
                            className="side-panel side-panel-left mx-auto rounded-2xl border bg-black/35 backdrop-blur-md overflow-hidden xl:sticky xl:top-6"
                            style={
                                panelStyle
                            }
                        >

                            <div className="h-full p-5 flex flex-col items-center text-center">

                                <div className="flex items-center justify-between w-full mb-5">

                                    <span className="member-panel-dot w-1.5 h-1.5 rounded-full" />

                                    <span className="member-panel-color font-mono text-[10px] uppercase tracking-[0.3em]">
                                        music
                                    </span>

                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{
                                            background:
                                                "var(--panel-dot-soft)",
                                        }}
                                    />

                                </div>

                                {/* Cover */}
                                <div className="member-panel-cover w-full aspect-square max-h-[210px] rounded-xl overflow-hidden border bg-black/10">

                                    <img
                                        src={
                                            artworkUrl
                                        }
                                        alt=""
                                        draggable={
                                            false
                                        }
                                        className="w-full h-full object-cover"
                                        onError={(event) => {
                                            event.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                </div>

                                {/* Music bars */}
                                <div className="mt-3 flex items-end justify-center gap-1 h-4">

                                    <span
                                        className="member-panel-bar w-1 rounded-full"
                                        style={{
                                            height:
                                                isPlaying
                                                    ? "55%"
                                                    : "25%",
                                            animation:
                                                isPlaying
                                                    ? "musicBars .7s ease-in-out infinite"
                                                    : "none",
                                        }}
                                    />

                                    <span
                                        className="member-panel-bar w-1 rounded-full"
                                        style={{
                                            height:
                                                isPlaying
                                                    ? "100%"
                                                    : "35%",
                                            animation:
                                                isPlaying
                                                    ? "musicBars .55s ease-in-out .1s infinite"
                                                    : "none",
                                        }}
                                    />

                                    <span
                                        className="member-panel-bar w-1 rounded-full"
                                        style={{
                                            height:
                                                isPlaying
                                                    ? "70%"
                                                    : "25%",
                                            animation:
                                                isPlaying
                                                    ? "musicBars .8s ease-in-out .2s infinite"
                                                    : "none",
                                        }}
                                    />

                                </div>

                                {/* Song */}
                                <div className="mt-4 w-full text-center">

                                    <p
                                        className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/80 leading-relaxed"
                                        title={
                                            musicInfo.title
                                        }
                                    >
                                        {
                                            musicInfo.title
                                        }
                                    </p>

                                    <p
                                        className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/30 mt-1"
                                        title={
                                            musicInfo.artist
                                        }
                                    >
                                        {
                                            musicInfo.artist
                                        }
                                    </p>

                                </div>

                                {/* Progress */}
                                <div className="w-full mt-5">

                                    <button
                                        type="button"
                                        onClick={(
                                            event,
                                        ) => {
                                            const rect =
                                                event.currentTarget.getBoundingClientRect();

                                            const percentage =
                                                (event.clientX -
                                                    rect.left) /
                                                rect.width;

                                            seekMusic(
                                                percentage,
                                            );
                                        }}
                                        className="w-full h-4 cursor-pointer"
                                        aria-label="Seek music"
                                    >
                                        <div className="relative top-[6px] w-full h-1 rounded-full bg-white/10 overflow-hidden">

                                            <div
                                                className="member-panel-progress h-full transition-[width] duration-200"
                                                style={{
                                                    width:
                                                        `${progress}%`,
                                                }}
                                            />

                                        </div>
                                    </button>

                                    <div className="flex justify-between">

                                        <span className="font-mono text-[8px] text-white/25">
                                            {
                                                formatTime(
                                                    currentTime,
                                                )
                                            }
                                        </span>

                                        <span className="font-mono text-[8px] text-white/25">
                                            {
                                                formatTime(
                                                    duration,
                                                )
                                            }
                                        </span>

                                    </div>

                                </div>

                                {/* Pause */}
                                <div className="mt-auto pt-5 flex justify-center">

                                    <button
                                        type="button"
                                        onClick={
                                            toggleMusic
                                        }
                                        className="member-panel-button w-11 h-11 rounded-full border transition-all flex items-center justify-center"
                                        aria-label={
                                            isPlaying
                                                ? "Pause music"
                                                : "Play music"
                                        }
                                    >

                                        {isPlaying ? (
                                            <svg
                                                width="13"
                                                height="13"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <rect
                                                    x="6"
                                                    y="5"
                                                    width="4"
                                                    height="14"
                                                    rx="1"
                                                />
                                                <rect
                                                    x="14"
                                                    y="5"
                                                    width="4"
                                                    height="14"
                                                    rx="1"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                width="13"
                                                height="13"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d="M8 5.14v13.72c0 .78.84 1.26 1.5.86l10.5-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
                                            </svg>
                                        )}

                                    </button>

                                </div>

                            </div>
                        </aside>

                        {/* ======================================================= */}
                        {/* PROFILE                                                 */}
                        {/* ======================================================= */}

                        <main className="w-full max-w-[430px] mx-auto">

                            {m.bannerImage && (
                                <div className="relative w-full">

                                    <div
                                        className="w-full rounded-2xl overflow-hidden"
                                        style={{
                                            height: 160,
                                            backgroundImage:
                                                `url(${m.bannerImage})`,
                                            backgroundSize:
                                                "cover",
                                            backgroundPosition:
                                                "center",
                                        }}
                                    />

                                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-14 z-10">

                                        {!loaded ? (
                                            <div
                                                className="w-28 h-28 rounded-full bg-white/10 animate-pulse"
                                                style={{
                                                    boxShadow:
                                                        "0 0 0 4px rgba(0,0,0,.55)",
                                                }}
                                            />
                                        ) : (
                                            <div className="relative w-28 h-28">

                                                <img
                                                    src={
                                                        avatarUrl
                                                    }
                                                    alt={
                                                        username
                                                    }
                                                    className="w-28 h-28 rounded-full object-cover"
                                                    style={{
                                                        boxShadow:
                                                            "0 0 0 4px rgba(0,0,0,.55)",
                                                    }}
                                                />

                                                {decorationUrl && (
                                                    <img
                                                        src={
                                                            decorationUrl
                                                        }
                                                        alt=""
                                                        aria-hidden="true"
                                                        draggable={
                                                            false
                                                        }
                                                        className="absolute pointer-events-none"
                                                        style={{
                                                            width:
                                                                "112px",
                                                            height:
                                                                "112px",
                                                            left:
                                                                `calc(50% + ${lanyardOffsetX}px)`,
                                                            top:
                                                                `calc(50% + ${lanyardOffsetY}px)`,
                                                            transform:
                                                                lanyardTransform,
                                                            transformOrigin:
                                                                "center center",
                                                            objectFit:
                                                                "contain",
                                                            objectPosition:
                                                                "center center",
                                                            maxWidth:
                                                                "none",
                                                            maxHeight:
                                                                "none",
                                                            zIndex: 10,
                                                        }}
                                                    />
                                                )}

                                                {hasLanyard && (
                                                    <span
                                                        className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black/50 z-20"
                                                        style={{
                                                            backgroundColor:
                                                                STATUS_COLORS[
                                                                status
                                                                ],
                                                        }}
                                                    />
                                                )}

                                            </div>
                                        )}

                                    </div>

                                </div>
                            )}

                            {!m.bannerImage && (
                                <div className="flex justify-center mt-3">

                                    {!loaded ? (
                                        <div
                                            className="w-28 h-28 rounded-full bg-white/10 animate-pulse"
                                            style={{
                                                boxShadow:
                                                    "0 0 0 4px rgba(0,0,0,.55)",
                                            }}
                                        />
                                    ) : (
                                        <div className="relative w-28 h-28">

                                            <img
                                                src={
                                                    avatarUrl
                                                }
                                                alt={
                                                    username
                                                }
                                                className="w-28 h-28 rounded-full object-cover"
                                                style={{
                                                    boxShadow:
                                                        "0 0 0 4px rgba(0,0,0,.55)",
                                                }}
                                            />

                                            {decorationUrl && (
                                                <img
                                                    src={
                                                        decorationUrl
                                                    }
                                                    alt=""
                                                    aria-hidden="true"
                                                    draggable={
                                                        false
                                                    }
                                                    className="absolute pointer-events-none"
                                                    style={{
                                                        width:
                                                            "112px",
                                                        height:
                                                            "112px",
                                                        left:
                                                            `calc(50% + ${lanyardOffsetX}px)`,
                                                        top:
                                                            `calc(50% + ${lanyardOffsetY}px)`,
                                                        transform:
                                                            lanyardTransform,
                                                        transformOrigin:
                                                            "center center",
                                                        objectFit:
                                                            "contain",
                                                        objectPosition:
                                                            "center center",
                                                        maxWidth:
                                                            "none",
                                                        maxHeight:
                                                            "none",
                                                        zIndex: 10,
                                                    }}
                                                />
                                            )}

                                            {hasLanyard && (
                                                <span
                                                    className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-black/50 z-20"
                                                    style={{
                                                        backgroundColor:
                                                            STATUS_COLORS[
                                                            status
                                                            ],
                                                    }}
                                                />
                                            )}

                                        </div>
                                    )}

                                </div>
                            )}

                            <div
                                className={`flex flex-col items-center text-center w-full gap-3 ${m.bannerImage
                                    ? "mt-20"
                                    : "mt-8"
                                    }`}
                            >

                                {!loaded ? (
                                    <div className="space-y-2">

                                        <div className="h-6 w-32 bg-white/10 rounded animate-pulse mx-auto" />

                                        <div className="h-3 w-24 bg-white/10 rounded animate-pulse mx-auto" />

                                    </div>
                                ) : (
                                    <div>

                                        <p
                                            className="text-white text-2xl"
                                            style={{
                                                fontFamily:
                                                    "'Cinzel Decorative', serif",
                                                fontWeight:
                                                    700,
                                            }}
                                        >
                                            {
                                                globalName
                                            }
                                        </p>

                                        <p className="text-white/40 font-mono text-sm mt-1">
                                            @{username}
                                        </p>

                                    </div>
                                )}

                                <div className="h-px w-48 bg-white/10" />

                                {bioText.length >
                                    0 && (
                                        <p className="text-white/60 font-mono text-sm leading-relaxed whitespace-pre-line">
                                            {displayed}

                                            {!done && (
                                                <span
                                                    className="inline-block w-0.5 h-4 ml-0.5 animate-pulse align-middle"
                                                    style={{
                                                        backgroundColor:
                                                            buttonColors.panel,
                                                    }}
                                                />
                                            )}
                                        </p>
                                    )}

                                {socials.length >
                                    0 && (
                                        <div className="w-full flex flex-wrap justify-center items-center gap-2.5 mt-2">

                                            {socials.map(
                                                (
                                                    social,
                                                ) => (
                                                    <button
                                                        key={
                                                            social.label
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            openExternal(
                                                                social.url,
                                                            )
                                                        }
                                                        className="member-color-button w-9 h-9 flex items-center justify-center rounded-lg border hover:scale-110"
                                                        style={
                                                            socialButtonStyle
                                                        }
                                                        title={
                                                            social.label
                                                        }
                                                        aria-label={
                                                            social.label
                                                        }
                                                    >
                                                        <SocialIcon
                                                            label={
                                                                social.label
                                                            }
                                                        />
                                                    </button>
                                                ),
                                            )}

                                        </div>
                                    )}

                                {discordLinks.length >
                                    0 && (
                                        <div className="w-full mt-4 pt-5 border-t border-white/[0.05]">

                                            <div className="mb-3 flex items-center justify-center gap-3">

                                                <div
                                                    className="h-px w-8 bg-gradient-to-r from-transparent"
                                                    style={{
                                                        backgroundImage:
                                                            `linear-gradient(to right, transparent, ${buttonColors.discord}80)`,
                                                    }}
                                                />

                                                <div
                                                    className="h-px w-8 bg-gradient-to-l from-transparent"
                                                    style={{
                                                        backgroundImage:
                                                            `linear-gradient(to left, transparent, ${buttonColors.discord}80)`,
                                                    }}
                                                />

                                            </div>

                                            <div className="w-full flex flex-wrap justify-center gap-2">

                                                {discordLinks.map(
                                                    (
                                                        link,
                                                        index,
                                                    ) => (
                                                        <button
                                                            key={`${link.url}-${index}`}
                                                            type="button"
                                                            onClick={() =>
                                                                openExternal(
                                                                    link.url,
                                                                )
                                                            }
                                                            className="block w-[calc((100%-1rem)/3)] min-w-[100px] h-[74px] overflow-hidden rounded-lg transition-all hover:scale-[1.03] cursor-pointer"
                                                            style={{
                                                                backgroundImage:
                                                                    `linear-gradient(${buttonColors.discord}2E,rgba(0,0,0,.42)),url(${link.banner})`,
                                                                backgroundSize:
                                                                    "cover",
                                                                backgroundPosition:
                                                                    "center",
                                                                border:
                                                                    `1px solid ${buttonColors.discord}73`,
                                                                boxShadow:
                                                                    `0 0 16px ${buttonColors.discord}29`,
                                                            }}
                                                            aria-label="Join Discord"
                                                        />
                                                    ),
                                                )}

                                            </div>

                                        </div>
                                    )}

                            </div>

                        </main>

                        {/* ======================================================= */}
                        {/* AFFILIATES                                              */}
                        {/* ======================================================= */}

                        <aside
                            className="side-panel side-panel-right mx-auto rounded-2xl border bg-black/35 backdrop-blur-md overflow-hidden xl:sticky xl:top-6"
                            style={
                                panelStyle
                            }
                        >

                            <div className="h-full flex flex-col items-center text-center">

                                {/* Header */}
                                <div
                                    className="h-[54px] w-full px-4 flex items-center justify-center border-b flex-shrink-0"
                                    style={{
                                        borderColor:
                                            "var(--panel-header-border)",
                                    }}
                                >

                                    <div className="flex items-center justify-center gap-2">

                                        <span className="member-panel-dot w-1.5 h-1.5 rounded-full" />

                                        <span className="member-panel-color font-mono text-[10px] uppercase tracking-[0.28em]">
                                            WEBSITES
                                        </span>

                                        <span
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{
                                                background:
                                                    "var(--panel-dot-soft)",
                                            }}
                                        />

                                    </div>

                                </div>

                                {/* Scrollable affiliates */}
                                <div className="affiliate-scroll flex-1 overflow-y-auto w-full p-4">

                                    {affiliates.length ===
                                        0 && (
                                            <div className="h-full flex items-center justify-center">

                                                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/15">
                                                    no affiliates
                                                </span>

                                            </div>
                                        )}

                                    <div className="space-y-3">

                                        {affiliates.map(
                                            (
                                                affiliate,
                                                index,
                                            ) => (
                                                <button
                                                    key={`${affiliate.url}-${index}`}
                                                    type="button"
                                                    onClick={() =>
                                                        openExternal(
                                                            affiliate.url,
                                                        )
                                                    }
                                                    className="group relative w-full h-[100px] block rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                                                    aria-label={`Open ${affiliate.name ?? "Affiliate"}`}
                                                    title={
                                                        affiliate.name ??
                                                        "Affiliate"
                                                    }
                                                >

                                                    <img
                                                        src={
                                                            affiliate.banner
                                                        }
                                                        alt=""
                                                        draggable={
                                                            false
                                                        }
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />

                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:bg-black/10 transition-all duration-200" />

                                                    <div className="absolute inset-x-2 bottom-2 flex justify-center">

                                                        <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/75 text-center">
                                                            {
                                                                affiliate.name ??
                                                                "Affiliate"
                                                            }
                                                        </span>

                                                    </div>

                                                    <div
                                                        className="absolute inset-0 rounded-xl pointer-events-none"
                                                        style={{
                                                            border:
                                                                "1px solid var(--panel-affiliate-border)",
                                                            boxShadow:
                                                                "0 0 16px var(--panel-affiliate-glow)",
                                                        }}
                                                    />

                                                </button>
                                            ),
                                        )}

                                    </div>

                                </div>

                            </div>
                        </aside>

                    </div>

                </div>
            )}
        </div>
    );
}