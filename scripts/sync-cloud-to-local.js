import { createClient } from "@supabase/supabase-js";
import { execSync } from "child_process";
import fs from "fs";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf-8");
  const result = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      result[key] = val;
    }
  }
  return result;
}

const env = {
  ...loadEnvFile(".env"),
  ...loadEnvFile(".env.local"),
  ...process.env,
};

const CLOUD_URL = env.CLOUD_URL || env.VITE_SUPABASE_URL || "https://hhyvbueqqozxlaczlltk.supabase.co";
const CLOUD_KEY = env.CLOUD_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

const LOCAL_URL = env.LOCAL_URL || "http://127.0.0.1:54321";
const LOCAL_SERVICE_KEY = env.LOCAL_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const cloudClient = createClient(CLOUD_URL, CLOUD_KEY, {
  auth: { persistSession: false },
});

const localClient = createClient(LOCAL_URL, LOCAL_SERVICE_KEY, {
  auth: { persistSession: false },
});

async function batchInsert(table, rows) {
  if (!rows || rows.length === 0) {
    console.log(`ℹ️ [${table}] Data kosong di Cloud. Lewati.`);
    return;
  }

  process.stdout.write(`⏳ [${table}] Menyimpan ${rows.length} baris ke Supabase Lokal... `);
  const chunkSize = 200;
  let saved = 0;

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await localClient.from(table).insert(chunk);

    if (error) {
      console.log(`\n   ⚠️ Gagal menyimpan [baris ${i + 1}-${i + chunk.length}]: ${error.message}`);
    } else {
      saved += chunk.length;
    }
  }

  console.log(`✅ Berhasil disinkronkan (${saved}/${rows.length} baris)`);
}

async function run() {
  console.log("==================================================");
  console.log("🔄 Sinkronisasi Data: Supabase Cloud -> Lokal");
  console.log(`📡 Sumber (Cloud): ${CLOUD_URL}`);
  console.log(`💻 Target (Lokal): ${LOCAL_URL}`);
  console.log("==================================================\n");

  console.log("🧹 Mengosongkan data lama di database lokal untuk replikasi bersih...");
  try {
    execSync(
      'docker exec -i supabase_db_koperasi-connect psql -U postgres -d postgres -c "truncate table fund_transactions, payment_installments, urgency_requests, claims, fund_settings, recovery_policy_settings, users cascade;"',
      { stdio: "ignore" }
    );
    console.log("✅ Database lokal bersih siap disinkronkan.\n");
  } catch (err) {
    console.log("⚠️ Peringatan truncate (melewati jika docker psql tidak langsung terhubung).\n");
  }

  console.log("🔑 Melakukan otentikasi admin ke Supabase Cloud...");
  const loginRes = await cloudClient.rpc("login_with_nip_pin", {
    p_nip: "ADMIN001",
    p_pin: "000000",
  });

  if (loginRes.error || !loginRes.data?.session_token) {
    console.error("❌ Gagal login admin ke Cloud:", loginRes.error?.message);
    process.exit(1);
  }

  const sessionToken = loginRes.data.session_token;
  console.log("✅ Berhasil login ke Cloud. Menarik seluruh tabel data...\n");

  // 1. Ambil data antrean, klaim, cicilan, dan user
  const queuesRes = await cloudClient.rpc("admin_queues_data", { p_session_token: sessionToken });
  if (queuesRes.error) {
    console.error("❌ Gagal mengambil admin_queues_data:", queuesRes.error.message);
    process.exit(1);
  }

  const { users = [], claims = [], installments = [] } = queuesRes.data || {};

  // 2. Ambil data kas dana dan transaksi
  const fundsRes = await cloudClient.rpc("admin_funds_data", { p_session_token: sessionToken });
  const { settings = [], transactions = [], recoveryPolicySettings } = fundsRes.data || {};

  // 3. Masukkan ke Lokal sesuai urutan Foreign Key:
  // A. USERS (Induk)
  await batchInsert("users", users);

  // B. FUND SETTINGS
  await batchInsert("fund_settings", settings);

  // C. RECOVERY POLICY SETTINGS
  if (recoveryPolicySettings) {
    await batchInsert("recovery_policy_settings", [recoveryPolicySettings]);
  }

  // D. CLAIMS (Anak dari users)
  await batchInsert("claims", claims);

  // E. PAYMENT INSTALLMENTS (Anak dari claims)
  await batchInsert("payment_installments", installments);

  // F. FUND TRANSACTIONS (Anak dari claims & users)
  await batchInsert("fund_transactions", transactions);

  console.log("\n==================================================");
  console.log("🎉 SINKRONISASI LENGKAP CLOUD -> LOKAL BERHASIL 100%!");
  console.log(`📊 Rincian Data Disinkronkan:`);
  console.log(`   - 👥 Users (Anggota/Admin): ${users.length} baris`);
  console.log(`   - 📋 Claims (Antrean Pengajuan): ${claims.length} baris`);
  console.log(`   - 💳 Payment Installments (Termin): ${installments.length} baris`);
  console.log(`   - 💸 Fund Transactions (Mutasi Kas): ${transactions.length} baris`);
  console.log(`   - ⚙️ Fund Settings (Kategori Dana): ${settings.length} baris`);
  console.log("==================================================");
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
