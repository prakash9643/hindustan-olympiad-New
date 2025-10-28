/**
 * Extract the playlist ID from a YouTube playlist URL or ID
 */
export function extractPlaylistId(input: string): string | null {
    // If it's already just an ID (e.g., "PL1234...")
    if (/^PL[a-zA-Z0-9_-]{16,}$/.test(input)) {
        return input
    }

    // Try to extract from URL
    const playlistRegex = /[?&]list=([^&]+)/
    const match = input.match(playlistRegex)

    if (match && match[1]) {
        return match[1]
    }

    return null
}

/**
 * Extract the video ID from a YouTube video URL
 */
export function extractVideoId(url: string): string | null {
    // Handle various YouTube URL formats
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^/?]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^/?]+)/,
        /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match && match[1]) {
            return match[1]
        }
    }

    return null
}
