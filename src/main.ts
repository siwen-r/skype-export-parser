import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import i18n from './i18n'

import "tailwindcss/tailwind.css"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas);
library.add(fab);
library.add(far);

const app = createApp(App)
app.use(store)
app.use(i18n)
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount('#app')
