require.config({
  baseUrl: 'js'
});

require(['wrapped_settings'], function(Settings) {
  window.addEventListener('change', Settings);

  navigator.addIdleObserver({
    time: 3,
    onidle: Settings.loadPanelStylesheetsIfNeeded.bind(Settings)
  });

  Settings.init();

  setTimeout(function nextTick() {
    LazyLoader.load(['js/utils.js'], startupLocale);

    LazyLoader.load(['shared/js/wifi_helper.js'], displayDefaultPanel);

    LazyLoader.load([
      'js/airplane_mode.js',
      'js/battery.js',
      'shared/js/async_storage.js',
      'js/storage.js',
      'js/try_show_homescreen_section.js',
      'shared/js/mobile_operator.js',
      'shared/js/icc_helper.js',
      'shared/js/settings_listener.js',
      'js/connectivity.js',
      'js/security_privacy.js',
      'js/icc_menu.js',
      'js/nfc.js',
      'js/dsds_settings.js'
    ], handleRadioAndCardState);
  });

  function displayDefaultPanel() {
    // With async pan zoom enable, the page starts with a viewport
    // of 980px before beeing resize to device-width. So let's delay
    // the rotation listener to make sure it is not triggered by fake
    // positive.
    ScreenLayout.watch(
      'tabletAndLandscaped',
      '(min-width: 768px) and (orientation: landscape)');
    window.addEventListener('screenlayoutchange', Settings.rotate);

    // display of default panel(#wifi) must wait for
    // lazy-loaded script - wifi_helper.js - loaded
    if (Settings.isTabletAndLandscape()) {
      Settings.currentPanel = Settings.defaultPanelForTablet;
    }
  }

  /**
   * Enable or disable the menu items related to the ICC card relying on the
   * card and radio state.
   */
  function handleRadioAndCardState() {
    var iccId;

    // we hide all entry points by default,
    // so we have to detect and show them up
    if (navigator.mozMobileConnections) {
      if (navigator.mozMobileConnections.length == 1) {
        // single sim
        document.getElementById('simSecurity-settings').hidden = false;
      } else {
        // dsds
        document.getElementById('simCardManager-settings').hidden = false;
      }
    }

    var mobileConnections = window.navigator.mozMobileConnections;
    var iccManager = window.navigator.mozIccManager;
    if (!mobileConnections || !iccManager) {
      disableSIMRelatedSubpanels(true);
      return;
    }

    function disableSIMRelatedSubpanels(disable) {
      var itemIds = ['messaging-settings'];

      if (mobileConnections.length === 1) {
        itemIds.push('call-settings');
        itemIds.push('data-connectivity');
      }

      // Disable SIM security item in case of SIM absent or airplane mode.
      // Note: mobileConnections[0].iccId being null could mean there is no ICC
      // card or the ICC card is locked. If locked we would need to figure out
      // how to check the current card state.
      if (!mobileConnections[0].iccId ||
          (mobileConnections[0].radioState === 'disabled')) {
        itemIds.push('simSecurity-settings');
      }

      for (var id = 0; id < itemIds.length; id++) {
        var item = document.getElementById(itemIds[id]);
        if (!item) {
          continue;
        }

        if (disable) {
          item.setAttribute('aria-disabled', true);
        } else {
          item.removeAttribute('aria-disabled');
        }
      }
    }

    function cardStateAndRadioStateHandler() {
      if (!mobileConnections[0].iccId) {
        // This could mean there is no ICC card or the ICC card is locked.
        disableSIMRelatedSubpanels(true);
        return;
      }

      if (mobileConnections[0].radioState !== 'enabled') {
        // Airplane is enabled. Well, radioState property could be changing but
        // let's disable the items during the transitions also.
        disableSIMRelatedSubpanels(true);
        return;
      }
      if (mobileConnections[0].radioState === 'enabled') {
        disableSIMRelatedSubpanels(false);
      }

      var iccCard = iccManager.getIccById(mobileConnections[0].iccId);
      if (!iccCard) {
        disableSIMRelatedSubpanels(true);
        return;
      }
      var cardState = iccCard.cardState;
      disableSIMRelatedSubpanels(cardState !== 'ready');
    }

    function addListeners() {
      iccId = mobileConnections[0].iccId;
      var iccCard = iccManager.getIccById(iccId);
      if (!iccCard) {
        return;
      }
      iccCard.addEventListener('cardstatechange',
        cardStateAndRadioStateHandler);
      mobileConnections[0].addEventListener('radiostatechange',
        cardStateAndRadioStateHandler);
    }

    cardStateAndRadioStateHandler();
    addListeners();

    iccManager.addEventListener('iccdetected',
      function iccDetectedHandler(evt) {
        if (mobileConnections[0].iccId &&
           (mobileConnections[0].iccId === evt.iccId)) {
          cardStateAndRadioStateHandler();
          addListeners();
        }
    });

    iccManager.addEventListener('iccundetected',
      function iccUndetectedHandler(evt) {
        if (iccId === evt.iccId) {
          disableSIMRelatedSubpanels(true);
          mobileConnections[0].removeEventListener('radiostatechange',
            cardStateAndRadioStateHandler);
        }
    });
  }

  // startup
  document.addEventListener('click', function settings_backButtonClick(e) {
    var target = e.target;
    if (target.classList.contains('icon-back')) {
      Settings.currentPanel = target.parentNode.getAttribute('href');
    }
  });
  document.addEventListener('click', function settings_sectionOpenClick(e) {
    var target = e.target;
    var nodeName = target.nodeName.toLowerCase();
    if (nodeName != 'a') {
      return;
    }

    var href = target.getAttribute('href');
    // skips the following case:
    // 1. no href, which is not panel
    // 2. href is not a hash which is not a panel
    // 3. href equals # which is translated with loadPanel function, they are
    //    external links.
    if (!href || !href.startsWith('#') || href === '#') {
      return;
    }

    Settings.currentPanel = href;
    e.preventDefault();
  });
});
