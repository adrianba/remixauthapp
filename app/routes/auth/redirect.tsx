import type { LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export async function loader({ request }: LoaderArgs) {
  return authenticator.authenticate("SERVICE_NAME", request, {
    successRedirect: "/",
    failureRedirect: "/",
  });
}
