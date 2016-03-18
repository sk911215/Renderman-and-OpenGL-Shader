#version 330 compatibility

in vec3 Tangent;

out vec3 vBTNx, vBTNy, vBTNz;
out vec2 vST;
out vec3 vDirToLight;	
out vec4 vColor;

out vec3 vNormal, vLight, vEye;
out vec3 vReflectVector;

out vec3 vRefractVector;
out vec3 MCposition, ECposition;


uniform float uForce;
uniform float uLightX, uLightY, uLightZ;
uniform bool uUseReflect;
uniform bool uUseBumpmap;
uniform bool uUseRefract;
uniform float uDayTime;



void main()
{
	float lightx;
	vST = gl_MultiTexCoord0.st;

	lightx = uLightX + uDayTime;

	vec3 LIGHTPOS = vec3(lightx, uLightY, uLightZ);
	if (uUseBumpmap)
	{
		
		vec3 N = normalize( gl_NormalMatrix * gl_Normal );
		vec3 T;
		vec3 B;
	#define GRAM_SCHMIDT_METHOD

	#ifdef HAVE_TANGENT_METHOD
		T = normalize(  vec3( gl_ModelViewMatrix*vec4(Tangent,0.) )  );
		B = normalize( cross(T,N) );
	#endif

	#ifdef GRAM_SCHMIDT_METHOD
		T = vec3( 0.,1.,0.);
		float d = dot( T, N );
		T = normalize( T - d*N );
		B = normalize( cross(T,N) );
	#endif

	#ifdef CROSS_PRODUCT_METHOD
		T = vec3( 0.,1.,0.);
		B = normalize( cross(T,N) );
		T = normalize( cross(N,B) );
	#endif

		vBTNx = vec3( B.x, T.x, N.x );
		vBTNy = vec3( B.y, T.y, N.y );
		vBTNz = vec3( B.z, T.z, N.z );

		vColor = gl_Color;

		vec3 LightPosition = vec3( uLightX, uLightY, uLightZ );
		vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
		vDirToLight = normalize( LightPosition - ECposition );

		gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;

	}


	else if (uUseReflect)
	{
		vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );

		vec3 eyeDir = ECposition - vec3(0.,0.,0.);		// vector from eye to pt
    	vec3 normal = normalize( gl_NormalMatrix * gl_Normal );

    	vReflectVector = reflect( eyeDir, normal );
    	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;

	}

		else if (uUseRefract)
	{
		vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );

		vec3 eyeDir = ECposition - vec3(0.,0.,0.);		// vector from eye to pt
    	vec3 normal = normalize( gl_NormalMatrix * gl_Normal );

    	vRefractVector = refract( eyeDir, normal, 1.4 );
    	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;

	}

	else
	{
	
		float uX,uY,uZ;
		uX = -2.;
		uY = 0.8;
		uZ = 0.5;
		vec4 vertex0 = vec4(uX,uY,uZ,1.);
		vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );

	    vColor = gl_Color; 
		vNormal = normalize(gl_NormalMatrix * gl_Normal);   
		vLight  = LIGHTPOS - ECposition;                    
		vEye    = vec3(0.,0.,0.) - ECposition; 

		gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;


		//morph
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

		//fog
		MCposition = gl_Vertex.xyz;
	
	}  //else
	


	   

}