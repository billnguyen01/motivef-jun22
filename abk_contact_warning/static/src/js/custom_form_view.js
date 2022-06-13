odoo.define('custom_form_view.contact_form', function (require) {
'use strict';

    var viewRegistry = require('web.view_registry');
    var FormController = require('web.FormController');
    var FormView = require('web.FormView');
    var FormRenderer = require('web.FormRenderer');
    var Dialog = require('web.Dialog');
    var core = require('web.core');

    var ContactFormController = FormController.extend({
        saveRecord: function () {
            var self = this;
            var _t = core._t;

            console.log(this, arguments)

            if (arguments.override && arguments.override == true) {
                return this._super.apply(this, arguments);
            } else {
                new Dialog(self, {
                    title: _t("Warning"),
                    $content: $('<div/>') .append($('<p/>', {text: _t("Duplicate Contact")})),
                    buttons: [
                        {
                            text: _t("Ok"), classes: 'btn btn-primary',
                            click: function() {
                                this.close();
                                arguments.override = true;
                                return self._super.apply(self, arguments);
                            },
                            close: true
                        }, {
                            text: _t('Cancel'),
                            close: true
                        }
                    ]
                }).open();

                return Promise.reject("SaveRecord: waiting for check duplicate");
            }
        },
    });

    var ContactFormView = FormView.extend({
        config: _.extend({}, FormView.prototype.config, {
            Controller: ContactFormController,
        }),
    });

    viewRegistry.add('res_partner_form', ContactFormView);

});