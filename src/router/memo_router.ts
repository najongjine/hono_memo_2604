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

export default router;
