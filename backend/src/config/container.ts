import { Container } from "inversify";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { AuthRouter } from "../routes/auth.router";

import { InvoiceService } from "../services/invoice.service";
import { InvoiceController } from "../controllers/invoice.controller";
import { InvoiceRouter } from "../routes/invoices.router";

import { ClientService } from "../services/client.service";
import { ClientController } from "../controllers/client.controller";
import { ClientRouter } from "../routes/client.router";

import { PaymentService } from "../services/payment.service";
import { PaymentController } from "../controllers/payment.controller";
import { PaymentRouter } from "../routes/payments.router";

import { AttachmentService } from "../services/attachment.service";
import { AttachmentController } from "../controllers/attachment.controller";
import { AttachmentRouter } from "../routes/attachment.router";

import { NoteService } from "../services/note.service";
import { NoteController } from "../controllers/note.controller";
import { NoteRouter } from "../routes/note.router";

import { CategoryService } from "../services/category.service";
import { CategoryController } from "../controllers/category.controller";
import { CategoryRouter } from "../routes/category.router";

import { TYPES } from "../types/types";

export const container: Container = new Container();

container
  .bind<AuthService>(TYPES.AuthService)
  .to(AuthService)
  .inTransientScope();

container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuthRouter>(TYPES.AuthRouter).to(AuthRouter);

container.bind<InvoiceService>(TYPES.InvoiceService).to(InvoiceService);
container
  .bind<InvoiceController>(TYPES.InvoiceController)
  .to(InvoiceController);
container.bind<InvoiceRouter>(TYPES.InvoiceRouter).to(InvoiceRouter);

container.bind<ClientService>(TYPES.ClientService).to(ClientService);
container.bind<ClientController>(TYPES.ClientController).to(ClientController);
container.bind<ClientRouter>(TYPES.ClientRouter).to(ClientRouter);

container.bind<PaymentService>(TYPES.PaymentService).to(PaymentService);
container
  .bind<PaymentController>(TYPES.PaymentController)
  .to(PaymentController);
container.bind<PaymentRouter>(TYPES.PaymentRouter).to(PaymentRouter);

container
  .bind<AttachmentService>(TYPES.AttachmentService)
  .to(AttachmentService);
container
  .bind<AttachmentController>(TYPES.AttachmentController)
  .to(AttachmentController);
container.bind<AttachmentRouter>(TYPES.AttachmentRouter).to(AttachmentRouter);

container.bind<NoteService>(TYPES.NoteService).to(NoteService);
container.bind<NoteController>(TYPES.NoteController).to(NoteController);
container.bind<NoteRouter>(TYPES.NoteRouter).to(NoteRouter);

container.bind<CategoryService>(TYPES.CategoryService).to(CategoryService);
container
  .bind<CategoryController>(TYPES.CategoryController)
  .to(CategoryController);
container.bind<CategoryRouter>(TYPES.CategoryRouter).to(CategoryRouter);
