"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateUser = void 0;
const express_validator_1 = require("express-validator");
exports.validateUser = [
    (0, express_validator_1.check)("name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Name is missing")
        .isLength({ min: 3, max: 20 })
        .withMessage("Name must be between 3 to 20 characters"),
    (0, express_validator_1.check)("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
    (0, express_validator_1.check)("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is missing")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be between 8 to 20 characters"),
];
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array();
    if (!errors.length)
        return next();
    res.send({ success: false, message: errors[0].msg });
};
exports.validate = validate;
