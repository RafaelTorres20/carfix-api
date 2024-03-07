import express from 'express';
import { usersRouter } from './users.routes';
import { carsRouter } from './cars.routes';
import { maintenanceRouter } from './maintenance.routes';
import { costsRouter } from './costs.routes';
import { maintenanceHistoryRouter } from './maintenanceHistory.routes';
import { schedulesRouter } from './schedules.routes';
import { authRouter } from './auth.routes';

const routes = express.Router();

// private routes
routes.use('/users', usersRouter());
routes.use('/cars', carsRouter());
routes.use('/maintenences', maintenanceRouter());
routes.use('/history', maintenanceHistoryRouter());
routes.use('/costs', costsRouter());
routes.use('/schedules', schedulesRouter());

// public routes
routes.use('/auth', authRouter());

export { routes };
