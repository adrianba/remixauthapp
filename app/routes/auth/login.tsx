import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export async function loader() {
  return redirect("/");
}

export async function action({ request }: ActionArgs) {
  return authenticator.authenticate("SERVICE_NAME", request);
}
