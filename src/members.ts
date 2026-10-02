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
    {
        key: "demz",
        discordId: "1554294515748306966",
        group: "FOUNDER",

        name: "Demz",
        bio: "my crows are watching.",
        music: "https://www.youtube.com/watch?v=sElE_BfQ67s",

        bannerImage: "",
        backgroundImage: "/demz/bg.gif",
        backgroundOverlay: 0.55,

        buttonColors: {
            social: "#000000",
            discord: "#000000",
            panel: "#000000",
        },

        socials: [],

        discordLinks: [],

        affiliates: [
            {
                name: "",
                url: "https://www.helloxorev.com/",
                banner: "/demz/xorev.png",
            },
            {
                name: "",
                url: "https://revgng.org/",
                banner: "/demz/revshit.png",
            },
            {
                name: "",
                url: "https://krammy.world/",
                banner: "/demz/krammy.png",
            },
        ],
    },
    {
        key: "nate",
        discordId: "1455803188723843225",
        group: "FOUNDER",

        name: "nate",
        bio: "",
        music: "https://youtu.be/lCDU928mDJs?si=tOC2QV1mb-tv2dcg",

        bannerImage: "",
        backgroundImage: "/nate/bg.png",
        backgroundOverlay: 0.55,

        buttonColors: {
            social: "#000000",
            discord: "#000000",
            panel: "#000000",
        },

        socials: [
            {
                label: "youtube",
                url: "https://youtube.com/@4luvraizen?si=Uqjf68BpLDocr4vm",
            },
            {
                label: "tiktok",
                url: "https://www.tiktok.com/@youthink.ron?_r=1&_t=ZS-99223pwFevU",
            },
        ],

        discordLinks: [],

        affiliates: [
            {
                name: "",
                url: "https://www.helloxorev.com/",
                banner: "/demz/xorev.png",
            },
            {
                name: "",
                url: "https://revgng.org/",
                banner: "/demz/revshit.png",
            },
            {
                name: "",
                url: "https://krammy.world/",
                banner: "/demz/krammy.png",
            },
        ],
    },
    {
        key: "illusion",
        discordId: "1495036966360842260",
        group: "FOUNDER",
        hasPage: false,
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
        key: "yel",
        discordId: "1491058480302526637",
        group: "COF",
        hasPage: false,
    },
    {
        key: "risk",
        discordId: "1498182038342336542",
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
            social: "#A868D9",
            discord: "#A868D9",
            panel: "#A868D9",
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
        key: "nikki",
        discordId: "885505939338305556",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "leyy",
        discordId: "907840966340268083",
        group: "FAME",

        name: "leyy",
        bio: "baby im perfect for you",
        music: "https://music.youtube.com/watch?v=IfgvCCP9JKc&si=ZfrePj3cwXOp35Ec",

        bannerImage: "/leyy/banner.jpg",
        backgroundImage: "/ly/bg.jpg",
        backgroundOverlay: 0.55,

        buttonColors: {
            social: "#780000",
            discord: "#780000",
            panel: "#780000",
        },

        socials: [
            {
                label: "instagram",
                url: "https://www.instagram.com/_1zsel/",
            },
            {
                label: "tiktok",
                url: "https://www.roblox.com/users/2228204669/profile",
            },
        ],

        discordLinks: [],

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
    {
        key: "xisha",
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
        key: "tin",
        discordId: "912130312442613801",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "athena",
        discordId: "975452689901162617",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "seri",
        discordId: "1447408955495026792",
        group: "FAME",

        name: "seri",
        bio: "born to stand out, never to fit in.",
        music: "https://www.youtube.com/watch?v=1DpH-icPpl0&list=RD1DpH-icPpl0&start_radio=1",

        bannerImage: "",
        backgroundImage: "/seri/bg.gif",
        backgroundOverlay: 0.55,

        buttonColors: {
            social: "#E03FD8",
            discord: "#E03FD8",
            panel: "#E03FD8",
        },

        socials: [],

        discordLinks: [
            {
                banner: "/seri/1.gif",
                url: "https://discord.gg/2xZa3EFJg",
            },
            {
                banner: "/seri/2.png",
                url: "https://discord.gg/PpnqjXcxNQ",
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
    {
        key: "wider",
        discordId: "929027870674792460",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "xen",
        discordId: "1361012595561205951",
        group: "FAME",

        name: "xen",
        bio: "most hated in asia",
        music: "https://www.youtube.com/watch?v=kJF1H8kG2_Q&list=PLW2XIA9nBJsA",

        bannerImage: "/xen/banner.png",
        backgroundImage: "/xen/bg.gif",
        backgroundOverlay: 0.55,

        buttonColors: {
            social: "#0000FF",
            discord: "#0000FF",
            panel: "#0000FF",
        },

        socials:[],

        discordLinks: [
            {
                banner: "/xen/1.png",
                url: "https://discord.gg/kVe7TsFnnY",
            },
            {
                banner: "/xen/2.png",
                url: "https://discord.gg/PpnqjXcxNQ",
            },
        ],

        affiliates: [
            {
                name: "",
                url: "https://guns.lol/penkai1331",
                banner: "/xen/guns.png",
            },
            {
                name: "",
                url: "https://1738wrldwide.xo.je/",
                banner: "/ly/1738.png",
            },
            {
                name: "",
                url: "https://krammy.world/",
                banner: "/krammy/krammy.png",
            },
        ],
    },
    {
        key: "elohim",
        discordId: "1439556646966923317",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "deej",
        discordId: "739693953242103838",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "tid",
        discordId: "1474609680792817985",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "caramelle",
        discordId: "728609593835651073",
        group: "FAME",
        hasPage: false,
    },
    {
        key: "cio",
        discordId: "1073765256884662393",
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
    {
        key: "devil",
        discordId: "1406664943826374688",
        group: "DIVINEBLOOD",
        hasPage: false,
    },
    {
        key: "kyoshi",
        discordId: "715545303784095794",
        group: "DIVINEBLOOD",

        name: "kyoshi",
        bio: "Been born to this world to be Hated by many.",
        music: "https://youtu.be/KNrjSOpkwRs?si=0Sdfb0xZL2Wih_3K",

        bannerImage: "/kyoshi/banner.gif",
        backgroundImage: "/kyoshi/bg.gif",
        backgroundOverlay: 0.55,

        buttonColors: {
            social: "#cc2222",
            discord: "#cc2222",
            panel: "#cc2222",
        },

        socials: [
            {
                label: "tiktok",
                url: "https://www.tiktok.com/@192.168.875.143?is_from_webapp=1&sender_device=pc",
            },
        ],

        discordLinks: [
            {
                banner: "/kyoshi/1.png",
                url: "https://discord.gg/XJQw2tcDG",
            },
            {
                banner: "/kyoshi/2.png",
                url: "https://discord.gg/64dFQMxMR",
            },
            {
                banner: "/kyoshi/3.png",
                url: "https://discord.gg/jspFqg7uT",
            },
        ],

        affiliates: [
            {
                name: "",
                url: "https://www.helloxorev.com/",
                banner: "/kyoshi/helloxorev.png",
            },
            {
                name: "",
                url: "https://revgng.org/",
                banner: "/kyoshi/revshit.png",
            },
            {
                name: "",
                url: "https://guns.lol/kyoshiroo",
                banner: "/kyoshi/guns.png",
            },
        ],
    },
    {
        key: "rc",
        discordId: "1437571131275214888",
        group: "DIVINEBLOOD",
        hasPage: false,
    },
    {
        key: "jules",
        discordId: "731062259832455178",
        group: "DIVINEBLOOD",
        hasPage: false,
    },
    {
        key: "seii",
        discordId: "1541118696137826504",
        group: "DIVINEBLOOD",
        hasPage: false,
    },
    {
        key: "cie",
        discordId: "1244169767892553764",
        group: "DIVINEBLOOD",
        hasPage: false,
    },
    {
        key: "kash",
        discordId: "1443190990373388361",
        group: "DIVINEBLOOD",
        hasPage: false,
    },
    {
        key: "owx",
        discordId: "998493903286181928",
        group: "DIVINEBLOOD",
        hasPage: false,
    },
    {
        key: "shanoa",
        discordId: "1098937185882869840",
        group: "DIVINEBLOOD",
        hasPage: false,
    },
    {
        key: "supreme",
        discordId: "1500108165771956305",
        group: "DIVINEBLOOD",

        name: "supreme",
        bio: "High Authority",
        music: "https://youtu.be/MEAdm5HzAuM?si=gZOAWazjGW-kwJ-V",

        bannerImage: "",
        backgroundImage: "/supreme/bg.gif",
        backgroundOverlay: 0.55,

        buttonColors: {
            social: "#cc2222",
            discord: "#cc2222",
            panel: "#cc2222",
        },

        socials: [
            {
                label: "instagram",
                url: "https://www.instagram.com/supr_emeoneof1?stkn=Zm5vdHR4eXM4aW11",
            },
        ],

        discordLinks: [
            {
                banner: "/supreme/1.png",
                url: "https://discord.gg/45acp",
            },
            {
                banner: "/supreme/2.png",
                url: "https://discord.gg/8QeZGf278G",
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
    {
        key: "maine",
        discordId: "788703263146246195",
        group: "DIVINEBLOOD",
        hasPage: false,
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
