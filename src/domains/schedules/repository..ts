import { Repository } from '../../gateways/firestore/repository';
import { to } from '../../utils/to';
import { Schedule } from './models';

export class ScheduleRepository extends Repository<Schedule> {
  constructor(db: FirebaseFirestore.Firestore, collection: string) {
    super(db, collection);
  }

  getSchedulesByMonthAndYear = async (carID: string, date: Date): Promise<Schedule[]> => {
    const firstDayFromMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayFromMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const [data, error] = await to(
      this.findAllByDateAndID('carID', carID, 'date', firstDayFromMonth, lastDayFromMonth)
    );
    if (error) {
      console.log(error);
      throw { message: 'internal server error', status: 500 };
    }
    return data;
  };

  getSchedulesByDate = async (carID: string, date: Date): Promise<Schedule[]> => {
    const firstSecondFromDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    );
    const lastSecondFromDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );
    const [data, error] = await to(
      this.findAllByDateAndID(
        'carID',
        carID,
        'date',
        firstSecondFromDate,
        lastSecondFromDate
      )
    );
    if (error) {
      console.log(error);
      throw { message: 'internal server error', status: 500 };
    }
    return data;
  };
}
