import mongoose from "mongoose";
import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";

import isAuth from "../../middleware/isAuth";
import isOurRefrigerator, {
  isMyRefrigerator,
} from "../../middleware/isOurRefrigerator";
import { RefrigeratorService } from "../../../services/refrigerator";

const route = Router();

export default (app: Router) => {
  app.use("/refrigerator", route);

  route.get("/read-list", isAuth, async (req, res) => {
    const userId = req.userId;

    try {
      const refrigeratorList = await RefrigeratorService.readList(userId);
      res.status(200).json(refrigeratorList);
    } catch (error) {
      console.error("냉장고 목록 조회 중 오류:", error);
      res.status(500).json({ message: "서버 오류" });
    }
  });

  route.get("/read-detail", isAuth, isOurRefrigerator, async (req, res) => {
    const recipeId = req.query.refrigerator_id as string;

    try {
      const refrigerator = await RefrigeratorService.readDetail(
        mongoose.Types.ObjectId.createFromHexString(recipeId)
      );

      res.status(200).json(...refrigerator);
    } catch (error) {
      console.error("냉장고 상세 조회 중 오류:", error);
      res.status(500).json({ message: "서버 오류" });
    }
  });

  route.post(
    "/create",
    celebrate({ [Segments.BODY]: Joi.object({ name: Joi.string() }) }),
    isAuth,
    async (req, res) => {
      const userId = req.userId;
      const refrigeratorName = req.body.name as string;

      try {
        const newRefrigerator = await RefrigeratorService.createRefrigerator(
          refrigeratorName,
          userId
        );

        if (!newRefrigerator) {
          return res
            .status(401)
            .json({ message: "냉장고 생성에 실패했습니다." });
        }

        res.status(201).json(newRefrigerator);
      } catch (error: any) {
        if (error.code === 11000) {
          console.error("중복된 필드:", error.keyValue);
          res.status(422).json({ message: "중복된 냉장고 이름입니다." });
        } else {
          console.error("냉장고 저장 중 오류가 발생했습니다:", error);
          res.status(500).json({ message: "서버 오류" });
        }
      }
    }
  );

  route.patch(
    "/update",
    celebrate({
      [Segments.BODY]: Joi.object({
        refrigerator_id: Joi.string(),
        refrigerator_name: Joi.string(),
      }),
    }),
    isAuth,
    isOurRefrigerator,
    async (req, res) => {
      const { refrigerator_id, refrigerator_name } = req.body as {
        refrigerator_id: string;
        refrigerator_name: string;
      };
      try {
        const result = await RefrigeratorService.updateRefrigerator(
          refrigerator_id,
          refrigerator_name
        );

        res.status(200).json(result);
      } catch (error) {
        console.error("냉장고 업데이트 중 오류:", error);
        res.status(500).json({ message: "서버 오류" });
      }
    }
  );

  route.delete(
    "/delete",
    celebrate({
      [Segments.BODY]: Joi.object({ refrigerator_id: Joi.string() }),
    }),
    isAuth,
    isMyRefrigerator,
    async (req, res) => {
      const { refrigerator_id } = req.body as {
        refrigerator_id: string;
      };

      try {
        await RefrigeratorService.deleteRefrigerator(refrigerator_id);

        res.status(200).json({ message: "냉장고 삭제에 성공했습니다." });
      } catch (error) {
        console.error("냉장고 삭제 중 오류:", error);
        res.status(500).json({ message: "서버 오류" });
      }
    }
  );

  route.patch(
    "/shared-member/add",
    celebrate({
      [Segments.BODY]: Joi.object({
        refrigerator_id: Joi.string().required(),
        member_id: Joi.string().required(),
      }),
    }),
    isAuth,
    isMyRefrigerator,
    async (req, res) => {
      const { refrigerator_id, member_id } = req.body as {
        refrigerator_id: string;
        member_id: string;
      };

      try {
        await RefrigeratorService.addSharedMember(
          refrigerator_id,
          mongoose.Types.ObjectId.createFromHexString(member_id)
        );

        res.status(200).json({ message: "공유 멤버 초대를 성공했습니다." });
      } catch (error) {
        console.error("냉장고 공유 멤버 설정 오류:", error);
        res.status(500).json({ message: "서버 오류" });
      }
    }
  );

  route.patch(
    "/shared-member/remove",
    celebrate({
      [Segments.BODY]: Joi.object({
        refrigerator_id: Joi.string().required(),
        member_id: Joi.string().required(),
      }),
    }),
    isAuth,
    isMyRefrigerator,
    async (req, res) => {
      const { refrigerator_id, member_id } = req.body as {
        refrigerator_id: string;
        member_id: string;
      };

      try {
        await RefrigeratorService.removeSharedMember(
          refrigerator_id,
          mongoose.Types.ObjectId.createFromHexString(member_id)
        );

        res.status(200).json({ message: "공유 멤버 삭제를 성공했습니다." });
      } catch (error) {
        console.error("냉장고 공유 멤버 설정 오류:", error);
        res.status(500).json({ message: "서버 오류" });
      }
    }
  );
};
