import type { Marker } from "./types";

export const init = () => {};

export const resizeCanvas = () => {};

const defaultVsSource = `#version 300 es
	
in vec2 a_position;

void main(){
	gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const defaultFsSource = `#version 300 es
	
precision highp float;

out vec4 outColor;

void main(){
	outColor = vec4(1.0);
}`;

const createGradientFsSource = (markersLen: number): string => {
	const fs = `#version 300 es

	precision highp float;

	// Mouse coords to uv coords
	vec2 mouseToUv (vec2 resolution, vec2 pos) {
		return vec2(
			pos.x / resolution.x,
			(pos.y / resolution.y) * -1.0 + 1.0
		);
	}

	vec3 rgb (vec3 color) {
		return color / 255.0;
	}
	
	struct Marker {
		vec3 color;
		vec2 pos;
	};

	uniform Marker[${markersLen}] u_marker;
	uniform vec2 u_resolution;

	out vec4 outColor;

	void main() {
		float aspect = u_resolution.x / u_resolution.y;
		
		vec2 uv = gl_FragCoord.xy / u_resolution;
		uv.y /= aspect; 
		

		vec3 color = vec3(1.0);

		for(int i = 0; i < ${markersLen}; i++) {
			vec2 pos = mouseToUv(u_resolution, u_marker[i].pos);
			pos.y /= aspect;

			float d = distance(pos, uv);
			d = d * -1.0 + 1.0;
			d *= 2.0;

			vec3 loopColor = d * rgb(u_marker[i].color);

			color = mix(color, loopColor, 0.5);
		}

		outColor = vec4(color, 1.0);
	}
	`;

	return fs;
};

const createShader = (
	gl: WebGL2RenderingContext,
	type: number,
	source: string
) => {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

	if (success) return shader;

	console.error("Failed to create shader");
	const error = gl.getShaderInfoLog(shader);
	gl.deleteShader(shader);
	throw new Error(error);
};

const createProgram = (
	gl: WebGL2RenderingContext,
	vs: WebGLShader,
	fs: WebGLShader
) => {
	const program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	const success = gl.getProgramParameter(program, gl.LINK_STATUS);

	if (success) return program;

	console.error("Failed to create program");
	const error = gl.getProgramInfoLog(program);
	throw new Error(error);
};

const createGeometry = (gl: WebGL2RenderingContext, program: WebGLProgram) => {
	const posAttrLocation = gl.getAttribLocation(program, "a_position");

	const positions = [
		-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
	];

	const posBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	gl.enableVertexAttribArray(posAttrLocation);
	gl.vertexAttribPointer(posAttrLocation, 2, gl.FLOAT, false, 0, 0);
};

export const setMarkersUniformsLocations = (
	gl: WebGL2RenderingContext,
	program: WebGLProgram,
	markers: Marker[]
) => {
	for (let i = 0; i < markers.length; i++) {
		markers[i].colLocation = gl.getUniformLocation(
			program,
			`u_marker[${i}].color`
		);
		markers[i].posLocation = gl.getUniformLocation(
			program,
			`u_marker[${i}].pos`
		);
	}
};

export const setMarkersUniforms = (
	gl: WebGL2RenderingContext,
	markers: Marker[]
) => {
	for (let i = 0; i < markers.length; i++) {
		gl.uniform3f(
			markers[i].colLocation,
			markers[i].r,
			markers[i].g,
			markers[i].b
		);
		gl.uniform2f(markers[i].posLocation, markers[i].x, markers[i].y);
	}
};

export const setupProgram = (
	gl: WebGL2RenderingContext,
	markersLen: number
): WebGLProgram => {
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, defaultVsSource);

	const fragmentShaderSource = markersLen
		? createGradientFsSource(markersLen)
		: defaultFsSource;

	const fragmentShader = createShader(
		gl,
		gl.FRAGMENT_SHADER,
		fragmentShaderSource
	);

	const program = createProgram(gl, vertexShader, fragmentShader);

	createGeometry(gl, program);

	return program;
};

// https://github.com/ashima/webgl-noise/blob/master/src/noise2D.glsl
const simplexNoise = `
//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+10.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;
