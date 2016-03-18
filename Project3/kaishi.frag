#version 330 compatibility

in vec3  vMCposition;
in float  Z_depth;
in float vLightIntensity;
in vec2  vST;
in vec4  vColor;

uniform float uAd;   
uniform float uBd;   
uniform float uNoiseAmp;   
uniform float uNoiseFreq;   
uniform float uTol;  
uniform float uChromaRed;
uniform float uChromaBlue;
uniform bool uUseChromaDepth;
uniform float uAlpha;   
uniform sampler3D Noise3;
uniform bool ChromaDepth;
vec3
Rainbow( float t )
{
  t = clamp( t, 0., 1. );

  float r = 1.;
  float g = 0.0;
  float b = 1.  -  6. * ( t - (5./6.) );

        if( t <= (5./6.) )
        {
                r = 6. * ( t - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( t <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( t - (3./6.) );
                b = 1.;
        }

        if( t <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( t - (2./6.) );
        }

        if( t <= (2./6.) )
        {
                r = 1.  -  6. * ( t - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( t <= (1./6.) )
        {
                r = 1.;
                g = 6. * t;
        }

  return vec3( r, g, b );
}



void
main()
{
  float s = vST.s;
  float t = vST.t;

  float up = 2*s;
  float vp = t;
  float numinu = floor( up / (2*uAd) );
  float numinv = floor( vp / (2*uBd) );

  float chromaT;
  vec3 TheColor;

  vec4  nv  = texture3D( Noise3, uNoiseFreq * vMCposition );
  float n = nv.r + nv.g + nv.b + nv.a;  // 1. -> 3.
  n = n - 2.;       // -1. -> 1.
  float delta = uNoiseAmp * n;


  float uc = numinu*2*uAd + uAd;  
  float vc = numinv*2*uBd + uBd;   

  float d = sqrt(pow((up-uc)/uAd, 2) + pow((vp-vc)/uBd, 2));  

  d =d + delta;  


 float mix_ratio = smoothstep(1-uTol, 1+uTol, d);  

 vec4 Color = mix(vColor, vec4(1., 1., 1., uAlpha), mix_ratio);


gl_FragColor = Color;


if(uUseChromaDepth)
  {
    float chromaT = (2./3.) * ( Z_depth - uChromaRed ) / ( uChromaBlue - uChromaRed );
    chromaT = clamp( chromaT, 0., 2./3. );
    TheColor = Rainbow( chromaT );
    gl_FragColor.xyz = TheColor;
  }


if (gl_FragColor.a == 0) {
    discard;
}


  gl_FragColor.rgb *= vLightIntensity;

}