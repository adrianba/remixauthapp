import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import type { User } from "~/utils/auth.server";
import type { LoaderArgs } from "@remix-run/node";

type LoaderData = {
  user: User | null;
};

export const loader = async ({ request }: LoaderArgs) => {
  let data: LoaderData = { user: null };
  data.user = await authenticator.isAuthenticated(request, {
    successRedirect: "/start",
  });
  return json<LoaderData>(data);
};

export default function Index() {
  useLoaderData();

  return (
    <div className="h-screen bg-gray-200">
      <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
        <div className="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                REMIXAPP
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Remix App Template with OAuth2 Authentication
              </p>
            </div>

            <div className="mt-5">
              <Form action="/auth/login" method="post">
                <div className="grid gap-y-4">
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  >
                    Login
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
