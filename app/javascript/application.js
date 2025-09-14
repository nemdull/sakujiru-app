// Rails 7 entrypoint (jsbundling-rails)
import "@hotwired/turbo-rails"

// Optional: keep UJS features if used (data-remote, method links)
import RailsUJS from "@rails/ujs"
RailsUJS.start()

import * as ActiveStorage from "@rails/activestorage"
ActiveStorage.start()
import "./channels"

// App-specific scripts
import "./src/profile_image_upload"
import "./src/swipe"
import "./src/payjp"

// If you need Hammer.js globally
import "hammerjs"
