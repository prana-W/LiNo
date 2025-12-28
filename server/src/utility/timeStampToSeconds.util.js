/**
 * Converts YouTube-style timestamps into seconds elapsed into the video.
 * Always returns a Number.
 * Falls back to Date.now() on invalid input.
 */
export default function timestampToSeconds(input) {
    try {
        if (typeof input !== "string") return Number(Date.now());

        // remove All whitespace
        const clean = input.replace(/\s+/g, "");
        if (!clean) return Number(Date.now());

        const isRemaining = clean.startsWith("-");
        const normalized = clean.replace(/^-/, "");

        const toSeconds = (time) => {
            if (!time) return NaN;

            const parts = time.split(":").map(Number);
            if (parts.some(isNaN)) return NaN;

            let seconds = 0;
            for (const part of parts) {
                seconds = seconds * 60 + part;
            }
            return seconds;
        };

        // has elapsed / total
        if (normalized.includes("/")) {
            const [first, total] = normalized.split("/");
            const firstSeconds = toSeconds(first);
            const totalSeconds = toSeconds(total);

            if (isNaN(firstSeconds) || isNaN(totalSeconds)) {
                return Number(Date.now());
            }

            return isRemaining
                ? Math.max(totalSeconds - firstSeconds, 0)
                : firstSeconds;
        }

        // simple elapsed time
        const result = toSeconds(normalized);
        return isNaN(result) ? Number(Date.now()) : result;

    } catch {
        return Number(Date.now());
    }
}
