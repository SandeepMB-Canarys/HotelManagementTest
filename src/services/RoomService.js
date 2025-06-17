const RoomRepository = require('../repositories/RoomRepository');

class RoomService {
  constructor() {
    this.roomRepository = new RoomRepository();
  }

  /**
   * Create new room
   * @param {Object} roomData
   * @returns {Promise<Object>}
   */
  async createRoom(roomData) {
    return this.roomRepository.create(roomData);
  }

  /**
   * Get room by ID
   * @param {string} roomId
   * @returns {Promise<Object>}
   */
  async getRoom(roomId) {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  }

  /**
   * Get rooms by company
   * @param {string} companyId
   * @returns {Promise<Array>}
   */
  async getRoomsByCompany(companyId) {
    return this.roomRepository.findByCompany(companyId);
  }

  /**
   * Get available rooms
   * @param {string} companyId
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<Array>}
   */
  async getAvailableRooms(companyId, startDate, endDate) {
    return this.roomRepository.findAvailableRooms(companyId, startDate, endDate);
  }

  /**
   * Update room
   * @param {string} roomId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateRoom(roomId, updateData) {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    return this.roomRepository.update(roomId, updateData);
  }

  /**
   * Update room status
   * @param {string} roomId
   * @param {string} status
   * @returns {Promise<Object>}
   */
  async updateRoomStatus(roomId, status) {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    return this.roomRepository.updateStatus(roomId, status);
  }

  /**
   * Delete room
   * @param {string} roomId
   * @returns {Promise<Object>}
   */
  async deleteRoom(roomId) {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    return this.roomRepository.delete(roomId);
  }
}

module.exports = new RoomService();
