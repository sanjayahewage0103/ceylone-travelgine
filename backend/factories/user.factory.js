// Factory Pattern for user creation
class User {
  constructor({ fullName, email, contact, nic, passwordHash, role }) {
    this.fullName = fullName;
    this.email = email;
    this.contact = contact;
    this.nic = nic;
    this.passwordHash = passwordHash;
    this.role = role;
  }
}

class Tourist extends User {
  constructor(data) {
    super(data);
  }
}

class VendorUser extends User {
  constructor(data) {
    super(data);
    this.shopDetails = data.shopDetails;
  }
}

class GuideUser extends User {
  constructor(data) {
    super(data);
    this.guideDetails = data.guideDetails;
  }
}

class Admin extends User {
  constructor(data) {
    super(data);
  }
}

class UserFactory {
  static create(role, data) {
    switch (role) {
      case 'tourist':
        return new Tourist(data);
      case 'vendor':
        return new VendorUser(data);
      case 'guide':
        return new GuideUser(data);
      case 'admin':
        return new Admin(data);
      default:
        throw new Error('Invalid user role');
    }
  }
}

module.exports = { User, Tourist, VendorUser, GuideUser, Admin, UserFactory };
