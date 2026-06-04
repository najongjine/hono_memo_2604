import { Hono } from "hono";
import { query } from "../db/pool.js";

const router = new Hono();

router.get("/", async (c) => {
  try {
    const result = await query(`
      SELECT 
       *
      FROM t_memo
      ORDER BY id DESC
    `);

    return c.json({
      success: true,
      data: result.rows,
    });
  } catch (e: any) {
    return c.json({
      success: false,
      data: null,
      msg: `!server error. ${e?.message}`,
    });
  }
});

router.get("/select_by_id", async (c) => {
  try {
    const id = Number(c.req.query("id") || 0);
    const result = await query(
      `
      SELECT 
       *
      FROM t_memo
      WHERE id=$1
    `,
      [id],
    );
    console.log(`#result:`, result);

    return c.json({
      success: true,
      data: result.rows,
    });
  } catch (e: any) {
    return c.json({
      success: false,
      data: null,
      msg: `!server error. ${e?.message}`,
    });
  }
});

router.post("/upsert_memo", async (c) => {
  try {
    const body = await c.req.parseBody();
    const id = Number(body["id"] || 0);
    const title = String(body["title"] || "");
    const content = String(body["content"] || "");
    const nickname = String(body["nickname"] || "");
    let result: any = {};
    if (id > 0) {
      result = await query(
        `
    UPDATE t_memo SET
    title=$1,
    content=$2,
    nickname=$3
    WHERE id=$4
    `,
        [title, content, nickname, id],
      );
      console.log(`#result:`, result);
    } else {
      result = await query(
        `
    INSERT INTO t_memo(title,content,nickname)
    VALUES($1,$2,$3)
    `,
        [title, content, nickname],
      );
      console.log(`#result:`, result);
    }

    return c.json({
      success: true,
      data: result?.rows,
    });
  } catch (e: any) {
    return c.json({
      success: false,
      data: null,
      msg: `!server error. ${e?.message}`,
    });
  }
});

router.post("/delete_memo", async (c) => {
  try {
    const body = await c.req.parseBody();
    const id = Number(body["id"] || 0);
    const result = await query(
      `
    DELETE FROM t_memo
    WHERE id = $1
    `,
      [id],
    );
    console.log(`#result:`, result);

    return c.json({
      success: true,
      data: result?.rows,
    });
  } catch (e: any) {
    return c.json({
      success: false,
      data: null,
      msg: `!server error. ${e?.message}`,
    });
  }
});
export default router;
