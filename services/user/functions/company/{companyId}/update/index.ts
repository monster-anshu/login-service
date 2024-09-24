import { generatePath, handlerPath } from "@/lib/handler-resolver";
import { AwsFunction } from "@/types";
import schema from "./schema";

export const companyUpdate: AwsFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "patch",
        path: generatePath(__dirname),
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
