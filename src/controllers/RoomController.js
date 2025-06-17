const BaseController = require('./BaseController');
const RoomService = require('../services/RoomService');


class RoomController extends BaseController {
  constructor() {
    super();
    this.createRoom = this.createRoom.bind(this);
    this.getRoom = this.getRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.getAvailableRooms = this.getAvailableRooms.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
    this.updateRoomStatus = this.updateRoomStatus.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
  }

  /**
   * Create new room
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async createRoom(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const room = await RoomService.createRoom({
        ...req.body,
        companyId: req.user.companyId
      });

      res.status(201).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating room',
        error: error.message
      });
    }
  }

  /**
   * Get room by ID
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getRoom(req, res) {
    try {
      const room = await RoomService.getRoom(req.params.id);

      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error) {
      if (error.message === 'Room not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error fetching room',
        error: error.message
      });
    }
  }

  /**
   * Get all rooms for company
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getRooms(req, res) {
    try {
      const rooms = await RoomService.getRoomsByCompany(req.user.companyId);

      res.status(200).json({
        success: true,
        data: rooms
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching rooms',
        error: error.message
      });
    }
  }

  /**
   * Get available rooms
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getAvailableRooms(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const rooms = await RoomService.getAvailableRooms(
        req.user.companyId,
        new Date(startDate),
        new Date(endDate)
      );

      res.status(200).json({
        success: true,
        data: rooms
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching available rooms',
        error: error.message
      });
    }
  }

  /**
   * Update room
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async updateRoom(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const room = await RoomService.updateRoom(req.params.id, req.body);

      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error) {
      if (error.message === 'Room not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating room',
        error: error.message
      });
    }
  }

  /**
   * Update room status
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async updateRoomStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const room = await RoomService.updateRoomStatus(req.params.id, req.body.status);

      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error) {
      if (error.message === 'Room not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating room status',
        error: error.message
      });
    }
  }

  /**
   * Delete room
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async deleteRoom(req, res) {
    try {
      await RoomService.deleteRoom(req.params.id);

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      if (error.message === 'Room not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error deleting room',
        error: error.message
      });
    }
  }
}

module.exports = new RoomController();
