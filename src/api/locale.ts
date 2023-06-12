import { readonly, ref } from "vue";
import { loadConfig } from "./config";

interface Locale {
    salesTax: number
    currency: string
}

// Start with default values.
const defaultLocale: Locale = {
    salesTax: 0,
    currency: '$'
}

const locale = ref(defaultLocale)

async function loadLocale() {
    locale.value = {
        ...defaultLocale,
        ...await loadConfig('locale')
    }
}

loadLocale()

export default readonly(locale)
