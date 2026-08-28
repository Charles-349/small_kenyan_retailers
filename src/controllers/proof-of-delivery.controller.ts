import {
  Request,
  Response,
} from "express";

import {
  getProofOfDelivery,
} from "../services/proof-of-delivery.service";

export const getProofOfDeliveryController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      const proof =
        await getProofOfDelivery(
          Number(req.params.id)
        );

      return res.json({
        success: true,
        data: proof,
      });

    } catch (error) {

      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Proof not found",
      });

    }
  };