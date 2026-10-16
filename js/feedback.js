/* publisher:feedback -- Feedback menu item behaviour.
 *
 * Lives in its own file ON PURPOSE. The navbar is patched into Archi's
 * modelreport.stg, which is a StringTemplate 4 file using ^...^ as delimiters.
 * A regex character class like [^/]+ therefore contains a live ST4 delimiter,
 * and a previous session killed report generation for every element by putting
 * escaped characters into an ST4 big-string. So the template carries only an
 * inert onclick, and all the actual logic sits here where '^', '\' and '&' are
 * ordinary characters.
 *
 * Loaded by index.html (the top frame, which is where the navbar is).
 * Installed by steps/07_feedback.py.
 */
(function () {
    'use strict';

    var FORM_BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSc8tBKz8xkYUuhpSiqVZhz44DEB-WGoshC9LC40b5D3HccKxw/viewform';
    var ENTRY_MODEL = 'entry.2050592389';
    var ENTRY_PAGE_URL = 'entry.319781135';

    /* The model code is the directory containing index.html. On disk that is
     * .../projects4/html/{MODEL}/index.html, but what reaches the browser
     * depends on where the site is rooted when served: a server rooted at
     * projects4/html gives /{MODEL}/index.html with no 'html' segment at all,
     * and a site deployed at a domain root gives /index.html.
     *
     * So anchor on the last path segment before the file, not on a fixed
     * 'html/' prefix -- that prefix is an artefact of our local folder layout,
     * not a property of the published site. Measured 17 Sep 2026: serving
     * projects4/html on :8777 yields pathname '/ITSMB/index.html', on which the
     * original /html/([^/]+)/ pattern matched nothing and the model code was
     * silently omitted from the form.
     *
     * Falls back to the explicit html/ form first, so a deployment that DOES
     * carry that segment keeps working even if it nests the site deeper. */
    function parseModelCode(p) {
        var m = p.match(/\/(?:projects4\/)?html\/([^\/]+)\//);
        if (m) { return m[1]; }
        /* .../{MODEL}/<file>.html  ->  {MODEL} */
        m = p.match(/\/([^\/]+)\/[^\/]*$/);
        return m ? m[1] : '';
    }

    /* Pages that mean "nothing is open here". Measured on ITSMB 17 Sep 2026:
     * on a freshly loaded site the "element" frame holds empty-element.html
     * while "view" holds the real content, so treating any non-blank frame as
     * the answer reports the placeholder. */
    function isPlaceholder(href) {
        return href.indexOf('about:') === 0
            || /\/empty-[a-z]+\.html(\?|#|$)/.test(href);
    }

    /* The navbar sits in the TOP frame (index.html), and content loads into the
     * iframes named "view" and "element" beneath it. Reading
     * window.location.href here would therefore report index.html on every
     * click, no matter what the reader is actually looking at -- which would
     * make the page-URL field useless. Prefer the inner frame's location.
     *
     * "element" is checked FIRST because it is the more specific of the two: it
     * holds the element page the reader drilled into, while "view" holds the
     * diagram they came from. When nothing has been drilled into, element is a
     * placeholder and view is the honest answer.
     *
     * Same-origin, so this is permitted; wrapped anyway because a frame that has
     * not loaded yet, or an about:blank one, throws or reports nothing useful. */
    function innerLocation() {
        var names = ['element', 'view'];
        for (var i = 0; i < names.length; i++) {
            try {
                var fr = window.frames[names[i]];
                if (!fr) { continue; }
                var href = fr.location.href;
                if (href && !isPlaceholder(href)) {
                    return href;
                }
            } catch (e) {
                /* cross-origin or not ready -- fall through to the next frame */
            }
        }
        return window.location.href;
    }

    function buildFormUrl(u, c) {
        var a = ['usp=pp_url'];
        if (c) {
            a.push(ENTRY_MODEL + '=' + encodeURIComponent(c));
        }
        a.push(ENTRY_PAGE_URL + '=' + encodeURIComponent(u));
        return FORM_BASE + '?' + a.join('&');
    }

    function feedbackOpen() {
        var pageUrl = innerLocation();
        var modelCode = parseModelCode(window.location.pathname);
        var target = buildFormUrl(pageUrl, modelCode);

        /* noopener/noreferrer are NOT window-feature tokens -- listing them in
         * the third argument does nothing at all. Null the opener instead,
         * which is what actually severs the handle. */
        var w = window.open(target, '_blank', 'width=480,height=640');
        if (w) { w.opener = null; }
        return false;
    }

    /* The navbar's onclick calls this by name, so it has to be global. */
    window.feedbackOpen = feedbackOpen;

    /* Exposed for verification without opening a window. */
    window.feedbackUrlForTest = function (pathname, pageUrl) {
        return buildFormUrl(pageUrl, parseModelCode(pathname));
    };
})();
