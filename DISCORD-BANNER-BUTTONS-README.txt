DIVINEBLOOD — DISCORD BANNER BUTTONS

Each personal page can have up to 3 clickable Discord banner images.

1. Put your banner image inside:
   public/<member-key>/

2. In src/members.ts, inside that person's member block, add:

discordLinks: [
  { banner: "/krammy/discord-1.png", url: "https://discord.gg/your-invite" },
  { banner: "/krammy/discord-2.png", url: "https://discord.gg/another-invite" },
  { banner: "/krammy/discord-3.png", url: "" },
],

IMPORTANT:
- There is NO text/button name.
- The banner image itself is the clickable button.
- If url is empty, that banner does not show.
- You can use 1, 2, or 3 links.
