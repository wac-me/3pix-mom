import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/seed-user")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { secret, email, password } = await request.json();
        if (secret !== "one-time-3pix-seed") {
          return new Response("Forbidden", { status: 403 });
        }
        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (error) {
          return Response.json({ ok: false, error: error.message }, { status: 400 });
        }
        return Response.json({ ok: true, id: data.user?.id });
      },
    },
  },
});
