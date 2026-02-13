/**
 * Neon PostgreSQL 데이터베이스 전체 백업 스크립트
 * - 테이블 구조 (CREATE TABLE)
 * - 시퀀스 (SEQUENCE) 복원
 * - 데이터 (INSERT INTO)
 * 모두 포함하는 SQL 파일을 생성합니다.
 */
import pg from "pg";
import fs from "fs";
import path from "path";

const DATABASE_URL =
  "postgresql://neondb_owner:npg_Lb6jy3EcxCuJ@ep-bold-cake-adzuibg8.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const client = new pg.Client({ connectionString: DATABASE_URL });

// SQL 값 이스케이프 (문자열 내 싱글쿼트, 백슬래시 처리)
function escapeSqlValue(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return String(val);
  if (val instanceof Date) return `'${val.toISOString()}'`;
  if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function backup() {
  await client.connect();
  console.log("✅ 데이터베이스 연결 성공");

  const lines = [];
  lines.push("-- ============================================");
  lines.push(`-- CareManager Platform DB Backup`);
  lines.push(`-- 생성일시: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`);
  lines.push("-- ============================================");
  lines.push("");

  // 1) public 스키마의 모든 테이블 조회 (의존성 순서 고려)
  const tablesRes = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);
  const tables = tablesRes.rows.map((r) => r.table_name);
  console.log(`📋 백업 대상 테이블 (${tables.length}개):`, tables.join(", "));

  // 2) 각 테이블의 CREATE TABLE DDL 생성
  lines.push("-- ============================================");
  lines.push("-- 테이블 구조 (DDL)");
  lines.push("-- ============================================");
  lines.push("");

  for (const table of tables) {
    // 컬럼 정보 조회
    const colsRes = await client.query(`
      SELECT
        column_name,
        data_type,
        udt_name,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        column_default,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position;
    `, [table]);

    lines.push(`-- 테이블: ${table}`);
    lines.push(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
    lines.push(`CREATE TABLE "${table}" (`);

    const colDefs = [];
    for (const col of colsRes.rows) {
      let typeDef = "";
      if (col.udt_name === "int4") typeDef = "integer";
      else if (col.udt_name === "int8") typeDef = "bigint";
      else if (col.udt_name === "int2") typeDef = "smallint";
      else if (col.udt_name === "serial" || (col.column_default && col.column_default.startsWith("nextval") && col.udt_name === "int4")) typeDef = "serial";
      else if (col.udt_name === "text") typeDef = "text";
      else if (col.udt_name === "varchar") typeDef = col.character_maximum_length ? `varchar(${col.character_maximum_length})` : "varchar";
      else if (col.udt_name === "bool") typeDef = "boolean";
      else if (col.udt_name === "timestamp" || col.udt_name === "timestamptz") typeDef = "timestamp";
      else if (col.udt_name === "jsonb") typeDef = "jsonb";
      else if (col.udt_name === "json") typeDef = "json";
      else if (col.udt_name === "numeric") typeDef = col.numeric_precision ? `numeric(${col.numeric_precision}, ${col.numeric_scale})` : "numeric";
      else if (col.udt_name === "float8") typeDef = "double precision";
      else if (col.udt_name === "float4") typeDef = "real";
      else typeDef = col.data_type;

      // serial 타입인 경우 default 생략
      const isSerial = col.column_default && col.column_default.startsWith("nextval");
      if (isSerial && typeDef === "integer") typeDef = "serial";

      let def = `  "${col.column_name}" ${typeDef}`;
      if (col.is_nullable === "NO" && typeDef !== "serial") def += " NOT NULL";
      if (col.column_default && !isSerial) def += ` DEFAULT ${col.column_default}`;

      colDefs.push(def);
    }
    lines.push(colDefs.join(",\n"));
    lines.push(");");
    lines.push("");
  }

  // 3) PRIMARY KEY, UNIQUE 제약조건 복원
  lines.push("-- ============================================");
  lines.push("-- 제약조건 (PRIMARY KEY, UNIQUE)");
  lines.push("-- ============================================");
  lines.push("");

  const constraintsRes = await client.query(`
    SELECT
      tc.table_name,
      tc.constraint_name,
      tc.constraint_type,
      string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) AS columns
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.table_schema = 'public'
      AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
    GROUP BY tc.table_name, tc.constraint_name, tc.constraint_type
    ORDER BY tc.table_name;
  `);

  for (const c of constraintsRes.rows) {
    const cols = c.columns.split(", ").map((col) => `"${col}"`).join(", ");
    lines.push(`ALTER TABLE "${c.table_name}" ADD CONSTRAINT "${c.constraint_name}" ${c.constraint_type} (${cols});`);
  }
  lines.push("");

  // 4) 데이터 백업 (INSERT INTO)
  lines.push("-- ============================================");
  lines.push("-- 데이터 (INSERT INTO)");
  lines.push("-- ============================================");
  lines.push("");

  let totalRows = 0;
  for (const table of tables) {
    const dataRes = await client.query(`SELECT * FROM "${table}" ORDER BY 1;`);
    if (dataRes.rows.length === 0) {
      lines.push(`-- ${table}: 데이터 없음`);
      lines.push("");
      continue;
    }

    const columns = dataRes.fields.map((f) => f.name);
    lines.push(`-- ${table}: ${dataRes.rows.length}건`);
    
    for (const row of dataRes.rows) {
      const values = columns.map((col) => escapeSqlValue(row[col]));
      lines.push(`INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(", ")}) VALUES (${values.join(", ")});`);
    }
    lines.push("");
    totalRows += dataRes.rows.length;
    console.log(`  📦 ${table}: ${dataRes.rows.length}건`);
  }

  // 5) 시퀀스 값 복원 (auto-increment 값 맞추기)
  lines.push("-- ============================================");
  lines.push("-- 시퀀스 값 복원");
  lines.push("-- ============================================");
  lines.push("");

  const seqRes = await client.query(`
    SELECT
      t.table_name,
      c.column_name,
      pg_get_serial_sequence(quote_ident(t.table_name), c.column_name) AS seq_name
    FROM information_schema.tables t
    JOIN information_schema.columns c
      ON t.table_name = c.table_name AND t.table_schema = c.table_schema
    WHERE t.table_schema = 'public'
      AND c.column_default LIKE 'nextval%'
    ORDER BY t.table_name;
  `);

  for (const s of seqRes.rows) {
    if (s.seq_name) {
      const maxRes = await client.query(`SELECT COALESCE(MAX("${s.column_name}"), 0) + 1 AS next_val FROM "${s.table_name}";`);
      lines.push(`SELECT setval('${s.seq_name}', ${maxRes.rows[0].next_val}, false);`);
    }
  }
  lines.push("");
  lines.push("-- 백업 완료");

  await client.end();

  // 파일 저장
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupDir = path.join(process.cwd(), "backups");
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  
  const fileName = `neondb_backup_${timestamp}.sql`;
  const filePath = path.join(backupDir, fileName);
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");

  const fileSizeKB = (fs.statSync(filePath).size / 1024).toFixed(1);
  console.log("");
  console.log("🎉 백업 완료!");
  console.log(`   📁 파일: ${filePath}`);
  console.log(`   📊 테이블: ${tables.length}개 / 데이터: ${totalRows}건`);
  console.log(`   💾 파일 크기: ${fileSizeKB} KB`);
}

backup().catch((err) => {
  console.error("❌ 백업 실패:", err);
  process.exit(1);
});

