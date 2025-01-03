
import { Title } from 'title'

export function createTOCEntry(title: Title): string {
    let result = ''

    result += '\t'.repeat(title.level - 1)
    result += calcBulletSymbol(title) + ' '
    result += '[' + title.text + '](#' + title.link + ')'

    return result
}

function calcBulletSymbol(title: Title): string {
    // In order of how they will be put
    // the first one is for level 1, and then continuing
    const BULLET_SYMBOLS = ['-', '*', '+']

    return BULLET_SYMBOLS[(title.level - 1) % BULLET_SYMBOLS.length]
}