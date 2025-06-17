const RoleRepository = require('../repositories/RoleRepository');

class RoleService {
  constructor() {
    this.roleRepository = new RoleRepository();
  }

  /**
   * Get all roles
   * @returns {Promise<Array>}
   */
  async getAllRoles() {
    return this.roleRepository.getAllRoles();
  }

  /**
   * Get role by name
   * @param {string} name
   * @returns {Promise<Object>}
   * @throws {Error} If role not found
   */
  async getRoleByName(name) {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }

  /**
   * Create new role
   * @param {string} name
   * @returns {Promise<Object>}
   */
  async createRole(name) {
    const existingRole = await this.roleRepository.findByName(name);
    if (existingRole) {
      throw new Error('Role already exists');
    }
    return this.roleRepository.create({ name });
  }
}

module.exports = new RoleService();
