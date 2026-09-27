/* ═══════════════════════════════════════════════════════════════════════
   DIVINEBLOOD — MEMBER CONFIG
   ═══════════════════════════════════════════════════════════════════════

   HOW TO ADD A NEW MEMBER:
   1. Copy one block below (from { to },)
   2. Paste it at the end of the right group
   3. Change: key, discordId, name, bio, music, socials
   4. Put banner.jpg and bg.gif in public/<key>/
   5. The home card and page at /key are automatic — done!

   BUTTON / PANEL COLORS:
   Each personal page can customize:

     social = Instagram / TikTok / YouTube / etc.
     discord = Discord server banner buttons
     panel  = Music + Websites side panels

   Example:

   buttonColors: {
       social: "#a855f7",
       discord: "#a855f7",
       panel: "#a855f7",
   },

   If buttonColors is not added, the default color is red.

   ═══════════════════════════════════════════════════════════════════════ */

export type MemberConfig = {
    key: string;
    discordId: string;
    group?: "FOUNDER" | "COF" | "FAME" | "DIVINEBLOOD";
    hasPage?: boolean;

    name?: string;
    bio?: string;
    music?: string | null;

    bannerImage?: string;
    backgroundImage?: string;
    backgroundOverlay?: number;

    socials?: {
        label: string;
        url: string;
    }[];

    affiliates?: {
        name: string;
        url: string;
        banner: string;
    }[];

    // Custom colors for THIS personal page.
    //
    // social  = social media buttons
    // discord = Discord server banner buttons
    // panel   = Music + Websites side panels
    //
    // Use HEX colors:
    // "#cc2222"
    // "#a855f7"
    // "#3b82f6"
    // "#22c55e"
    buttonColors?: {
        social?: string;
        discord?: string;
        panel?: string;
    };

    // Up to 3 Discord banner buttons.
    // If url is empty, that banner is hidden.
    discordLinks?: {
        banner: string;
        url: string;
    }[];
};

export const members: MemberConfig[] = [

    // ── FOUNDER ──────────────────────────────────────────────────────────────

    {
        key: "krammy",
        discordId: "1448074479510097960",
        group: "FOUNDER",

        name: "Krammy",
        bio: "High Authority",
        music: "https://youtu.be/Zzl20a6AmRE?si=X8tfUQCpJ-nHBYM_",

        bannerImage: "/krammy/banner.gif",
        backgroundImage: "/krammy/bg.gif",
        backgroundOverlay: 0.55,

        buttonColors: {
            social: "#cc2222",
            discord: "#cc2222",
            panel: "#cc2222",
        },

        socials: [
            {
                label: "instagram",
                url: "https://www.instagram.com/lvr.krammy?igsh=MWhsNnBsZ3QzNTliaw%3D%3D&utm_source=qr",
            },
        ],

        discordLinks: [
            {
                banner: "/krammy/1.gif",
                url: "https://discord.com/invite/DcpkUxeue4",
            },
            {
                banner: "/krammy/2.jpg",
                url: "https://discord.gg/revshit",
            },
            {
                banner: "/krammy/3.gif",
                url: "https://discord.gg/xenial",
            },
        ],

        affiliates: [
            {
                name: "",
                url: "https://www.helloxorev.com/",
                banner: "/krammy/xorev.png",
            },
            {
                name: "",
                url: "https://revgng.org/",
                banner: "/krammy/revshit.png",
            },
            {
                name: "",
                url: "https://krammy.world/",
                banner: "/krammy/krammy.png",
            },
        ],
    },

    // ── COF ──────────────────────────────────────────────────────────────

       {
        key: "ash",
        discordId: "1507628998665048175",
        group: "COF",

        name: "Ash",
        bio: "08",
        music: "https://www.youtube.com/watch?v=GHEx6uCO80w",

        bannerImage: "/ash/banner.jpg",
        backgroundImage: "/ash/bg.gif",
        backgroundOverlay: 0.25,

        buttonColors: {
            social: "#FFD1DC",
            discord: "#FFD1DC",
            panel: "#FFD1DC",
        },

        socials: [
            {
                label: "instagram",
                url: "https://www.instagram.com/ashttractive/",
            },
        ],

        affiliates: [
            {
                name: "",
                url: "https://www.helloxorev.com/",
                banner: "/krammy/xorev.png",
            },
            {
                name: "",
                url: "https://revgng.org/",
                banner: "/krammy/revshit.png",
            },
        ],
    },

    {
        key: "member-1",
        discordId: "1491058480302526637",
        group: "COF",
        hasPage: false,
    },
   
    // ── FAME ──────────────────────────────────────────────────────────────
   
    {
        key: "winho",
        discordId: "1036850037579329536",
        group: "FAME",

        name: "WINHO",
        bio: "Built in Silence.",
        music: "https://music.youtube.com/watch?v=t8biySOdzK8",

        bannerImage: "/winho/banner.gif",
        backgroundImage: "/winho/bg.gif",
        backgroundOverlay: 0.55,

        buttonColors: {
            social: "#FFFFFF",
            discord: "#FFFFFF",
            panel: "#FFFFFF",
        },

        socials: [
            {
                label: "instagram",
                url: "https://www.instagram.com/wincurse?igsi=azVidm83ZmluODhu&utm_source=qr",
            },
            {
                label: "tiktok",
                url: "https://www.tiktok.com/@wnhocurse_?_r=1&_t=ZS-99FAf0aXYTB",
            },
        ],

        discordLinks: [
            {
                banner: "/winho/hhail.jpg",
                url: "https://discord.gg/PTB4du9nF",
            },
            {
                banner: "/winho/revshit.gif",
                url: "https://discord.gg/revshit",
            },
            {
                banner: "/winho/xorev.png",
                url: "https://discord.gg/xorev",
            },
        ],

        affiliates: [
            {
                name: "",
                url: "https://www.helloxorev.com/",
                banner: "/krammy/xorev.png",
            },
            {
                name: "",
                url: "https://revgng.org/",
                banner: "/krammy/revshit.png",
            },
        ],
    },
    {
        key: "ly",
        discordId: "879366945957347328",
        group: "FAME",

        name: "ly",
        bio: "i ought to be thy adam, but rather be the fallen angel",
        music: "https://youtu.be/UzN9Hlkd43E?si=dPc90q99AiM2tqbZ",

        bannerImage: "/ly/banner.gif",
        backgroundImage: "/ly/bg.gif",
        backgroundOverlay: 0.55,

        buttonColors: {
            social: "#301934",
            discord: "#301934",
            panel: "#301934",
        },

        socials: [],

        discordLinks: [
            {
                banner: "/ly/1.png",
                url: "https://discord.gg/s4kNwj2Tj",
            },
            {
                banner: "/ly/2.png",
                url: "https://discord.gg/revshit",
            },
            {
                banner: "/ly/3.png",
                url: "https://discord.gg/aknem",
            },
        ],

        affiliates: [
            {
                name: "",
                url: "https://1738wrldwide.xo.je/",
                banner: "/ly/1738.png",
            },
            {
                name: "",
                url: "https://guns.lol/i7xne",
                banner: "/ly/guns.jpg",
            },
            {
                name: "",
                url: "https://amiri.cash/",
                banner: "/ly/amiri.jpg",
            },
        ],
    },
    {
        key: "member-3",
        discordId: "1439556646966923317",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "member-4",
        discordId: "885505939338305556",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "member-5",
        discordId: "907840966340268083",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "member-6",
        discordId: "901367147215851571",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "aisha",
        discordId: "1460080900405727492",
        group: "FAME",

        name: "aisha",
        bio: "evolving not competing dm Moko baby",
        music: "https://youtu.be/UoPd8mFDJjo?si=8TSLt_UVUG91tv_G",

        bannerImage: "",
        backgroundImage: "/aisha/bg.gif",
        backgroundOverlay: 0.55,

        buttonColors: {
            social: "#cc2222",
            discord: "#cc2222",
            panel: "#cc2222",
        },

        socials: [],

        discordLinks: [
            {
                banner: "/aisha/1.gif",
                url: "https://discord.gg/TMTsav37dR",
            },
            {
                banner: "/aisha/2.jpg",
                url: "https://discord.gg/V6QkCuvvwy",
            },
            {
                banner: "/aisha/3.png",
                url: "https://discord.gg/PpnqjXcxNQ",
            },
        ],

        affiliates: [
            {
                name: "",
                url: "https://1738wrldwide.xo.je/",
                banner: "/ly/1738.png",
            },
            {
                name: "",
                url: "https://www.helloxorev.com/",
                banner: "/krammy/xorev.png",
            },
            {
                name: "",
                url: "https://revgng.org/",
                banner: "/krammy/revshit.png",
            },
        ],
    },
    {
        key: "member-8",
        discordId: "912130312442613801",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "member-9",
        discordId: "975452689901162617",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "member-10",
        discordId: "1410637313167593636",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "member-11",
        discordId: "731062259832455178",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "member-12",
        discordId: "1498182038342336542",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "member-13",
        discordId: "1345256472891883613",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "member-14",
        discordId: "1447408955495026792",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "member-15",
        discordId: "965808154824822834",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "member-16",
        discordId: "929027870674792460",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "member-17",
        discordId: "1361012595561205951",
        group: "FAME",
        hasPage: false,
    },

    // ── DIVINEBLOOD ──────────────────────────────────────────────────────────────

    {
        key: "agatha",
        discordId: "1231942433970061376",
        group: "DIVINEBLOOD",

        name: "Agatha",
        bio: "memento vivere",
        music: "https://youtu.be/Km__cJEJ3JI",

        bannerImage: "/agatha/banner.gif",
        backgroundImage: "/agatha/bg.gif",
        backgroundOverlay: 0.45,

        buttonColors: {
            social: "#FFB6C1",
            discord: "#FFB6C1",
            panel: "#FFB6C1",
        },

        socials: [
            {
                label: "instagram",
                url: "https://www.instagram.com/luvlie.clare/",
            },
            {
                label: "tiktok",
                url: "https://www.tiktok.com/@babydendeni?_r=1&_t=ZS-99Eyz6FXza0",
            },
        ],

        affiliates: [
            {
                name: "",
                url: "https://www.helloxorev.com/",
                banner: "/krammy/xorev.png",
            },
            {
                name: "",
                url: "https://revgng.org/",
                banner: "/krammy/revshit.png",
            },
        ],  
    },
];

// ── Helpers ────────────────────────────────────────────────────────────

export const founder = members.filter(
    (m) => m.group === "FOUNDER",
);

export const cof = members.filter(
    (m) => m.group === "COF",
);

export const fame = members.filter(
    (m) => m.group === "FAME",
);

export const divineblood = members.filter(
    (m) => m.group === "DIVINEBLOOD",
);

export const withPages = members.filter(
    (m) => m.hasPage !== false,
);
