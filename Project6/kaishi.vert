out vec3  vMCposition;
out vec4  Color;
out float LightIntensity;

uniform float uForce;

void main( )
{

	float uX,uY,uZ;


	uX = -4.;
	uY = 0.8;
	uZ = 0.5;

	vec4 vertex0 = vec4(uX,uY,uZ,1.);

    vec3 tnorm      = normalize( vec3( gl_NormalMatrix * gl_Normal ) );

	vec3 LightPos = vec3( 5., 10., 10. );

	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );

    LightIntensity  = abs( dot( normalize(LightPos - ECposition), tnorm ) );
	
		
	Color = gl_Color;

	gl_TexCoord[0] = gl_MultiTexCoord0;
	
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;

	float dis = distance(gl_Vertex.xyz, vertex0.xyz);
	
	vec4 positionA =  mix(gl_Vertex,vec4(uX,uY,uZ,1.), uForce/(dis*dis) );
	
	vec4 vertex1 = vec4(-uX,-uY,-uZ,1.);
	float dis1 = distance(positionA.xyz, vertex1.xyz);
	vec4 positionB =  gl_ModelViewProjectionMatrix *mix(positionA,vec4(-uX,-uY,-uZ,1.), 0 );
	
	
	if(dot((mix(positionA,vec4(-uX,-uY,-uZ,1.),0 ).xyz-vertex0.xyz ),gl_Vertex.xyz-vertex0.xyz)<=0.0)
		gl_Position = gl_ModelViewProjectionMatrix *vec4(uX,uY,uZ,1.);
	else
		{
		if(dot((mix(positionA,vec4(-uX,-uY,-uZ,1.), 0).xyz-vertex1.xyz ),gl_Vertex.xyz-vertex1.xyz)<=0.0)
			gl_Position = gl_ModelViewProjectionMatrix *vec4(-uX,-uY,-uZ,1.);
		else
			gl_Position = positionB;
		}
	
}