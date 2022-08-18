AFRAME.registerComponent('static-panel', {
  init: function () {
    this.loaded = true;
    console.log('static-panel component loaded');
    this._takeScreenshot();
  },

  update: async function () {
  },

  _takeScreenshot: async function () {
    return fetch("/screenshot/").then(async (res) => {
      const data = await res.json();
      var entityEl = document.createElement("a-box");
      entityEl.setAttribute("src", data.panel);
      entityEl.setAttribute("gesture-handler", true);
      entityEl.setAttribute("class", "clickable");
      entityEl.setAttribute("geometry", "");
      entityEl.setAttribute("material", "");
      // entityEl.setAttribute("radius", 5.7);
      /* entityEl.setAttribute("width", "2");
      entityEl.setAttribute("height", "2");
      /* entityEl.setAttribute("theta-length", "42");
      entityEl.setAttribute("rotation", "0 100 0"); */
      // entityEl.object3D.scale.set(0.8, 0.8, 0.5); 
      this.el.appendChild(entityEl);
    });
  },
  tick: function () {},

  remove: function () {},

  pause: function () {},

  play: function () {},
});

