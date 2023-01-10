import { createApp } from 'vue'
import App from './Newtab.vue'
import { setupNaiveUI } from '~/setup'
import { setupApp } from '~/logic/common-setup'
import { setupStore } from '~/store'

import '../styles'

const app = createApp(App)
setupApp(app)
setupNaiveUI(app)
setupStore(app)
app.mount('#app')
