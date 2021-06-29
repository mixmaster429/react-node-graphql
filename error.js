// error description for corresponding keys
const errors = {
    unauthorized: "unauthorized",
    alreadyExists: "User already exits",
    emailExists: "Email already exists",
    userNameExists: "User Name already exists",
    notFound: "not found",
    noPermission: "Recheck the input credentials or check your permission",
    invalidPassword: "Invalid password",
    passwordMismatch: "Passwords not matching",
    passwordLength: "Password must have minimun 4 letters",
    expired: "Email link expired",
    invalidEmail: "Invalid email Id",
    alreadyReported: "You already reported this user!",
    denied: "Permission denied!",
    alreadyInUse: "already updated with the existing product, Please delete/update the product having this",
    alreadyInUseFilter: "already updated with the existing category, Please delete/update the category having this",
    cannotInactive: "already updated with the existing product, So you can't inactive this",
    cannotInactiveFilter: "already updated with the existing category, So you can't inactive this",
    cannotEdit: "already updated with the existing product, So you can't edit this",
    cannotEditDefault: "default",
    cannotIsfeaturedFalse: "Atleast one category should have isFeatured, So you can't edit isFeatured field",
    cannotInactiveReason: "already updated with the user reports, So you can't inactive this",
    cannotInactiveLanguage: "existed with this language, so you can't inactive this language",
    cannotDeleteLanguage: "existed with this language, so you can't delete this language",
    inActive: "Admin in-activated your account for some reasons, Please contact admin for re-activation!",
    paymentDenied: "Invalid payment credentials.Please check your credentials and try Again",
    paymentLater: "Payment Process Failed.Please try again later",
    deleteLater: "This product already having conversations with users, So can't delete the product.",
    defaultCategory: "This category is default category so you can't delete/inActive this category",
    categoryEdit: "already updated with the category, So you can't edit this"
};

module.exports.errors = errors;
