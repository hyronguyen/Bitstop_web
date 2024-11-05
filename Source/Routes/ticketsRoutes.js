import { Router } from 'express';
import {CreateANewTicket,DoneStatusTicket,GetTicketByCID, GetAllTickets}  from '../Controller/TICKETSControler.js';

const ticketsRouter = Router();

ticketsRouter.get('/get_TicketsByCustomer/:customerId', GetTicketByCID);

ticketsRouter.get('/get_allTickets', GetAllTickets);

ticketsRouter.put('/put_doneTicket/:ticketId', DoneStatusTicket);

ticketsRouter.post('/post_newTicket', CreateANewTicket);

export default ticketsRouter;