
export class UpdateUserDTO {
    constructor(id, value) {
        this.id = id;
        this.value = value;
        this.errors = this.validate();
    }

    validate() {
        const errors = [];


        if (!this.id) {
            throw new Error("ID is required and cannot be empty.");
        }

        if (!this.value) {
            throw new Error("Value is required and cannot be empty.");
        }
        else if (this.value.length < 2) {
            errors.push({ field: 'value', message: 'Minimum 2 characters allowed' });
        } else if (this.value.length > 50) {
            errors.push({ field: 'value', message: 'Maximum 50 characters allowed' });
        }

        return errors;
    }
}