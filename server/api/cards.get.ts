/**
 * GET /api/cards?search=xxx&limit=30
 * 迁移自原 functions/api/card.js（Cloudflare Pages Functions + D1）。
 * Nitro cloudflare-pages 预设下，event.context.cloudflare.env 提供 D1 绑定。
 */
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const cfEnv = (event.context as any)?.cloudflare?.env as Record<string, any> | undefined;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (getMethod(event) === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!cfEnv?.DB) {
    throw createError({ statusCode: 500, statusMessage: 'D1 binding (DB) not configured' });
  }

  const search = url.searchParams.get('search') || '';
  const limit = parseInt(url.searchParams.get('limit') || '30');

  let query = `
    SELECT id, name, tags, short_description, download_count
    FROM cards
    WHERE status = 'curated'
  `;
  const params: (string | number)[] = [];

  if (search) {
    query += ` AND (name LIKE ? OR short_description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY download_count DESC, created_at DESC LIMIT ?`;
  params.push(limit);

  const { results } = await cfEnv.DB.prepare(query).bind(...params).all();

  return Response.json({ success: true, data: results }, { headers: corsHeaders });
});
