#version 400 compatibility

in vec3 gNs;
in vec3 gLs;
in vec3 gEs;

uniform float uKa, uKd, uKs;
uniform float uShininess;

void
main( )
{
	vec3 Normal;
	vec3 Light;
	vec3 Eye;


	vec4 uColor=vec4 (1.,0.5,0.,1.);
	Normal = normalize(gNs);
	Light = normalize(gLs);
	Eye = normalize(gEs);
	
	vec4 ambient = uKa * uColor;

  
	float d = max( dot(Normal,Light), 0. );
 
	vec4 diffuse = uKd * d * uColor;

  
	float s = 0.;
  
	if( dot(Normal,Light) > 0. )   
	{
		vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
    
		s = pow( max( dot(Eye,ref),0. ), uShininess);
 

	}

	vec4 specular = uKs * s * vec4 (1,1,1,1);


	gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );
 
}