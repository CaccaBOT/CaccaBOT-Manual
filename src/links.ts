
import { Title } from 'title'

export function createLink(title: Title): string {
    return '<!-- TOC --><a name="' + title.link + '"></a>'
}