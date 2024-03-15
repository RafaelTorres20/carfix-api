import { Schedule, ScheduleDTO } from './models';

export interface ISchedule {
  createSchedule: (schedule: ScheduleDTO) => Promise<{ id: string }>;
  updateSchedule: (id: string, schedule: ScheduleDTO) => Promise<Schedule>;
  deleteSchedule: (id: string) => Promise<void>;
  getSchedulesByMonthAndYear: (carID: string, date: Date) => Promise<Schedule[]>;
  getSchedulesByDate: (carID: string, date: Date) => Promise<Schedule[]>;
}
