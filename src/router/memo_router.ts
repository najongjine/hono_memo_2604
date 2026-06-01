import { Hono } from "hono";
import { query } from "../db/pool.js";

const router = new Hono();

router.get("/", async (c) => {
  const result = await query(`
      SELECT 
        id,
        name,
        email,
        created_at
      FROM users
      ORDER BY id DESC
    `);

  return c.json({
    success: true,
    data: result.rows,
  });
});

export default router;
