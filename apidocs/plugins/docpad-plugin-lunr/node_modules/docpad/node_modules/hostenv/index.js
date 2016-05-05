'use strict'

module.exports.PORT =
	process.env.PORT
	|| process.env.OPENSHIFT_NODEJS_PORT
	|| process.env.OPENSHIFT_IOJS_PORT
	|| process.env.VCAP_APP_PORT
	|| process.env.VMC_APP_PORT
	|| null

module.exports.HOSTNAME =
	process.env.HOSTNAME
	|| process.env.OPENSHIFT_NODEJS_IP
	|| process.env.OPENSHIFT_IOJS_IP
	|| process.env.VCAP_APP_HOST
	|| process.env.VMC_APP_HOST
	|| null
