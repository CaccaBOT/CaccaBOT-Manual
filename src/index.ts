import settings from './settings.json'
import { Title, newTitle } from './title'
import { createLink } from './links'
import { createTOCEntry } from './toc'
import fileSystem from 'fs'

let lines: string[] = []
let titleLines: string[] = []
let titles: Title[] = []
let links: string[] = []
let toc: string[] = []

function loadLines() {
    lines = fileSystem
        .readFileSync(settings.srcFile, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
}

// removes all previous TOC data
function sanitizeLines() {
    let startTable = lines.findIndex((line) => {
        return line.includes('<!-- TOC start')
    })

    if (startTable == -1) return

    let endTable = lines.findIndex((line) => {
        return line.includes('<!-- TOC end')
    })

    lines.splice(startTable, endTable - startTable + 1)

    // Without this, the newLines would increase on each toc generation
    let numNewLines
    for (numNewLines = startTable; numNewLines < lines.length; numNewLines++) {
        if (lines[numNewLines] != '') break
    }
    numNewLines--

    if (numNewLines > 2) lines.splice(startTable, numNewLines - 2)

    lines = lines.filter((line) => {
        return !line.includes('<!-- TOC')
    })
}

function syncTitles() {
    if (lines.length == 0) {
        titles = []
        return
    }

    titleLines = lines.filter((line) => {
        return line.charAt(0) == '#'
    })

    titles = titleLines.map((line) => {
        return newTitle(line)
    })
}

function syncLinks() {
    links = titles.map((title) => {
        return createLink(title)
    })
}

function syncTOC() {
    toc = ['', '<!-- TOC start -->', '']

    toc = toc.concat(
        titles.map((title) => {
            return createTOCEntry(title)
        }),
    )

    toc = toc.concat(['', '<!-- TOC end -->', ''])
}

function addTOC() {
    let startIndex = 0

    if (settings.firstTitleOnTop) {
        let topTitle = titles.find((title) => {
            return title.level == 1
        })

        if (topTitle != undefined) {
            startIndex =
                lines.findIndex((line) => {
                    return line.includes(topTitle.text)
                }) + 1
        }

        if (startIndex == -1) startIndex = 0
    }

    lines.splice(startIndex, 0, ...toc)
}

function addLinks() {
    for (let i = 0; i < links.length; i++) {
        let linesIndex = lines.findIndex((line) => {
            return line.includes(titles[i].text)
        })

        lines.splice(linesIndex, 0, links[i])
    }
}

function save() {
    fileSystem.writeFileSync(settings.dstFile, lines.join('\n'))
}

function run() {
    loadLines()
    sanitizeLines()
    syncTitles()
    syncLinks()
    syncTOC()
    // ALWAYS DO addLinks BEFORE addTOC !!!
    addLinks()
    addTOC()

    console.log(lines)

    save()
}

run()
