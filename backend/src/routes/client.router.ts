import { Request, Response, Router, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ClientController } from "../controllers/client.controller";
import { authenticate } from "../middlewares/auth/auth.middleware";
import { wrapWithAuthRequest } from "../utils/wrapWithAuthRequest";

@injectable()
export class ClientRouter {
  public router: Router;

  constructor(
    @inject(TYPES.ClientController) private clientController: ClientController
  ) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.post(
      "/create",
      authenticate,
      wrapWithAuthRequest(
        this.clientController.handleCreateClient.bind(this.clientController)
      )
    );

    this.router.get(
      "/getAll",
      authenticate,
      wrapWithAuthRequest(
        this.clientController.handleGetAll.bind(this.clientController)
      )
    );

    this.router.get(
      "/:id",
      authenticate,
      wrapWithAuthRequest(
        this.clientController.handleGetById.bind(this.clientController)
      )
    );

    this.router.put(
      "/update/:id",
      authenticate,
      wrapWithAuthRequest(
        this.clientController.handleUpdate.bind(this.clientController)
      )
    );

    this.router.put(
      "/delete/:id",
      authenticate,
      wrapWithAuthRequest(
        this.clientController.handleDelete.bind(this.clientController)
      )
    );

    this.router.post(
      "/:clientId/notes",
      authenticate,
      wrapWithAuthRequest(
        this.clientController.handleAddClientNote.bind(this.clientController)
      )
    );

    this.router.put(
      "/update/notes/:noteId",
      authenticate,
      wrapWithAuthRequest(
        this.clientController.handleUpdateClientNote.bind(this.clientController)
      )
    );

    this.router.put(
      "/delete/notes/:noteId",
      authenticate,
      wrapWithAuthRequest(
        this.clientController.handleDeleteClientNote.bind(this.clientController)
      )
    );
  }
}

// | Method   | Endpoint                   | Description        |
// | -------- | -------------------------- | ------------------ |
// | `POST`   | `/clients/:clientId/notes` | Add note to client |
// | `PUT`    | `/notes/:noteId`           | Update note        |
// | `DELETE` | `/notes/:noteId`           | Delete note        |
