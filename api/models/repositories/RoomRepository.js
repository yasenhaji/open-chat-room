import Room from '../Room';

class RoomRepository {

  constructor(model) {
    this.model = model;
  }

  create(object) {
    const newRoom = new Room(object);
    return  newRoom.save()
  }

  findById(id, callback) {
    Room.findById(id, callback);
  }
}

export default new RoomRepository(Room);