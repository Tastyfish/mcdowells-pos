import { validateOptional, validateRequired } from './valid'

export interface Tab {
    key: string
    type?: 'toggle' | 'split'
    severity?: string
}

export interface ToggleTab extends Tab {
    type: 'toggle'
    label: string
}

export interface SplitTab extends Tab {
    type: 'split'
    labels: [string, string]
}

export function isToggleTab(tab: Tab): tab is ToggleTab {
    return (
        (tab.type === undefined || tab.type === 'toggle') &&
        validateRequired('ToggleTab', tab as ToggleTab, 'label', 'string') &&
        validateOptional('ToggleTab', tab, 'severity', 'string')
    )
}

export function isSplitTab(tab: Tab): tab is SplitTab {
    if (tab.type !== 'split') {
        return false
    }

    if (!('labels' in tab) || !(tab.labels instanceof Array) || typeof tab.labels[0] !== 'string' || typeof tab.labels[1] !== 'string') {
        console.error('Split tab missing required [string, string] labels in', tab)
        return false
    }

    return validateOptional('SplitTab', tab, 'severity', 'string')
}

export { default } from './loaders/tabs'
