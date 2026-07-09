/**
 * GET /api/cards/:id —— 返回完整 card_json + lorebook。
 * 迁移自原 functions/api/card.js。
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
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

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing card id' });
  }

  const { results } = await cfEnv.DB
    .prepare(`SELECT card_json, lorebook_json FROM cards WHERE id = ? AND status = 'curated'`)
    .bind(id)
    .all();

  if (!results.length) {
    return Response.json({ success: false, error: 'Card not found' }, { status: 404, headers: corsHeaders });
  }

  const card = JSON.parse(results[0].card_json as string);
  if (results[0].lorebook_json) {
    card.data.character_book = JSON.parse(results[0].lorebook_json as string);
  }

  return Response.json({ success: true, data: card }, { headers: corsHeaders });
});
