import express from 'express';import { Schedule } from '../../domains/schedules/models';
import { v4 as uuid } from 'uuid';
import { ScheduleServices } from '../../domains/schedules/services';
import { firestoreDB } from '../../gateways/firestore/db';
import { ScheduleRepository } from '../../domains/schedules/repository.';
class SchedulesRouter {
  public router: express.Router;
  constructor(private schedulesService: ScheduleServices) {
    this.router = express.Router();
    this.router.get('/:id', this.getSchedulesByDate);
    this.router.post('/', this.createSchedule);
    this.router.delete('/:id', this.deleteSchedule);
    this.router.put('/:id', this.updateSchedule);
  }

  getSchedulesByDate = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { date } = req.query;
    this.schedulesService
      .getSchedulesByDate(id, new Date(date as string))
      .then((schedules) => {
        return res.status(200).json(schedules);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  };

  createSchedule = (req: express.Request, res: express.Response) => {
    const scheduleDTO = req.body;
    this.schedulesService
      .createSchedule(scheduleDTO)
      .then((schedule) => {
        return res.status(201).json(schedule);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  };

  deleteSchedule = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    this.schedulesService
      .deleteSchedule(id)
      .then(() => {
        return res.status(204).send();
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  };

  updateSchedule = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const scheduleDTO = req.body;
    this.schedulesService
      .updateSchedule(id, scheduleDTO)
      .then((schedule) => {
        return res.status(200).json(schedule);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  };

  public getRouter() {
    return this.router;
  }
}

export const schedulesRouter = () => {
  const db = firestoreDB();
  const schedulesRepository = new ScheduleRepository(db, 'schedules');
  const schedulesService = new ScheduleServices(schedulesRepository);
  const router = new SchedulesRouter(schedulesService);
  return router.getRouter();
};
