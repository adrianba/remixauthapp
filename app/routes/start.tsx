import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import type { User } from "~/utils/auth.server";
import type { LoaderArgs } from "@remix-run/node";

type LoaderData = {
  user: User | null;
};

export const loader = async ({ request }: LoaderArgs) => {
  let data: LoaderData = { user: null };
  data.user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  if (data.user) {
    //TODO: use accessToken
  }
  return json<LoaderData>(data);
};

export default function Start() {
  const { user } = useLoaderData() as LoaderData;
  if (!user) throw new Error("Missing user - should have redirected");

  return <div>Logged in</div>;
}
