import validator from 'validator';

const ValidatedData = (req) => {
    const { firstName, lastName, emailID, password } = req.body;
    if (!firstName) {
        throw new Error("First name is required");
    }
    if (firstName.length < 2 || firstName.length > 50) {
        throw new Error("First name must be between 2 and 50 characters");
    }
    if (lastName && (lastName.length < 2 || lastName.length > 50)) {
        throw new Error("Last name must be between 2 and 50 characters");
    }
    if (!emailID || !validator.isEmail(emailID)) {
        throw new Error("A valid email ID is required");
    }
    if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong Password");
    }
}

const ValidatedEditData = (req) => {
    const allowedEdits = ['firstName', 'lastName', 'about', 'age', 'gender', 'skills'];
    const isValidEditData = Object.keys(req.body).every((key) => allowedEdits.includes(key));
    return isValidEditData;
}

const ValidatedPassword = (req) => {
    const { password } = req.body;
    if (!password || !validator.isStrongPassword(password)) {
        return false;
    }
    return true;
}

export { ValidatedData, ValidatedEditData, ValidatedPassword };