import express from 'express';
import { Schedule } from '../../domains/schedules/models';
import { v4 as uuid } from 'uuid';
class SchedulesRouter {
  public router: express.Router;
  private schedules: Schedule[] = [];
  constructor() {
    this.router = express.Router();
    this.router.get('/:id', this.getScheduleByID);
    this.router.post('/', this.createSchedule);
    this.router.delete('/:id', this.deleteSchedule);
    this.router.put('/:id', this.updateSchedule);
  }

  getScheduleByID = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const [schedule] = this.schedules.filter((schedule) => schedule.id === id);
    return res.status(200).json(schedule);
  };

  createSchedule = (req: express.Request, res: express.Response) => {
    const scheduleDTO = req.body;
    const id: string = uuid();
    const schedule: Schedule = {
      id,
      ...scheduleDTO,
    };
    this.schedules.push(schedule);
    return res.status(201).json(id);
  };

  deleteSchedule = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.schedules = this.schedules.filter((schedule) => schedule.id !== id);
    return res.status(204).send();
  };

  updateSchedule = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const scheduleDTO = req.body;
    const schedule: Schedule = {
      id,
      ...scheduleDTO,
    };
    this.schedules = this.schedules.map((s) => (s.id === id ? schedule : s));
    return res.status(200).json(schedule);
  };

  public getRouter() {
    return this.router;
  }
}

export const schedulesRouter = () => {
  const router = new SchedulesRouter();
  return router.getRouter();
};
