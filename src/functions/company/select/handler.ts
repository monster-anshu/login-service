import { formatJSONResponse } from "@/lib/api-gateway";
import { middyfy } from "@/lib/internal";
import schema from "./schema";
import { HttpException } from "@/lib/error";
import { HttpStatusCode } from "axios";
import { Types } from "mongoose";
import { setSessionCompanyId } from "@/services/session";
import { CompanyModel, CompanyUserModel } from "@/mongo";

export const main = middyfy<typeof schema>(async (event) => {
  const { companyId, productId } = event.body;
  const session = event.session || {};
  const userId = session.userId;

  if (!userId) {
    throw new HttpException("USER_NOT_FOUND", HttpStatusCode.Unauthorized);
  }

  const [companyInfo, userCompany] = await Promise.all([
    CompanyModel.findOne({
      _id: new Types.ObjectId(companyId),
      status: "ACTIVE",
    }),
    CompanyUserModel.findOne({
      companyId,
      userId,
      status: "ACTIVE",
    }),
  ]);

  if (!companyInfo || !userCompany) {
    throw new HttpException("INVALID", HttpStatusCode.BadRequest);
  }

  setSessionCompanyId(session, productId, companyInfo._id.toString());

  event.session = session;

  return formatJSONResponse({
    isSuccess: true,
  });
});
