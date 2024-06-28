
export type ValidatorType = {
    isValid: boolean;
    message: string;
}

export const validatorPassword = (value: string) => {

    if (!value) {
        return {
            isValid: false,
            message: "Please input your password!"
        } as ValidatorType;
    }

    if (!/[a-z]/.test(value)) {
        return {
            isValid: false,
            message: "Password must contain at least one lowercase letter."
        }
    }

    if (!/[A-Z]/.test(value)) {
        return {
            isValid: false,
            message: "Password must contain at least one uppercase letter."
        }
    }
    if (!/\d/.test(value)) {
        return {
            isValid: false,
            message: "Password must contain at least one digit."
        }
    }
    if (!/[@#$%^&+=]/.test(value)) {
        return {
            isValid: false,
            message: "Password must contain at least one special character(@#$%^&+=)."
        }
    }
    if (value.length < 8) {
        return {
            isValid: false,
            message: "Password must be at least 8 characters long."
        }
    }
    if (value.length > 128) {
        return {
            isValid: false,
            message: "Password must be at most 128 characters long."
        }
    }

    return {
        isValid: true,
        message: ""
    }
};

export const validateWhitespace = (_: unknown, value: string) => {
    if (value && !/^\s|\s$/.test(value)) {
        return Promise.resolve();
    }
    return Promise.reject(
        new Error("Cannot empty and no start and trailing spaces")
    );
};