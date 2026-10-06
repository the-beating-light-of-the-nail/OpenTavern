<script setup lang="ts">
/**
 * WebGL 着色器背景 + 暗角（classic 玻璃主题专用）。
 * 仅在 theme-classic 下可见（main.css 对 new-light/new-dark/low-power 隐藏）；
 * prefers-reduced-motion 时只渲染一帧静帧；WebGL 不可用时静默降级为透明。
 */
const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const el = canvas.value;
  if (!el) return;
  const gl = el.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false });
  if (!gl) return;

  const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  // 暖色低频光斑：奶油 × 琥珀 × 薰衣草，在近黑底上缓慢游移（对齐 coffee token 色系）
  const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
float glow(vec2 uv, vec2 c, float r){ return pow(max(0., 1. - length(uv - c) / r), 2.2); }
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv; p.x *= u_res.x / u_res.y;
  float t = u_time * 0.05;
  vec3 base = vec3(0.039, 0.035, 0.031);            // #0a0908
  vec3 cream = vec3(0.988, 0.871, 0.753);           // #fcdec0
  vec3 amber = vec3(0.886, 0.639, 0.373);           // 琥珀
  vec3 lilac = vec3(0.769, 0.710, 0.910);           // 薰衣草
  float g1 = glow(p, vec2(0.28 + 0.10 * sin(t * 1.1), 0.72 + 0.08 * cos(t * 0.9)), 0.85);
  float g2 = glow(p, vec2(0.85 + 0.08 * cos(t * 0.8), 0.22 + 0.10 * sin(t * 1.3)), 0.95);
  float g3 = glow(p, vec2(0.55 + 0.12 * sin(t * 0.7 + 2.0), 0.50 + 0.14 * cos(t * 0.6 + 1.0)), 1.15);
  vec3 col = base;
  col += cream * g1 * 0.10 + amber * g2 * 0.08 + lilac * g3 * 0.05;
  // 细颗粒，避免色带
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + u_time) * 43758.5453);
  col += (grain - 0.5) * 0.012;
  gl_FragColor = vec4(col, 1.0);
}`;

  function compile(type: number, src: string): WebGLShader | null {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    return gl!.getShaderParameter(s, gl!.COMPILE_STATUS) ? s : null;
  }
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  let visible = true;

  function resize() {
    if (!el || !gl) return;
    // 玻璃主题下画布被 display:none 隐藏时跳过（省电）
    visible = getComputedStyle(el).display !== 'none' && !document.body.classList.contains('low-power');
    if (!visible) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.floor(window.innerWidth * dpr));
    const h = Math.max(1, Math.floor(window.innerHeight * dpr));
    if (el.width !== w || el.height !== h) {
      el.width = w;
      el.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  function draw(now: number) {
    if (!gl) return;
    if (visible && !document.hidden) {
      gl.uniform2f(uRes, el!.width, el!.height);
      gl.uniform1f(uTime, now * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    if (!reduced) raf = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  if (reduced) {
    draw(0); // 静帧
  } else {
    raf = requestAnimationFrame(draw);
  }

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  });
});
</script>

<template>
  <canvas id="shaderCanvas" ref="canvas" aria-hidden="true" />
  <div id="vignetteOverlay" aria-hidden="true" />
</template>
