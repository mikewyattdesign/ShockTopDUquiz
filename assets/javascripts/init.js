(function () {
    'use strict';

    DISCOVER_UNFILTERED.init = function () {
        DISCOVER_UNFILTERED.transitions.init();
    };

    // Start the application once the DOM has loaded.
    $(document).on('ready', DISCOVER_UNFILTERED.init);
}());
