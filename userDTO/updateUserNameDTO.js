class UserDTO {
    constructor(name, surname, phone, about) {
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.about = about;
    }

    // Opsiyonel: Getter ve setter metotları ekleyebilirsiniz
    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getSurname() {
        return this.surname;
    }

    setSurname(surname) {
        this.surname = surname;
    }

    getPhone() {
        return this.phone;
    }

    setPhone(phone) {
        this.phone = phone;
    }

    getAbout() {
        return this.name;
    }

    setAbout(about) {
        this.about = about;
    }
}

export default UserDTO;