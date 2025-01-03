
export type Title = {
    text: string
    link: string
    level: number
}

function calcText(line: string): string {
    if(line == null)
        return ""

    return line
        .replace(/^#+\s*/, '')
}

function calcLink(line: string): string {
    if(line == null)
        return ""

    return line
        .replace(/^#+\s*/, '')
        .replace(/[àÀ]/g, "a")
        .replace(/[èéÈÉ]/g, "e")
        .replace(/[ìÌ]/g, "i")
        .replace(/[òÒ]/g, "o")
        .replace(/[ùÙ]/g, "u")
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/[\s]/g, '-')
        .toUpperCase()
}

function calcLevel(line: string): number {
    if(line == null)
        return 0

    // @ts-ignore
    //
    // this works
    // source: trust me (and the power of regex)
    return line.match(/^#*/)[0].length
}

export function newTitle(line: string): Title {
    return {
        text: calcText(line),
        link: calcLink(line),
        level: calcLevel(line)
    }
}