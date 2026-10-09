import { mount } from 'svelte'
import { registerSW } from 'virtual:pwa-register'
import '@fontsource/comic-neue/latin-400.css'
import '@fontsource/comic-neue/latin-700.css'
import '@fontsource/fredoka/latin-700.css'
import './app.css'
import App from './launcher/App.svelte'

registerSW({ immediate: true })

export default mount(App, { target: document.getElementById('app')! })
