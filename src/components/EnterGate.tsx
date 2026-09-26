import { useEffect, useRef, useState } from "react";

// Pulls the 11-char video id out of any common YouTube URL,
// or returns the input unchanged if it's already a bare id.
function parseVideoId(source: string): string {
  const s = source.trim();
  const short = s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (short) return short[1];
  const long = s.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (long) return long[1];
  const embed = s.match(/embed\/([A-Za-z0-9_-]{11})/);
  if (embed) return embed[1];
  return s;
}

// Full-screen "click to enter" gate. The click is a real user gesture,
// which is what lets the page's music start reliably (browsers block
// autoplay without one). When `music` is set, the gate waits for the
// hidden YouTube player to be ready before enabling the click, so
// `playVideo()` runs synchronously inside the gesture and is never
// blocked. After entering, a ♪ play/pause toggle is shown.
export function EnterGate({
  music,
  topLabel = "divineblood.xyz",
  note,
  volume = 55,
  startTime = 0,
}: {
  music?: string | null;
  topLabel?: string;
  note?: string;
  volume?: number;
  startTime?: number;
}) {
  const videoId = music ? parseVideoId(music) : null;
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const playerRef = useRef<any>(null);

  // No music → nothing to wait for, the gate is clickable immediately.
  const canEnter = !videoId || ready;

  const startPlayback = () => {
    const p = playerRef.current;
    if (!p) return;
    try {
      p.unMute?.();
      p.setVolume?.(volume);
      if (startTime > 0) p.seekTo?.(startTime, true);
      p.playVideo?.();
    } catch {}
  };

  useEffect(() => {
    if (!videoId) return;
    const w = window as any;
    let mounted = true;
    const prevCallback = w.onYouTubeIframeAPIReady;

    function createPlayer() {
      if (!mounted || playerRef.current) return;
      const playerVars: Record<string, number | string | null> = {
        autoplay: 0,
        controls: 0,
        loop: 1,
        playlist: videoId,
        modestbranding: 1,
        playsinline: 1,
      };
      if (startTime > 0) playerVars.start = startTime;
      playerRef.current = new w.YT.Player("yt-bg-player", {
        videoId,
        playerVars,
        events: {
          onReady: () => {
            if (mounted) setReady(true);
          },
          onStateChange: (e: any) => {
            if (e.data === 1) setPlaying(true);
            else if (e.data === 2 || e.data === 0) setPlaying(false);
          },
        },
      });
    }

    if (w.YT && w.YT.Player) {
      createPlayer();
    } else {
      w.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === "function") prevCallback();
        if (mounted) createPlayer();
      };
      if (!document.getElementById("yt-iframe-api")) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
    }

    // Safety net: never trap the user behind the gate if YouTube is slow
    // or blocked. After a few seconds, let them in anyway.
    const fallback = setTimeout(() => {
      if (mounted) setReady(true);
    }, 6000);

    return () => {
      mounted = false;
      clearTimeout(fallback);
      if (w.onYouTubeIframeAPIReady && w.onYouTubeIframeAPIReady !== prevCallback) {
        w.onYouTubeIframeAPIReady = prevCallback;
      }
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
    };
  }, [videoId, volume]);

  const handleEnter = () => {
    if (!canEnter) return;
    // Start the song synchronously inside the click gesture so the
    // browser's autoplay policy always allows it.
    if (videoId) startPlayback();
    setEntered(true);
  };

  const toggle = () => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (playing) {
        p.pauseVideo?.();
      } else {
        p.unMute?.();
        p.setVolume?.(volume);
        p.playVideo?.();
      }
    } catch {}
  };

  return (
    <>
      {/* Hidden YouTube audio player (off-screen) */}
      {videoId && (
        <div
          className="fixed -left-[9999px] top-0 w-[200px] h-[200px] overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div id="yt-bg-player" />
        </div>
      )}

      {/* Click-to-enter gate */}
      {!entered && (
        <button
          onClick={handleEnter}
          disabled={!canEnter}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm cursor-pointer group disabled:cursor-wait"
          aria-label="Enter site"
        >
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <span className="font-mono text-red-600/80 text-xs tracking-[0.5em] uppercase mb-4">
            {topLabel}
          </span>
          {canEnter ? (
            <span className="font-mono text-lg sm:text-3xl tracking-[0.2em] sm:tracking-[0.4em] text-red-500 uppercase animate-pulse whitespace-nowrap text-center px-4">
              ▸ click to enter ◂
            </span>
          ) : (
            <span className="font-mono text-base sm:text-2xl tracking-[0.2em] sm:tracking-[0.4em] text-red-700/70 uppercase animate-pulse whitespace-nowrap text-center px-4">
              loading sound…
            </span>
          )}
          {note && (
            <span className="mt-6 font-mono text-red-800/50 text-[10px] tracking-[0.3em] uppercase">
              {note}
            </span>
          )}
        </button>
      )}

      {/* Play / pause toggle (only when this page has music) */}
      {entered && videoId && (
        <button
          onClick={toggle}
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-red-900/50 bg-black/70 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-red-500/90 backdrop-blur-sm transition-colors hover:border-red-600/70 hover:text-red-400"
          aria-label={playing ? "Pause music" : "Play music"}
        >
          <span className={playing ? "animate-pulse" : ""}>♪</span>
          {playing ? "playing" : "play"}
        </button>
      )}
    </>
  );
}
