const path = require('path')
// Mapping of each view to their container IDs.
const VIEWS = {
    landing: '#landingContainer',
    login: '#loginContainer',
    admin: '#adminContainer'
}

// The currently shown view container.
let currentView = ""

/**
 * Switch views.
 *
 * @param {string} current The ID of the current view container.
 * @param {*} next The ID of the next view container.
 * @param {*} currentFadeTime Optional. The fade out time for the current view.
 * @param {*} nextFadeTime Optional. The fade in time for the next view.
 * @param {*} onCurrentFade Optional. Callback function to execute when the current
 * view fades out.
 * @param {*} onNextFade Optional. Callback function to execute when the next view
 * fades in.
 */
function switchView(current, next, currentFadeTime = 1, nextFadeTime = 1, onCurrentFade = () => {
}, onNextFade = () => {
}) {
    currentView = next
    ejse.data("vue", next)
    $(`${current}`).fadeOut(currentFadeTime, () => {
        onCurrentFade()
        $(`${next}`).fadeIn(nextFadeTime, () => {
            onNextFade()
        })
    })
}

/**
 * Get the currently shown view container.
 *
 * @returns {string} The currently shown view container.
 */
function getCurrentView() {
    return currentView
}

function disableLoader() {
    $('#main').fadeIn("slow")
    $('#loadingContainer').fadeOut("slow");
}

function enableLoader() {
    $('#main').fadeOut("slow")
    $('#loadingContainer').fadeIn("slow");
}

function showMainUi(data) {
    $('#main').show()
    $('#main').addClass("bg-green")
    currentView = VIEWS.login
    $(VIEWS.login).fadeIn("slow")
    disableLoader()
}

setTimeout(() => showMainUi(), 2000)