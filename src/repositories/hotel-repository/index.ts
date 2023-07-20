import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

async function findRoomById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId
    }, include: {
      Booking: true
    }
  })
}

async function findCapacityRoom(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId
    }, select: {
      capacity: true,
      Booking: true
    }
  })
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findRoomById,
  findCapacityRoom
};

export default hotelRepository;
