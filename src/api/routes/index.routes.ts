import express from 'express';
import { usersRouter } from './users.routes';
import { carsRouter } from './cars.routes';
import { maintenanceRouter } from './maintenance.routes';
import { costsRouter } from './costs.routes';
import { maintenanceHistoryRouter } from './maintenanceHistory.routes';
import { schedulesRouter } from './schedules.routes';
import { authRouter } from './auth.routes';
import { jwt } from '../middlewares/jwt';

const routes = express.Router();

// private routes
routes.use('/users', jwt().middleware, usersRouter());
routes.use('/cars', jwt().middleware, carsRouter());
routes.use('/maintenances', jwt().middleware, maintenanceRouter());
routes.use('/history', jwt().middleware, maintenanceHistoryRouter());
routes.use('/costs', jwt().middleware, costsRouter());
routes.use('/schedules', jwt().middleware, schedulesRouter());

// public routes
routes.use('/auth', authRouter());

export { routes };
