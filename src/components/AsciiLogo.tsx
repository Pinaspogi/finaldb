export const ASCII_ART = `▓█████▄  ██▓ ██▒   █▓ ██▓ ███▄    █ ▓█████  ▄▄▄▄    ██▓     ▒█████   ▒█████  ▓█████▄ 
▒██▀ ██▌▓██▒▓██░   █▒▓██▒ ██ ▀█   █ ▓█   ▀ ▓█████▄ ▓██▒    ▒██▒  ██▒▒██▒  ██▒▒██▀ ██▌
░██   █▌▒██▒ ▓██  █▒░▒██▒▓██  ▀█ ██▒▒███   ▒██▒ ▄██▒██░    ▒██░  ██▒▒██░  ██▒░██   █▌
░▓█▄   ▌░██░  ▒██ █░░░██░▓██▒  ▐▌██▒▒▓█  ▄ ▒██░█▀  ▒██░    ▒██   ██░▒██   ██░░▓█▄   ▌
░▒████▓ ░██░   ▒▀█░  ░██░▒██░   ▓██░░▒████▒░▓█  ▀█▓░██████▒░ ████▓▒░░ ████▓▒░░▒████▓ 
 ▒▒▓  ▒ ░▓     ░ ▐░  ░▓  ░ ▒░   ▒ ▒ ░░ ▒░ ░░▒▓███▀▒░ ▒░▓  ░░ ▒░▒░▒░ ░ ▒░▒░▒░  ▒▒▓  ▒
 ░ ▒  ▒  ▒ ░   ░ ░░   ▒ ░░ ░░   ░ ▒░ ░ ░  ░▒░▒   ░ ░ ░ ▒  ░  ░ ▒ ▒░   ░ ▒ ▒░  ░ ▒  ▒
 ░ ░  ░  ▒ ░     ░░   ▒ ░   ░   ░ ░    ░    ░    ░   ░ ░   ░ ░ ░ ▒  ░ ░ ░ ▒   ░ ░  ░
   ░     ░        ░   ░           ░    ░  ░ ░          ░  ░    ░ ░      ░ ░     ░     
 ░               ░                                ░                              ░    `;

// Small DIVINEBLOOD ASCII wordmark. Used as a header on the friend subpages.
export function AsciiLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full flex justify-center overflow-x-hidden ${className}`}>
      <pre
        className="font-mono text-red-700/50 text-[clamp(2px,1vw,6px)] leading-tight select-none whitespace-pre"
        aria-label="DIVINEBLOOD"
      >
        {ASCII_ART}
      </pre>
    </div>
  );
}
