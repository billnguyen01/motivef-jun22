# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
from odoo.exceptions import UserError, AccessError


class CustomResPartner(models.Model):
    _inherit = 'res.partner'

    same_contact_partner_id = fields.Many2one('res.partner', string='Contact with same name')

    @api.onchange('name', 'email')
    def _compute_same_contact_partner_id(self):
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
            partner.same_contact_partner_id = bool(partner.name) and not partner.parent_id and Partner.search(domain, limit=1)
