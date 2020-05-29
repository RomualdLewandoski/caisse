// Mapping of each view to their container IDs.
const VIEWS = {
    login: {
        div: '#loginContainer',
        page: loginPage
    },
    admin: {
        div: '#adminContainer',
        page: adminPage
    },
    install: {
        div: '#installContainer',
        page: installPage
    },
    firstLogin: {
        div: "#firstLoginContainer",
        page: firstLoginPage
    }
}

// The currently shown view container.
let currentView = VIEWS.login;
if (localStorage.getItem('vue')) {
    currentView = localStorage.getItem('vue')
} else {
    currentView = VIEWS.login
}

var currentIndexBox = ''
var boxList = new Array()

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
    let vue = JSON.stringify(next)
    localStorage.setItem('vue', vue)
    if (current != null) {
        $(`${current.div}`).fadeOut(currentFadeTime, () => {
            onCurrentFade()
            $(`${next.div}`).fadeIn(nextFadeTime, () => {
                onNextFade()
                $(`${current.div}`).remove()
            })
        })
    } else {
        $(`${next.div}`).fadeIn(nextFadeTime, () => {
            onNextFade()
        })
    }

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
    currentView = VIEWS.login
    $(VIEWS.login).fadeIn("slow")
    disableLoader()
}

function toggleBox(newBox) {
    let box
    if (newBox.charAt(0) !== "#") {
        box = "#" + newBox
    } else {
        box = newBox
    }
    $(currentIndexBox).removeClass("selected-box")
    $(box).addClass("selected-box")
    currentIndexBox = box
    if (!boxList.includes(box)) {
        boxList.push(box)
    }
}


function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}

function removeBoxList(value) {
    boxList = arrayRemove(boxList, value)
}

function makeBoxe(elem, elemresize) {
    $(elem).draggable({
        cursor: "move",
        containment: '.pageContainer',
        cancel: ".win-size-grip, input, select, i, textarea, button"
    });
    $(elem).resizableSafe({
        handleSelector: elemresize,
        onDrag: function (e, $el, newWidth, newHeight, opt) {
            toggleBox(elem)
            let pageWidth = $('.pageContainer').width();
            let pageHeight = $('.pageContainer').height();
            if (newWidth < 273) {
                newWidth = 273
            }
            if (newHeight < 279) {
                newHeight = 279
            }
            if (newWidth > pageWidth - 10)
                newWidth = pageWidth - 10;
            if (newHeight > pageHeight - 60)
                newHeight = pageHeight - 60;
            $el.width(newWidth);
            $el.height(newHeight);
            return false;
        }
    });
    $(window).resize(function () {
        let poss = $(elem).position();
        if (poss.left + $(elem).width() > $('.pageContainer').width()) {
            let left = $('.pageContainer').width() - $(elem).width() - 10
            $(elem).css('left', left + 'px')
        }
        if (poss.top + $(elem).height() > $('.pageContainer').height()) {
            let top = $('.pageContainer').height() - $(elem).height() - 60
            $(elem).css('top', top + 'px')
        }
        let pageWidth = $('.pageContainer').width();
        let pageHeight = $('.pageContainer').height();
        let newWidth = $(elem).width();
        let newHeight = $(elem).height();
        if (newWidth > pageWidth) {
            $(elem).width(pageWidth - 10)
        }
        if (newHeight > pageHeight) {
            $(elem).height(pageHeight - 60)
        }
    })
    $(elem).click(function (e) {
        if (e.target.nodeName != "I" && e.target.nodeName != "BUTTON") {
            toggleBox($(this).attr('id'))
        }
    })
    $(elem).on("drag", function () {
        toggleBox($(this).attr('id'))
    })
}