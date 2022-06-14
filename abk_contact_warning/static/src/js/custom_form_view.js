odoo.define('custom_form_view.contact_form', function (require) {
'use strict';

    var viewRegistry = require('web.view_registry');
    var FormController = require('web.FormController');
    var FormView = require('web.FormView');
    var Dialog = require('web.Dialog');
    var core = require('web.core');

    var ContactFormController = FormController.extend({
        saveRecord: function (recordID, options) {
            var _super = this._super.bind(this);
            var _t = core._t;

            console.log(recordID);

            var name = $('input[name="name"]').val().trim();
            if (!name) {
                return this._super.apply(this, arguments);
            }

            var rpc = require('web.rpc');
            var domain = [['name', '=', name]];

            rpc.query({
                model: 'res.partner',
                method: 'search_read',
                args: [domain]
            }).then(function (contacts) {
                console.log(contacts);
                if (contacts.length > 0) {
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
                }

                return _super(recordID, options);
            });
        },
    });

    var ContactFormView = FormView.extend({
        config: _.extend({}, FormView.prototype.config, {
            Controller: ContactFormController,
        }),
    });

    viewRegistry.add('res_partner_form', ContactFormView);

});