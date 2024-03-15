import { ISchedule } from './interfaces';
import { Schedule, ScheduleDTO, scheduleDTO } from './models';
import { to } from '../../utils/to';
import { v4 as uuid } from 'uuid';
import { ScheduleRepository } from './repository.';

export class ScheduleServices implements ISchedule {
  constructor(private costRepository: ScheduleRepository) {}
  createSchedule = async (schedule: ScheduleDTO): Promise<{ id: string }> => {
    const id = uuid();
    const [s, error] = await to(scheduleDTO.parseAsync(schedule));
    if (error) {
      console.log(error);
      throw { message: 'bad request', status: 400 };
    }
    const newSchedule = { ...s, id };
    await this.costRepository.create(newSchedule);
    return { id };
  };
  updateSchedule = async (id: string, schedule: ScheduleDTO): Promise<Schedule> => {
    this.costRepository.verifyID(id);
    const [s, error] = await to(scheduleDTO.parseAsync(schedule));
    if (error) {
      console.log(error);
      throw { message: 'bad request', status: 400 };
    }
    return this.costRepository.update('id', id, s);
  };
  deleteSchedule = async (id: string): Promise<void> => {
    this.costRepository.verifyID(id);
    this.costRepository.delete('id', id);
    return;
  };
  getSchedulesByMonthAndYear = async (carID: string, date: Date): Promise<Schedule[]> => {
    this.costRepository.verifyID(carID);
    return this.costRepository.getSchedulesByMonthAndYear(carID, date);
  };
  getSchedulesByDate = async (carID: string, date: Date): Promise<Schedule[]> => {
    this.costRepository.verifyID(carID);
    return this.costRepository.getSchedulesByDate(carID, date);
  };
}
