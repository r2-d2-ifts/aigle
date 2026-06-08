import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing Supabase env vars"); process.exit(1); }

const sb = createClient(url, key, { auth: { persistSession: false } });

const PASSWORD = "Test1234";
const users = [
  { email: "dursun.koc@turkcell.com.tr",      name: "Dursun Koc" },
  { email: "muhammet.namdar@turkcell.com.tr", name: "Muhammet Yusuf Namdar" },
  { email: "sevinc.besdas@turkcell.com.tr",   name: "Sevinc Besdas" },
  { email: "izzet.ozturk@turkcell.com.tr",    name: "Izzet Ozturk" },
];

async function run() {
  for (const u of users) {
    const { data, error } = await sb.auth.admin.createUser({
      email: u.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: u.name },
    });
    if (error) {
      if (/already been registered|exists/i.test(error.message)) {
        console.log(`  ${u.email}: already exists`);
      } else {
        console.log(`  ${u.email}: ERROR ${error.message}`);
      }
    } else {
      console.log(`  ${u.email}: ✓ created (id=${data.user?.id})`);
    }
  }
  console.log(`\nPassword for all accounts: ${PASSWORD}`);
}

run().catch(console.error);
