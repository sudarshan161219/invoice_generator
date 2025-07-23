import { Router, Request, Response, NextFunction } from "express";
import { AuthFileRequest } from "../types/express";
import { injectable, inject } from "inversify";
import { TYPES } from "../types/types";
import { AttachmentController } from "../controllers/attachment.controller";
import { upload } from "../middlewares/upload/upload";
import { authenticate } from "../middlewares/auth/auth.middleware";
import { wrapWithAuthFileRequest } from "../utils/wrapWithAuthRequest";

@injectable()
export class AttachmentRouter {
  public router: Router;

  constructor(
    @inject(TYPES.AttachmentController)
    private attachmentController: AttachmentController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/upload",
      authenticate,
      upload.array("files"),
      wrapWithAuthFileRequest(
        this.attachmentController.handleUpload.bind(this.attachmentController)
      )
    );

    this.router.get(
      "/upload/:id",
      authenticate,
      wrapWithAuthFileRequest(
        this.attachmentController.getAttachments.bind(this.attachmentController)
      )
    );

    //* Get Single Attachment Url
    this.router.get(
      "/getSignedUrl/:id",
      authenticate,
      wrapWithAuthFileRequest(
        this.attachmentController.getSignedUrlByAttachmentId.bind(
          this.attachmentController
        )
      )
    );

    //* Update Attachment's file name
    this.router.patch(
      "/update/:id",
      authenticate,
      wrapWithAuthFileRequest(
        this.attachmentController.updateFilename.bind(this.attachmentController)
      )
    );

    //* Delete Attachment
    this.router.patch(
      "/delete/:id",
      authenticate,
      wrapWithAuthFileRequest(
        this.attachmentController.deleteAttachment.bind(
          this.attachmentController
        )
      )
    );
  }
}
