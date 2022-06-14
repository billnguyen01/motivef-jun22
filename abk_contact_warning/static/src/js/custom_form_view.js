odoo.define('custom_form_view.contact_form', function (require) {
'use strict';

    var viewRegistry = require('web.view_registry');
    var FormController = require('web.FormController');
    var FormView = require('web.FormView');
    var FormRenderer = require('web.FormRenderer');
    var Dialog = require('web.Dialog');
    var core = require('web.core');

    var ContactFormController = FormController.extend({
        saveRecord: function (recordID, options) {
            var self = this;
            var _super = this._super.bind(this);
            var _t = core._t;

            var name = $('input[name="name"]').val();
            var rpc = require('web.rpc');
            var domain = [['name', '=', name]];

            console.log(options);
            var res = rpc.query({
                model: 'res.partner',
                method: 'search',
                args: [domain]
            }).then(function (partners) {
                console.log(partners);
            });

            new Dialog(this, {
                title: _t("Warning"),
                $content: $('<div/>') .append($('<p/>', {text: _t("Duplicate Contact")})),
                buttons: [
                    {
                        text: _t("Ok"),
                        classes: 'btn btn-primary',
                        click: function() {
                            this.close();
                            return _super(recordID, options);
                        },
                        close: true
                    }, {
                        text: _t('Cancel'),
                        close: true
                    }
                ]
            }).open();

            return Promise.reject("SaveRecord: waiting for check duplicate");
        },
    });

    var ContactFormView = FormView.extend({
        config: _.extend({}, FormView.prototype.config, {
            Controller: ContactFormController,
        }),
    });

    viewRegistry.add('res_partner_form', ContactFormView);

});