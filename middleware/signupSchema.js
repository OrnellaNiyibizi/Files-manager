const Joi = require('joi')

exports.signupSchema = Joi.object({
    fullName: Joi.string().required(),
    password: Joi.string().regex(/^[A-Za-z0-9]{8,}$/).message('Password must be at least 8 characters long and contain only letters and numbers').required(),
    username: Joi.string().required(),
})