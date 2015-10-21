'use strict'

var Connection = require('node-xmpp-core').Connection
var Client = require('./index')
var JID = require('node-xmpp-core').JID
var Element = require('node-xmpp-core').Stanza.Element
var Stanza = require('node-xmpp-core').Stanza
var ltx = require('node-xmpp-core').ltx

exports.Connection = Connection
exports.Client = Client
exports.JID = JID
exports.Element = Element
exports.Stanza = Stanza.Stanza
exports.Message = Stanza.Message
exports.Presence = Stanza.Presence
exports.Iq = Stanza.Iq
exports.ltx = ltx

window.XMPP = exports
