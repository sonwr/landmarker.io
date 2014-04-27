var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');

"use strict";
// TODO this should be split for each item a-la sidebar.

var LandmarkSizeSlider = Backbone.View.extend({

    el: '#lmSizeSlider',

    initialize : function() {
        _.bindAll(this, 'render', 'changeLandmarkSize');
        this.listenTo(this.model, "change:landmarkSize", this.render);
    },

    events: {
        input : "changeLandmarkSize"
    },

    render: function () {
        this.$el[0].value = this.model.get("landmarkSize") * 50;
    },

    changeLandmarkSize: function (event) {
        // turn on batch rendering before firing the change
        this.model.dispatcher().enableBatchRender();
        this.model.set("landmarkSize", (Number(event.target.value) / 50));
        // all symbols will be updated - disable the batch
        this.model.dispatcher().disableBatchRender();
    }
});


var AlphaSlider = Backbone.View.extend({

    el: '#alphaSlider',

    initialize : function() {
        _.bindAll(this, 'render', 'changeAlpha');
        this.listenTo(this.model, "change:meshAlpha", this.render);
    },

    events: {
        input : "changeAlpha"
    },

    render: function () {
        this.$el[0].value = this.model.get("alpha") * 100;
    },

    changeAlpha: function (event) {
        this.model.set("meshAlpha", (Number(event.target.value) / 100));
    }
});


exports.Toolbar = Backbone.View.extend({

    el: '#toolbar',

    initialize : function() {
        this.lmSizeSlider = new LandmarkSizeSlider({model: this.model});
        _.bindAll(this, 'render', 'changeMesh',
            'textureToggle', 'wireframeToggle');
        this.listenTo(this.model, "change:mesh", this.changeMesh);
        // there could already be a model we have missed
        if (this.model.mesh()) {
            this.changeMesh();
        }
        this.render();
    },

    changeMesh: function () {
        console.log('changing mesh binding for Toolbar');
        if (this.mesh) {
            this.stopListening(this.mesh);
        }
        this.listenTo(this.model.mesh(), "all", this.render);
        this.mesh = this.model.mesh();
    },

    events: {
        'click #textureToggle' : "textureToggle",
        'click #wireframeToggle' : "wireframeToggle"
    },

    render: function () {
        if (this.mesh) {
            this.$el.find('#textureRow').toggleClass('Toolbar-Row--Disabled',
                !this.mesh.hasTexture());
            this.$el.find('#textureToggle')[0].checked = this.mesh.isTextureOn();
            this.$el.find('#wireframeToggle')[0].checked = this.mesh.isWireframeOn();
        } else {
            this.$el.find('#textureRow').addClass('Toolbar-Row--Disabled');
        }
        return this;
    },

    textureToggle: function () {
        console.log('textureToggle called');
        if (!this.mesh) {
            return;
        }
        this.mesh.textureToggle();
    },

    wireframeToggle: function () {
        console.log('wireframeToggle called');
        if (!this.mesh) {
            return;
        }
        this.mesh.wireframeToggle();
    }

});