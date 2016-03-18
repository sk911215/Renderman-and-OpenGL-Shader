#version 330 compatibility

out vec3  vMCposition;
out vec3  ECpositon;
out float vLightIntensity;
out vec2  vST;
out vec4  vColor;
out float Z_depth;

const vec3 LIGHTPOS = vec3( -2., 0., 10.);

void
main( )
{
	vST = gl_MultiTexCoord0.st;

	vec3 tnorm = normalize( vec3( gl_NormalMatrix * gl_Normal ) );
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm )  );
	
	vMCposition = gl_Vertex.xyz;

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
	Z_depth = ECposition.z;
	vColor = gl_Color;

}