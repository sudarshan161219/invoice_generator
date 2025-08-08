import { Router, Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../types/types";
import { NoteController } from "../controllers/note.controller";
import { authenticate } from "../middlewares/auth/auth.middleware";
import { wrapWithAuthRequest } from "../utils/wrapWithAuthRequest";

@injectable()
export class NoteRouter {
  public router: Router;

  constructor(
    @inject(TYPES.NoteController)
    private noteController: NoteController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/create",
      authenticate,
      wrapWithAuthRequest(
        this.noteController.handleCreate.bind(this.noteController)
      )
    );

    this.router.get(
      "/get",
      authenticate,
      wrapWithAuthRequest(
        this.noteController.handleGetAll.bind(this.noteController)
      )
    );

    this.router.get(
      "/get/:id",
      authenticate,
      wrapWithAuthRequest(
        this.noteController.handleGetById.bind(this.noteController)
      )
    );

    //* Update Attachment's file name
    this.router.patch(
      "/update/:id",
      authenticate,
      wrapWithAuthRequest(
        this.noteController.handleUpdate.bind(this.noteController)
      )
    );

    // For bulk and single delete (same controller)
    this.router.delete(
      "/delete/:id",
      authenticate,
      wrapWithAuthRequest(
        this.noteController.handleDelete.bind(this.noteController)
      )
    );

    this.router.delete(
      "/delete",
      authenticate,
      wrapWithAuthRequest(
        this.noteController.handleDelete.bind(this.noteController)
      )
    );
  }
}
