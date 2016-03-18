#version 330 compatibility

uniform float uKa, uKd, uKs;

uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;
uniform bool uUseReflect;
uniform bool uUseRefract;
uniform int uFogStep;
uniform float Timer;
uniform sampler3D Noise3;

uniform bool uUseBumpmap;
uniform float uBumpDensity;
uniform float uBumpSize;
uniform float uAng;
uniform float uAmbient;

in vec3 vNormal, vLight, vEye;
in vec3 MCposition, ECposition;

in vec3 vBTNx, vBTNy, vBTNz;
in vec2 vST;
in vec3 vDirToLight;
in vec4 vColor;

in vec3  vReflectVector;
in vec3 vRefractVector;

float Cang, Sang;
const float PI = 3.14159265;



vec3
ToXyz( vec3 sth )
{
  float xp = sth.x*Cang - sth.y*Sang;
  sth.y    = sth.x*Sang + sth.y*Cang;
  sth.x    = xp;
  // sth.z = sth.z;
  sth = normalize( sth );

  vec3 xyz;
  xyz.x = dot( vBTNx, sth );
  xyz.y = dot( vBTNy, sth );
  xyz.z = dot( vBTNz, sth );
  return normalize( xyz );
}


void main()
{
  
  if (vST.s>=0.5 && vST.t>=0.5)
        vec4 uColor = vec4 (0.2, 0.2, 0.2, 1.); 
    else
        uColor = vColor;

  if(uUseBumpmap)
  {
    float uBumpHeight; 
    uBumpHeight = 0.005;

    vec2 st = vST.st; // locate the bumps based on (s,t)

    float Swidth  = 1. / uBumpDensity;
    float Theight = 1. / uBumpDensity;
    float numInS = floor( st.s /  Swidth );
    float numInT = floor( st.t / Theight );

    vec2 center;
    center.s = numInS * Swidth   +   Swidth/2.;
    center.t = numInT * Theight  +  Theight/2.;
    st -= center; // st is now wrt the center of the bump

    Cang = cos(uAng);
    Sang = sin(uAng);
    vec2 stp;   // st' = st rotated by -Ang
    stp.s =  st.s*Cang + st.t*Sang;
    stp.t = -st.s*Sang + st.t*Cang;
    float theta = atan( stp.t, stp.s );

    vec3 normal = ToXyz( vec3( 0., 0., 1. ) );

    if( abs(stp.s) > Swidth/4.  ||  abs(stp.t) > Theight/4. )
    {
      normal = ToXyz( vec3( 0., 0., 1. ) );
    }
    else
    {
      if( PI/4. <= theta  &&  theta <= 3.*PI/4. )
      {
         normal = ToXyz(  vec3( 0., uBumpHeight, Theight/4. )  );
      }
      else if( -PI/4. <= theta  &&  theta <= PI/4. )
      {
        normal = ToXyz(  vec3( uBumpHeight, 0., Swidth/4. )  );
      }
      else if( -3.*PI/4. <= theta  &&  theta <= -PI/4. )
      {
        normal = ToXyz(  vec3( 0., -uBumpHeight, Theight/4. )  );
      }
      else if( theta >= 3.*PI/4.  ||  theta <= -3.*PI/4. )
      {
        normal = ToXyz(  vec3( -uBumpHeight, 0., Swidth/4. )  );
      }
    }


    float intensity = uAmbient + (1.-uAmbient)*dot(normal, vDirToLight);
    vec3 litColor = uColor.rgb * intensity;
    gl_FragColor = vec4( litColor, 1. );

  }


  else if(uUseReflect)
  {
    vec3 reflectcolor;

    reflectcolor= textureCube( uReflectUnit, vReflectVector ).rgb;

    gl_FragColor = vec4( reflectcolor, 1. );
  }


  else if(uUseRefract)
  {
    vec3 refractcolor;

    refractcolor = textureCube( uRefractUnit, vRefractVector ).rgb;

    gl_FragColor = vec4( refractcolor, 1. );
  }


  else
  {
    vec3 normLight = normalize(vLight);
    vec3 normEye   = normalize(vEye);

    vec4 ambient = uKa * uColor;
    float cd = max(dot(vNormal,normLight), 0.);  
    vec4 diffuse = uKd * cd * uColor;

    float cs = 0.;   
    if (dot(vNormal,normLight) > 0.) 
    {
      vec3 ref = normalize(2. * vNormal * dot(vNormal,normLight) - normLight);
      cs = pow(max(dot(normEye,ref), 0.), 10.);
    }

    vec4 specular = uKs * cs * vec4 (1,0.6,0,1);


    vec4 Lightcolor =vec4(ambient.rgb + diffuse.rgb + specular.rgb, 1);

    //fog

    float fogDensity = 0.;
    vec3 sampleLoc = MCposition;
 
    fogDensity += float(texture3D(Noise3, 1*MCposition + 2*Timer)/(uFogStep));
    sampleLoc += normEye/uFogStep;


    gl_FragColor = mix(Lightcolor, vec4(0.7,0.7,0.7,1), fogDensity);



  }  //else




}