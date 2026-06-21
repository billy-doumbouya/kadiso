import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";
import type { ObjectSchema } from "yup";

export function typedResolver<T extends Record<string, unknown>>(
  schema: ObjectSchema<any>
): Resolver<T> {
  return yupResolver(schema) as Resolver<T>;
}