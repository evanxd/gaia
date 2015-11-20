/* globals io, Provider, Sanitizer, Search */

(function(exports) {
  'use strict';

  var SOCKET_SERVER = 'http://10.247.33.252:3000';
  var RESTAURANT_DATA = [
    {
      title: 'Philz Coffee Sunnyvale',
      distance: '5 minutes driving',
      crowded: true,
      estimatedWaitTime: '25 minutes',
      dataset: {
        url: 'http://www.philzcoffee.com'
      },
      label: 'Philz Coffee Sunnyvale'
    },
    {
      title: 'Philz Coffee Cupertino',
      distance: '10 minutes driving',
      crowded: false,
      dataset: {
        url: 'http://www.philzcoffee.com'
      },
      label: 'Philz Coffee Cupertino'
    }
  ];

  function WoTServices() {}

  WoTServices.prototype = {

    __proto__: Provider.prototype,

    socket: null,

    name: 'WoTServices',

    click: function(e) {
      var url = e.target.dataset.url;
      url && Search.navigate(url);
    },

    init: function() {
      this.socket = io(SOCKET_SERVER);
      this.socket.on('restaurant-data', (data) => {
        this.clear();
        data = this._formatData(data);
        this.render(data);
      });

      this.header = document.getElementById(this.name.toLowerCase() +
        '-header');
      this.container = document.getElementById(this.name.toLowerCase());
      this.container.addEventListener('click', this.click.bind(this));
    },

    _formatData: function(data) {
      var formatedData = [];
      data.forEach(function(ele) {
        formatedData.push({
          title: ele.name,
          distance: ele.distance,
          crowded: ele.crowded,
          estimatedWaitTime: ele.estimatedWaitTime,
          dataset: {
            url: ele.url
          },
          label: ele.name
        });
      });
      return formatedData;
    },

    buildResultsDom: function(results) {
      var frag = document.createDocumentFragment();
      results.forEach(function(config, index) {
        var result = document.createElement('div');
        var description = document.createElement('div');
        var title = document.createElement('span');
        var meta = document.createElement('small');
        var crowded = document.createElement('small');

        result.classList.add('result');
        description.classList.add('description');
        title.classList.add('title');
        meta.classList.add('meta');
        crowded.classList.add('meta');

        for (var i in config.dataset) {
          result.dataset[i] = config.dataset[i];
        }

        if (config.title) {
          title.setAttribute('dir', 'auto');
          title.textContent = config.title;
        } else {
          title.setAttribute('dir', 'ltr');
          title.textContent = config.url;
        }

        if (config.distance) {
          meta.textContent = config.distance;
          // Expose meta infrormation as a helpful description for each result.
          if (config.description) {
            meta.id = this.name + '-description-' + index;
            meta.setAttribute('aria-label', config.description);
            result.setAttribute('aria-describedby', meta.id);
          }
        }

        if (config.crowded) {
          crowded.innerHTML =
            Sanitizer.escapeHTML`<span style="color: rgb(186,60,50)">
              Crowded - ${config.estimatedWaitTime}</span>
              to get your order`;
        } else {
          crowded.innerHTML = '<span style="color: rgb(124,182,163)">' +
            'No line - Ready to serve</span>';
        }

        result.setAttribute('role', 'link');
        // Either use an explicit label or, if not present, title.
        result.setAttribute('aria-label', config.label || config.title);

        description.appendChild(title);
        description.appendChild(meta);
        description.appendChild(crowded);
        result.appendChild(description);
        frag.appendChild(result);
      }, this);
      return frag;
    },

    search: function(filter) {
      this.socket.emit('restaurant-service', filter);
      // For offline demo.
      var restaurantData = RESTAURANT_DATA.filter(function(ele) {
        return ele.title.toLowerCase().match(filter.toLowerCase()) ?
          true : false;
      });
      return Promise.resolve(restaurantData);
    }
  };

  exports.WoTServices = new WoTServices();
  Search.provider(exports.WoTServices);
}(window));
