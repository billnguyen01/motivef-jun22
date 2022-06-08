# -*- coding: utf-8 -*-

from odoo import models, fields, api, _


class CustomResPartner(models.Model):
    _inherit = 'res.partner'

    same_contact_partner_id = fields.Many2one('res.partner', string='Contact with same name', store=False)

    @api.model
    def create(self, vals):
        for partner in self:
            partner_id = partner._origin.id
            company_type = partner.company_type
            Partner = self.with_context(active_test=False).sudo()
            domain = []
            if company_type == 'company':
                domain += [('name', '=', partner.name)]
            else:
                domain += [('email', '=', partner.email)]

            if partner_id:
                domain += [('id', '!=', partner_id), '!', ('id', 'child_of', partner_id)]
            partner.same_contact_partner_id = bool(partner.name) and not partner.parent_id and Partner.search(domain,
                                                                                                              limit=1)
            if partner.same_contact_partner_id:
                with open('E:\Odoo\motivef\sample2.txt', "a+") as f:
                    f.write("stages: {}\n".format(partner.same_contact_partner_id))
                view = self.env.ref('abk_contact_warning.sh_message_wizard')
                view_id = view and view.id or False
                context = dict(self._context or {})
                context['message'] = 'Duplicate Contact'
                return {
                    'name': 'Warnings',
                    'type': 'ir.actions.act_window',
                    'view_type': 'form',
                    'view_mode': 'form',
                    'res_model': 'sh.message.wizard',
                    'views': [(view.id, 'form')],
                    'view_id': view.id,
                    'target': 'new',
                    'context': context
                }
        return super(CustomResPartner, self).create(vals)
