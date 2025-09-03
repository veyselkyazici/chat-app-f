
export class UpdateUserDTO {
    constructor(value) {
        this.value = value;
    }

    validate() {
        const errors = [];

        if (!this.value) {
            throw new Error("Value is required and cannot be empty.");
        }
        else if (this.value.length < 2) {
            errors.push({ field: 'value', message: 'Minimum 2 characters allowed' });
        } else if (this.value.length > 32) {
            errors.push({ field: 'value', message: 'Maximum 32 characters allowed' });
        }

        return errors;
    }
}