import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    await this.areRequestedDatesAvailableNew(
      // createReservationDto.property.id,
      createReservationDto.room.id,
      createReservationDto.checkInDate,
      createReservationDto.checkOutDate,
    );

    return this.reservationRepository.save(createReservationDto);
  }

  findAll(propertyId: string) {
    return this.reservationRepository.find({
      where: { property: { id: propertyId } },
      relations: ['room', 'guest'],
    });
  }

  async findOne(id: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['room', 'guest'],
    });
    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.findOne(id);
    await this.areRequestedDatesAvailableNew(
      reservation.room.id,
      updateReservationDto.checkInDate,
      updateReservationDto.checkOutDate,
      reservation.id,
    );
    if (updateReservationDto.checkInDate) {
      reservation.checkInDate = updateReservationDto.checkInDate;
    }
    if (updateReservationDto.checkOutDate) {
      reservation.checkOutDate = updateReservationDto.checkOutDate;
    }
    if (updateReservationDto.status) {
      reservation.status = updateReservationDto.status;
    }
    return await this.reservationRepository.save(reservation);
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }

  async areRequestedDatesAvailableNew(
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date,
    reservationId?: string, // Optional, only used when editing
  ): Promise<boolean> {
    if (checkInDate >= checkOutDate) {
      throw new BadRequestException(
        'Check-in date must be before check-out date.',
      );
    }

    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .innerJoin('reservation.room', 'room')
      .where('room.id = :roomId', { roomId })
      .andWhere(
        `(reservation.checkInDate < :checkOutDate AND reservation.checkOutDate > :checkInDate)`, // Exclusive end dates
      )
      .setParameters({ checkInDate, checkOutDate });

    // Exclude the current reservation if editing
    if (reservationId) {
      query.andWhere('reservation.id != :reservationId', { reservationId });
    }

    const overlappingReservations = await query.getCount();

    if (overlappingReservations > 0) {
      throw new ConflictException('The requested dates are already booked.');
    }

    return true;
  }
}
