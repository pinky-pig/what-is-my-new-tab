import { createApp } from 'vue'
import App from './Newtab.vue'
import { setupNaiveUI } from '~/setup/index'
import { setupApp } from '~/logic/common-setup'

import '../styles'

const app = createApp(App)
setupApp(app)
setupNaiveUI(app)
app.mount('#app')
