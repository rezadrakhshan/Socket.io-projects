import { check } from "express-validator";

export default new (class {
  registerValidator() {
    return [
      check("email").isEmail().withMessage("Email is not valid"),
      check("password")
        .notEmpty()
        .withMessage("Password cannot be empty")
        .isLength({ min: 4 })
        .withMessage("Password must be at least 4 characters long"),
    ];
  }
})();
