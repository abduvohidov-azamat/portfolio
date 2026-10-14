import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { MotionService } from '../../services/motion.service';

// Ashima Arts 3D simplex noise (MIT)
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uHover;
attribute float aRandom;
varying float vNoise;
${NOISE}
void main() {
  vec3 dir = normalize(position);
  float n = snoise(dir * 1.4 + uTime * 0.18);
  float n2 = snoise(dir * 4.0 - uTime * 0.3) * 0.15;
  vNoise = n;
  vec3 p = position + dir * (n * (0.35 + uHover * 0.25) + n2);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (2.0 + aRandom * 3.5) * uPixelRatio * (4.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying float vNoise;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.05, d);
  vec3 col = mix(uColorA, uColorB, smoothstep(-0.5, 0.5, vNoise));
  col = mix(col, uColorC, smoothstep(0.45, 0.9, vNoise));
  gl_FragColor = vec4(col, alpha * 0.85);
}`;

/** Morphing WebGL particle sphere. Three.js is loaded lazily to keep the initial bundle small. */
@Component({
  selector: 'app-hero-canvas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', 'aria-hidden': 'true' },
  template: `<canvas class="size-full"></canvas>`,
})
export class HeroCanvasComponent {
  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const motion = inject(MotionService);
    let cleanup: (() => void) | undefined;
    let destroyed = false;

    afterNextRender(async () => {
      const THREE = await import('three');
      if (destroyed) return;
      const canvas = host.querySelector('canvas')!;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch {
        return; // WebGL unavailable — the CSS gradient backdrop still looks good.
      }
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pixelRatio);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 6;

      const geometry = new THREE.IcosahedronGeometry(1.7, 42);
      const randoms = new Float32Array(geometry.attributes['position'].count).map(() => Math.random());
      geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

      const uniforms = {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uHover: { value: 0 },
        uColorA: { value: new THREE.Color('#8b5cf6') },
        uColorB: { value: new THREE.Color('#22d3ee') },
        uColorC: { value: new THREE.Color('#f472b6') },
      };
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = host;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (e: PointerEvent) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('pointermove', onPointer);

      const clock = new THREE.Clock();
      const render = () => {
        const t = clock.getElapsedTime();
        uniforms.uTime.value = t;
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        uniforms.uHover.value = Math.min(1, Math.hypot(mouse.x, mouse.y));
        points.rotation.y = t * 0.08 + mouse.x * 0.5;
        points.rotation.x = mouse.y * 0.35;
        renderer.render(scene, camera);
      };

      const io = new IntersectionObserver(([entry]) => {
        renderer.setAnimationLoop(entry.isIntersecting && !motion.reducedMotion ? render : null);
      });
      io.observe(host);
      render();

      cleanup = () => {
        renderer.setAnimationLoop(null);
        io.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener('pointermove', onPointer);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    });

    inject(DestroyRef).onDestroy(() => {
      destroyed = true;
      cleanup?.();
    });
  }
}
