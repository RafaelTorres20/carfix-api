import express from 'express';
import { usersRouter } from './users.routes';
import { carsRouter } from './cars.routes';
import { maintenanceRouter } from './maintenance.routes';
import { costsRouter } from './costs.routes';
import { maintenanceHistoryRouter } from './maintenanceHistory.routes';
import { schedulesRouter } from './schedules.routes';

const routes = express.Router();

routes.use('/users', usersRouter());
routes.use('/cars', carsRouter());
routes.use('/maintenences', maintenanceRouter());
routes.use('/history', maintenanceHistoryRouter());
routes.use('/costs', costsRouter());
routes.use('/schedules', schedulesRouter());

export { routes };
