'use strict'

var NewContacts = (function() {
  var navigation = new navigationStack('view-contact-form');
  var TAG_OPTIONS;
  var contactsForm;
  var selectedTag,
      customTag,
      contactTag;

  var checkUrl = function checkUrl() {
    initForm(function onInitForm() {
      var extractParams = function extractParams(url) {
        if (!url) {
          return -1;
        }
        var ret = {};
        var params = url.split('&');
        for (var i = 0; i < params.length; i++) {
          var currentParam = params[i].split('=');
          ret[currentParam[0]] = currentParam[1];
        }
        return ret;
      };
      var hasParams = window.location.hash.split('?');
      var params = hasParams.length > 1 ?
      extractParams(hasParams[1]) : -1;
      if (params !== -1 && 'tel' in params) {
        contactsForm.render(params);
      }
    });
  };

  var handleBack = function handleBack() {
    navigation.back();
  };

  var handleCancel = function handleCancel() {
    if (ActivityHandler.currentlyHandling) {
      ActivityHandler.postCancel();
    }
  };

  var initForm = function c_initForm(callback) {
    contactsForm = contacts.Form;
    contactsForm.init(TAG_OPTIONS);
    callback();
  };

  var updatePhoto = function updatePhoto(photo, dest) {
    var background = '';
    if (photo != null) {
      background = 'url(' + URL.createObjectURL(photo) + ')';
    }
    dest.style.backgroundImage = background;
  };

  // Checks if an object fields are empty, by empty means
  // field is null and if it's an array it's length is 0
  var isEmpty = function isEmpty(obj, fields) {
    if (obj == null || typeof(obj) != 'object' ||
        !fields || !fields.length) {
      return true;
    }
    var attr;
    var isArray;
    for (var i = 0; i < fields.length; i++) {
      attr = fields[i];
      if (obj.hasOwnProperty(attr) && obj[attr]) {
        if (Array.isArray(obj[attr])) {
          if (obj[attr].length > 0) {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    return true;
  };

  var goToSelectTag = function goToSelectTag(event) {
    var target = event.currentTarget.children[0];
    var tagList = target.dataset.taglist;
    var options = TAG_OPTIONS[tagList];
    fillTagOptions(options, tagList, target);
    navigation.go('view-select-tag', 'right-left');
    window.navigator.mozKeyboard.removeFocus();   
  };

  var fillTagOptions = function fillTagOptions(options, tagList, update) {
    var container = document.getElementById('tags-list');
    container.innerHTML = '';
    contactTag = update;

    var selectedLink;
    for (var option in options) {
      var link = document.createElement('button');
      link.dataset.index = option;
      link.textContent = options[option].value;

      link.onclick = function(event) {
        var index = event.target.dataset.index;
        selectTag(event.target, tagList);
        event.preventDefault();
      };

      if (update.textContent == TAG_OPTIONS[tagList][option].value) {
        selectedLink = link;
      }

      var list = document.createElement('li');
      list.appendChild(link);
      container.appendChild(list);
    }

    // Deal with the custom tag, clean or fill
    customTag.value = '';
    if (!selectedLink && update.textContent) {
      customTag.value = update.textContent;
    }

    selectTag(selectedLink);
  };

  var onCustomTagSelected = function onCustomTagSelected() {
    if (selectedTag) {
      // Remove any mark if we had selected other option
      selectedTag.removeAttribute('class');
    }
    selectedTag = null;
  };

  var selectTag = function selectTag(link, tagList) {
    if (link == null) {
      return;
    }

    //Clean any trace of the custom tag
    customTag.value = '';

    var index = link.dataset.index;

    if (selectedTag) {
      selectedTag.removeAttribute('class');
    }

    link.className = 'icon icon-selected';
    selectedTag = link;
  };

  var doneTag = function doneTag() {
    if (selectedTag) {
      contactTag.textContent = selectedTag.textContent;
    } else if (customTag.value.length > 0) {
      contactTag.textContent = customTag.value;
    }
    contactTag = null;
    handleBack();
  };

  var saveContact = function saveContact() {
    return contacts.Form.saveContact();
  };

  var newField = function newField(evt) {
    return contacts.Form.onNewFieldClicked(evt);
  };

  var initContainers = function initContainers() {
    var _ = navigator.mozL10n.get;
    customTag = document.getElementById('custom-tag');
    
    TAG_OPTIONS = {
      'phone-type' : [
        {value: _('mobile')},
        {value: _('home')},
        {value: _('work')},
        {value: _('personal')},
        {value: _('faxHome')},
        {value: _('faxOffice')},
        {value: _('faxOther')},
        {value: _('another')}
      ],
      'email-type' : [
        {value: _('personal')},
        {value: _('home')},
        {value: _('work')}
      ],
      'address-type' : [
        {value: _('home')},
        {value: _('work')}
      ]
    };    
  };

  var initEventListeners = function initEventListener() {
    // Definition of elements and handlers
    utils.listeners.add({
      '#cancel-edit': handleCancel,
      '#contact-form button[data-field-type]': newField,
      '#save-button': saveContact,
      '#settings-cancel': handleBack,
      '#settings-done': doneTag,
      // Bug 832861: Click event can't be synthesized correctly on customTag by
      // mouse_event_shim due to Gecko bug.  Use ontouchend here.
      '#custom-tag': [
        {
          event: 'touchend',
          handler: onCustomTagSelected
        }
      ]      
    });    
  };

  var init = function init() {
    initContainers();
    initEventListeners();
    window.addEventListener('hashchange', checkUrl);
  };

  var onLocalized = function onLocalized() {
    init();
    checkUrl();
  };

  return {
    'onLocalized': onLocalized,
    'goToSelectTag': goToSelectTag,
    'updatePhoto': updatePhoto,
    'isEmpty': isEmpty
  };
})();

var Contacts = NewContacts;

window.addEventListener('localized', function initContacts(evt) {
  window.removeEventListener('localized', initContacts);

  NewContacts.onLocalized();

  if (window.navigator.mozSetMessageHandler && window.self == window.top) {
    var actHandler = ActivityHandler.handle.bind(ActivityHandler);
    window.navigator.mozSetMessageHandler('activity', actHandler);
  }
});
