import { Request, Response, Router, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { PaymentController } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth/auth.middleware";
import { wrapWithAuthRequest } from "../utils/wrapWithAuthRequest";

@injectable()
export class PaymentRouter {
  public router: Router;

  constructor(
    @inject(TYPES.PaymentController)
    private paymentController: PaymentController
  ) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.post(
      "/create",
      authenticate,

      wrapWithAuthRequest(
        this.paymentController.handleCreatePayment.bind(this.paymentController)
      )
    );

    this.router.get(
      "/:id",
      authenticate,

      wrapWithAuthRequest(
        this.paymentController.handleGetPayments.bind(this.paymentController)
      )
    );

    this.router.put(
      "/update/:id",
      authenticate,

      wrapWithAuthRequest(
        this.paymentController.handleUpdatePayment.bind(this.paymentController)
      )
    );

    this.router.put(
      "/delete/:id",
      authenticate,

      wrapWithAuthRequest(
        this.paymentController.handleDeletePayment.bind(this.paymentController)
      )
    );
  }
}
