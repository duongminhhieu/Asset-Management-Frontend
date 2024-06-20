
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

    return {
        isValid: true,
        message: ""
    }
};