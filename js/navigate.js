/* publisher:navigate -- installed by steps/12_navigate.py.
 *
 * The About dialog (Bootstrap modal #myModal) links to pages that open in the centre frame ("view"):
 * How to navigate, the licence page, What's missing. Without this the page loads BEHIND the open
 * dialog and the reader sees nothing change. Close the dialog on such a click; the link itself is
 * left to do its normal job (no preventDefault).
 *
 * CAPTURE phase on purpose: Archi's model.js binds its own click handler to every target="view" link and
 * stops the event there, so a bubbling (jQuery-delegated) listener never fires. Measured 15 Oct 2026 on ITSMB.
 */
(function () {
    'use strict';
    document.addEventListener('click', function (e) {
        var a = e.target && e.target.closest ? e.target.closest('#myModal a[target="view"]') : null;
        if (a && window.jQuery) { window.jQuery('#myModal').modal('hide'); }
    }, true);
})();
