import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { founder, cofounder, fame, divineblood, type MemberConfig } from "@/members";

// ── Server invite links ─────────────────────────────────────────────────
const SERVER_LINKS = {
    DIVINEBLOOD: "",
} as const;

// ── Home page music ────────────────────────────────────────────────────
// Change this YouTube link to change the home page song.
const HOME_MUSIC =
    "https://youtu.be/GtK49lys_BU?si=UZTIbug7htjijDXM";

// ── Intro GIF ──────────────────────────────────────────────────────────
// Put the file at: public/assets/intro.gif
const INTRO_GIF = "/assets/intro.gif";

// ── Intro timing ───────────────────────────────────────────────────────
// How long the GIF stays on screen before fading out.
const INTRO_GIF_DURATION = 2500;

// How long the GIF fade-out lasts.
const INTRO_GIF_FADE = 700;

const ASCII_ART = `▓█████▄  ██▓ ██▒   █▓ ██▓ ███▄    █ ▓█████  ▄▄▄▄    ██▓     ▒█████   ▒█████  ▓█████▄ 
▒██▀ ██▌▓██▒▓██░   █▒▓██▒ ██ ▀█   █ ▓█   ▀ ▓█████▄ ▓██▒    ▒██▒  ██▒▒██▒  ██▒▒██▀ ██▌
░██   █▌▒██▒ ▓██  █▒░▒██▒▓██  ▀█ ██▒▒███   ▒██░ ▒██▒░██    ▒██░  ██▒▒██░  ██▒░██   █▌
░▓█▄   ▌░██░  ▒██ █░░░██░▓██▒  ▐▌██▒▒▓█  ▄ ▒██░█▀  ▒██░    ▒██   ██░▒██   ██░░▓█▄   ▌
░▒████▓ ░██░   ▒▀█░  ░██░▒██░   ▓██░░▒████▒░▓█  ▀█▓░██████▒░ ████▓▒░░ ████▓▒░░▒████▓ 
 ▒▒▓  ▒ ░▓     ░ ▐░  ░▓  ░ ▒░   ▒ ▒ ░░ ▒░ ░░▒▓███▀▒░ ▒░▓  ░░ ▒░▒░▒░ ░ ▒░▒░▒░  ▒▒▓  ▒
 ░ ▒  ▒  ▒ ░   ░ ░░   ▒ ░░ ░░   ░ ▒░ ░ ░  ░▒░▒   ░ ░ ░ ▒  ░  ░ ▒ ▒░   ░ ▒ ▒░  ░ ▒  ▒
 ░ ░  ░  ▒ ░     ░░   ▒ ░   ░   ░ ░    ░    ░   ░    ░ ░   ░ ░ ░ ▒  ░ ░ ░ ▒   ░ ░  ░
   ░     ░        ░   ░           ░    ░  ░ ░          ░  ░    ░ ░      ░ ░     ░     
 ░               ░                                ░                              ░    `;

type DiscordStatus =
    | "online"
    | "idle"
    | "dnd"
    | "offline";

interface LanyardData {
    discord_user: {
        username: string;
        discriminator: string;
        avatar: string | null;
        global_name: string | null;
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
        id: string | null;
        link: string;
        is_animated: boolean;
    } | null;
}

interface ProfileCard {
    lanyardData: LanyardData | null;
    fallbackData: FallbackUser | null;
    loaded: boolean;
    error: boolean;
}

function getAvatarUrl(
    userId: string,
    avatarHash: string | null,
) {
    if (!avatarHash) {
        const defaultAvatar = Number(
            BigInt(userId) % 6n,
        );

        return `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
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

const sleep = (ms: number) =>
    new Promise((resolve) =>
        setTimeout(resolve, ms),
    );

async function fetchWithTimeout(
    url: string,
    ms = 6000,
) {
    const controller =
        new AbortController();

    const timer = setTimeout(
        () => controller.abort(),
        ms,
    );

    try {
        return await fetch(url, {
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timer);
    }
}

async function fetchProfile(
    discordId: string,
): Promise<ProfileCard> {
    try {
        const res =
            await fetchWithTimeout(
                `https://api.lanyard.rest/v1/users/${discordId}`,
            );

        const json =
            await res.json();

        if (json.success) {
            return {
                lanyardData:
                    json.data,
                fallbackData: null,
                loaded: true,
                error: false,
            };
        }
    } catch { }

    for (
        let attempt = 0;
        attempt < 4;
        attempt++
    ) {
        try {
            const res =
                await fetchWithTimeout(
                    `https://japi.rest/discord/v1/user/${discordId}`,
                );

            if (res.ok) {
                const json =
                    await res.json();

                const d =
                    json?.data;

                if (d?.id) {
                    const fallbackData:
                        FallbackUser = {
                        id: d.id,
                        username:
                            d.username ??
                            "unknown",
                        global_name:
                            d.global_name ??
                            null,
                        avatar: d.avatar
                            ? {
                                id: d.avatar,
                                link: getAvatarUrl(
                                    d.id,
                                    d.avatar,
                                ),
                                is_animated:
                                    String(
                                        d.avatar,
                                    ).startsWith(
                                        "a_",
                                    ),
                            }
                            : null,
                    };

                    return {
                        lanyardData: null,
                        fallbackData,
                        loaded: true,
                        error: false,
                    };
                }
            }
        } catch { }

        try {
            const res =
                await fetchWithTimeout(
                    `https://discordlookup.mesalytic.moe/v1/user/${discordId}`,
                );

            if (res.ok) {
                const data:
                    FallbackUser =
                    await res.json();

                return {
                    lanyardData: null,
                    fallbackData: data,
                    loaded: true,
                    error: false,
                };
            }
        } catch { }

        if (attempt < 3) {
            await sleep(
                600 *
                (attempt + 1) +
                Math.random() * 400,
            );
        }
    }

    return {
        lanyardData: null,
        fallbackData: null,
        loaded: true,
        error: true,
    };
}

function getYouTubeId(
    url: string,
): string | null {
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

        return (
            parsed.searchParams.get("v")
        );
    } catch {
        return null;
    }
}

function MemberCard({
    member,
    index = 0,
}: {
    member: MemberConfig;
    index?: number;
}) {
    const [, navigate] =
        useLocation();

    const [
        profile,
        setProfile,
    ] = useState<ProfileCard>({
        lanyardData: null,
        fallbackData: null,
        loaded: false,
        error: false,
    });

    useEffect(() => {
        let alive = true;

        const timer =
            setTimeout(() => {
                fetchProfile(
                    member.discordId,
                ).then((p) => {
                    if (alive) {
                        setProfile(p);
                    }
                });
            }, index * 180);

        return () => {
            alive = false;
            clearTimeout(timer);
        };
    }, [
        member.discordId,
        index,
    ]);

    const user =
        profile.lanyardData
            ?.discord_user ??
        null;

    const fallback =
        profile.fallbackData;

    const avatarUrl = user
        ? getAvatarUrl(
            user.id,
            user.avatar,
        )
        : fallback?.avatar?.link ??
        getAvatarUrl(
            member.discordId,
            null,
        );

    const decorationUrl =
        user
            ? getDecorationUrl(
                user
                    .avatar_decoration_data
                    ?.asset,
            )
            : null;

    const username =
        user?.username ??
        fallback?.username ??
        "unknown";

    const globalName =
        user?.global_name ??
        fallback?.global_name ??
        username;

    const hasRoute =
        member.hasPage !== false;

    const cardBody = (
        <div
            className={`w-32 sm:w-36 lg:w-40 text-center transition-all duration-200 ${hasRoute
                ? "group-hover:-translate-y-1 cursor-pointer"
                : ""
                }`}
        >
            <div className="flex justify-center">
                {!profile.loaded ? (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-muted animate-pulse" />
                ) : (
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-40 lg:h-40 flex items-center justify-center">

                        <img
                            src={avatarUrl}
                            alt={username}
                            className="w-24 h-24 sm:w-28 sm:h-28 lg:w-40 lg:h-40 rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />

                        {decorationUrl && (
                            <img
                                key={decorationUrl}
                                src={decorationUrl}
                                alt=""
                                aria-hidden="true"
                                draggable={false}
                                className="absolute pointer-events-none"
                                style={{
                                    width: "90%",
                                    height: "90%",
                                    left: "50%",
                                    top: "50%",
                                    transform:
                                        "translate(-50%, -50%) scale(1.3)",
                                    objectFit:
                                        "contain",
                                    zIndex: 10,
                                }}
                            />
                        )}
                    </div>
                )}
            </div>

            <div className="pt-3 text-center">
                {!profile.loaded ? (
                    <div className="space-y-1.5 flex flex-col items-center">
                        <div className="h-4 bg-muted rounded animate-pulse w-24" />
                        <div className="h-3 bg-muted rounded animate-pulse w-16" />
                    </div>
                ) : (
                    <>
                        <p className="text-foreground font-bold text-base leading-tight truncate">
                            {globalName}
                        </p>

                        <p className="mt-1 text-muted-foreground font-mono text-xs truncate">
                            @{username}
                        </p>
                    </>
                )}
            </div>
        </div>
    );

    if (!hasRoute) {
        return cardBody;
    }

    return (
        <div
            onClick={() =>
                navigate(
                    `/${member.key}`,
                )
            }
            onKeyDown={(e) => {
                if (
                    e.key ===
                    "Enter" ||
                    e.key === " "
                ) {
                    e.preventDefault();

                    navigate(
                        `/${member.key}`,
                    );
                }
            }}
            className="block group cursor-pointer"
            role="link"
            tabIndex={0}
        >
            {cardBody}
        </div>
    );
}

function Section({
    title,
    members,
    startIndex,
    serverLink,
}: {
    title: string;
    members: MemberConfig[];
    startIndex: number;
    serverLink?: string | null;
}) {
    const [
        ,
        navigate,
    ] = useLocation();

    const openExternal =
        (url: string) => {
            window.open(
                url,
                "_blank",
                "noopener,noreferrer",
            );
        };

    return (
        <section className="flex flex-col items-center pb-16 px-4 fade-in-delay">
            <div className="mb-10 text-center">
                <h2
                    className="font-mono text-[clamp(18px,3vw,32px)] tracking-[0.5em] text-red-700 uppercase"
                    style={{
                        textShadow:
                            "0 0 6px rgba(248, 113, 113, 0.42), 0 0 18px rgba(220, 38, 38, 0.38), 0 0 38px rgba(153, 27, 27, 0.3)",
                    }}
                >
                    ▸ {title} ◂
                </h2>

                <div className="mt-1 h-px w-48 mx-auto bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />

                {serverLink && (
                    <button
                        type="button"
                        onClick={() =>
                            openExternal(
                                serverLink,
                            )
                        }
                        className="inline-flex items-center gap-2 mt-4 px-5 py-1.5 rounded-full border border-red-800/60 bg-red-950/30 text-red-400 font-mono text-xs tracking-widest uppercase hover:bg-red-900/40 hover:border-red-600/80 hover:text-red-300 transition-all duration-200 cursor-pointer"
                        style={{
                            textShadow:
                                "0 0 8px rgba(248, 113, 113, 0.4)",
                            boxShadow:
                                "0 0 12px rgba(185, 28, 28, 0.16), inset 0 0 12px rgba(185, 28, 28, 0.06)",
                        }}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.135 18.113a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                        </svg>

                        Join Server
                    </button>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full max-w-4xl mx-auto">
                {members.map(
                    (m, i) => (
                        <div
                            key={m.key}
                            className="w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] flex justify-center"
                        >
                            <MemberCard
                                member={m}
                                index={
                                    startIndex + i
                                }
                            />
                        </div>
                    ),
                )}
            </div>
        </section>
    );
}

export default function Home() {
    const [
        introStage,
        setIntroStage,
    ] = useState<
        "entry" |
        "gif" |
        "fadeout" |
        "done"
    >("entry");

    const homeMusicRef =
        useRef<HTMLIFrameElement | null>(
            null,
        );

    useEffect(() => {
        let animationFrame = 0;
        let direction = 0;
        let activeUntil = 0;
        let lastFrame = 0;
        let currentSpeed = 0;
        let targetSpeed = 0;

        const speed = 3000;
        const idleGracePeriod = 100;

        const animateWheelScroll = (
            timestamp: number,
        ) => {
            if (!lastFrame) {
                lastFrame = timestamp;
            }

            const elapsed =
                Math.min(
                    timestamp -
                    lastFrame,
                    32,
                );

            lastFrame =
                timestamp;

            if (
                timestamp >=
                activeUntil
            ) {
                targetSpeed = 0;
            }

            currentSpeed +=
                (targetSpeed -
                    currentSpeed) *
                0.08;

            if (
                Math.abs(
                    currentSpeed,
                ) < 1 &&
                targetSpeed === 0
            ) {
                animationFrame = 0;
                lastFrame = 0;
                currentSpeed = 0;
                direction = 0;
                return;
            }

            const maxScroll =
                Math.max(
                    0,
                    document.documentElement
                        .scrollHeight -
                    window.innerHeight,
                );

            const nextScroll =
                Math.max(
                    0,
                    Math.min(
                        maxScroll,
                        window.scrollY +
                        currentSpeed *
                        (elapsed /
                            1000),
                    ),
                );

            window.scrollTo({
                top: nextScroll,
                behavior: "auto",
            });

            animationFrame =
                requestAnimationFrame(
                    animateWheelScroll,
                );
        };

        const handleWheel = (
            event: WheelEvent,
        ) => {
            if (
                event.ctrlKey ||
                event.shiftKey ||
                event.deltaY === 0
            ) {
                return;
            }

            event.preventDefault();

            direction =
                Math.sign(
                    event.deltaY,
                );

            targetSpeed =
                direction * speed;

            activeUntil =
                performance.now() +
                idleGracePeriod;

            if (
                !animationFrame
            ) {
                lastFrame = 0;

                animationFrame =
                    requestAnimationFrame(
                        animateWheelScroll,
                    );
            }
        };

        window.addEventListener(
            "wheel",
            handleWheel,
            {
                passive: false,
            },
        );

        return () => {
            window.removeEventListener(
                "wheel",
                handleWheel,
            );

            if (
                animationFrame
            ) {
                cancelAnimationFrame(
                    animationFrame,
                );
            }
        };
    }, []);

    function startHomeMusic() {
        const frame =
            homeMusicRef.current;

        const youtubeId =
            getYouTubeId(
                HOME_MUSIC,
            );

        if (
            !frame?.contentWindow ||
            !youtubeId
        ) {
            return;
        }

        const play =
            () => {
                try {
                    frame.contentWindow?.postMessage(
                        JSON.stringify({
                            event:
                                "command",
                            func:
                                "unMute",
                            args: [],
                        }),
                        "*",
                    );

                    frame.contentWindow?.postMessage(
                        JSON.stringify({
                            event:
                                "command",
                            func:
                                "playVideo",
                            args: [],
                        }),
                        "*",
                    );
                } catch {
                    // Ignore.
                }
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
    }

    function enterHome() {
        if (
            introStage !==
            "entry"
        ) {
            return;
        }

        // Music stays stopped during the intro.
        setIntroStage(
            "gif",
        );

        window.setTimeout(
            () => {
                setIntroStage(
                    "fadeout",
                );
            },
            INTRO_GIF_DURATION,
        );

        window.setTimeout(
            () => {
                // GIF + fade are completely finished.
                startHomeMusic();

                setIntroStage(
                    "done",
                );
            },
            INTRO_GIF_DURATION +
            INTRO_GIF_FADE,
        );
    }

    const homeVisible =
        introStage === "done";

    const youtubeId =
        getYouTubeId(
            HOME_MUSIC,
        );

    return (
        <div className="min-h-screen bg-transparent grid-bg scanline-overlay relative isolate overflow-x-hidden scroll-smooth">

            <style>{`
        html,
        body,
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        *::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }

        @keyframes homeIntroFlicker {
          0%, 100% {
            opacity: 1;
          }

          91% {
            opacity: 1;
          }

          92% {
            opacity: .78;
          }

          93% {
            opacity: 1;
          }

          96% {
            opacity: .9;
          }

          97% {
            opacity: 1;
          }
        }

        @keyframes homeIntroGlow {
          0%, 100% {
            transform: scale(.96);
            opacity: .3;
          }

          50% {
            transform: scale(1.04);
            opacity: .65;
          }
        }

        @keyframes homeIntroLine {
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

        @keyframes homeGifEnter {
          0% {
            opacity: 0;
            filter: blur(18px);
            transform: scale(1.03);
          }

          100% {
            opacity: 1;
            filter: blur(0);
            transform: scale(1);
          }
        }

        @keyframes homeGifFadeOut {
          0% {
            opacity: 1;
            filter: blur(0);
          }

          45% {
            opacity: .75;
            filter: blur(4px);
          }

          75% {
            opacity: .25;
            filter: blur(10px);
          }

          100% {
            opacity: 0;
            filter: blur(18px);
          }
        }

        .home-intro-gif {
          animation:
            homeGifEnter
            .7s
            cubic-bezier(.16, 1, .3, 1)
            forwards;
        }

        .home-intro-gif-fadeout {
          animation:
            homeGifFadeOut
            ${INTRO_GIF_FADE / 1000}s
            ease
            forwards;
        }
      `}</style>

            <div
                className="fixed inset-0 -z-20 pointer-events-none"
                style={{
                    backgroundColor:
                        "#050106",
                }}
                aria-hidden="true"
            />

            <div
                className="fixed inset-0 -z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(52, 0, 8, 0.92) 0%, rgba(37, 0, 8, 0.8) 23%, rgba(18, 2, 7, 0.9) 48%, rgba(6, 3, 8, 0.98) 75%, rgba(2, 2, 5, 1) 100%)",
                }}
                aria-hidden="true"
            />

            <div
                className="fixed inset-0 -z-10 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at 50% 0%, rgba(190, 20, 42, 0.1), transparent 34%), radial-gradient(circle at 50% 45%, rgba(100, 0, 18, 0.06), transparent 52%)",
                }}
                aria-hidden="true"
            />

            {youtubeId && (
                <iframe
                    ref={
                        homeMusicRef
                    }
                    title="homepage music"
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&playsinline=1&enablejsapi=1&controls=0&loop=1&playlist=${youtubeId}&rel=0&modestbranding=1`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={{
                        position: "fixed",
                        width: "1px",
                        height: "1px",
                        left: "-10px",
                        bottom: "0",
                        opacity: 0.01,
                        pointerEvents:
                            "none",
                        border: 0,
                    }}
                />
            )}

            {homeVisible && (
                <>
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-red-700 to-transparent" />

                    <section className="flex flex-col items-center justify-center pt-16 pb-8 px-4 fade-in">
                        <div className="w-full overflow-x-auto flex justify-center">
                            <pre
                                className="ascii-art font-mono text-[clamp(4px,1.1vw,13px)] leading-tight select-none whitespace-pre mx-auto"
                                aria-label="DIVINEBLOOD"
                                style={{
                                    textShadow:
                                        "0 0 8px rgba(190, 20, 42, 0.28), 0 0 28px rgba(120, 18, 28, 0.2)",
                                }}
                            >
                                {ASCII_ART}
                            </pre>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-800" />

                            <span className="text-red-700/60 font-mono text-xs tracking-[0.3em] uppercase">
                                divineblood.xyz
                            </span>

                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-800" />
                        </div>
                    </section>

                    <Section
                        title="FOUNDER"
                        members={founder}
                        startIndex={0}   
                    />
                    
                    <Section
                        title="COFOUNDER"
                        members={cofounder}
                        startIndex={
                             founder.length
                        }
                    />    
                    
                    <Section
                        title="FAME"
                        members={fame}
                        startIndex={
                            cofounder.length
                        }
                    />

                    <Section
                        title="DIVINEBLOOD"
                        members={divineblood}
                        startIndex={
                            fame.length
                        }
                    />

                    <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent pointer-events-none" />
                </>
            )}

            {!homeVisible && (
                <div className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden bg-black">

                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(circle at center, rgba(150, 0, 20, 0.12), transparent 48%), radial-gradient(circle at center, transparent 35%, rgba(0,0,0,.75) 100%)",
                        }}
                    />

                    <div
                        className="absolute inset-0 pointer-events-none opacity-30"
                        style={{
                            background:
                                "repeating-linear-gradient(0deg, rgba(190,20,42,.035) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(190,20,42,.02) 0 1px, transparent 1px 5px)",
                        }}
                    />

                    {introStage ===
                        "entry" && (
                            <button
                                type="button"
                                onClick={
                                    enterHome
                                }
                                className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center cursor-pointer bg-transparent border-0"
                                aria-label="Click to enter DivineBlood"
                            >
                                <div className="w-full flex flex-col items-center justify-center">

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
                                                    "radial-gradient(circle, rgba(190,20,42,.18), rgba(120,18,28,.06) 35%, transparent 70%)",
                                                filter:
                                                    "blur(35px)",
                                                animation:
                                                    "homeIntroGlow 3.2s ease-in-out infinite",
                                            }}
                                        />

                                        <pre
                                            className="ascii-art relative select-none whitespace-pre font-mono text-[clamp(4px,1vw,12px)] leading-[1.01] mx-auto"
                                            style={{
                                                color:
                                                    "#cc2222",
                                                textShadow:
                                                    "0 0 8px rgba(200,30,30,.75), 0 0 22px rgba(180,20,20,.48), 0 0 42px rgba(120,18,28,.25)",
                                                animation:
                                                    "homeIntroFlicker 8s infinite",
                                            }}
                                        >
                                            {ASCII_ART}
                                        </pre>
                                    </div>

                                    <div className="mt-7 flex flex-col items-center gap-3">

                                        <div
                                            className="h-px w-40 bg-gradient-to-r from-transparent via-red-800 to-transparent"
                                            style={{
                                                animation:
                                                    "homeIntroLine 2.4s ease-in-out infinite",
                                            }}
                                        />

                                        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/20">
                                            founded by krammy
                                        </div>

                                    </div>
                                </div>
                            </button>
                        )}

                    {(
                        introStage ===
                        "gif" ||
                        introStage ===
                        "fadeout"
                    ) && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">

                                <img
                                    key={
                                        INTRO_GIF
                                    }
                                    src={
                                        INTRO_GIF
                                    }
                                    alt=""
                                    draggable={
                                        false
                                    }
                                    className={`w-full h-full object-cover ${introStage ===
                                        "fadeout"
                                        ? "home-intro-gif home-intro-gif-fadeout"
                                        : "home-intro-gif"
                                        }`}
                                />

                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background:
                                            "radial-gradient(circle at center, transparent 18%, rgba(0,0,0,.2) 55%, rgba(0,0,0,.75) 100%)",
                                    }}
                                />

                                <div
                                    className="absolute inset-0 pointer-events-none opacity-20"
                                    style={{
                                        background:
                                            "repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,.06) 2px 4px)",
                                    }}
                                />

                            </div>
                        )}

                </div>
            )}
        </div>
    );
}
