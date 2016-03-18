in vec4  Color;
in float LightIntensity;
in vec3  vMCposition;

uniform float uAd;
uniform float uBd;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uTol;
uniform float uAlpha;
uniform float uBlend;

uniform sampler3D Noise3;

void
main( )
{
  float s = gl_TexCoord[0].s;
  float t = gl_TexCoord[0].t;
  float up = 2. * s;
  float vp = 2. * t;
  
  //noise
  vec4  nv  = texture3D( Noise3, uNoiseFreq * vMCposition );
  float n = nv.r + nv.g + nv.b + nv.a;  // 1. -> 3.
  n = ( n - 2. );       // -1. -> 1.
  float delta = uNoiseAmp * n;
  
  up+=delta;
  
  gl_FragColor = Color;   // default color
  
  float numinu = floor( up / (2.0*uAd) );
  float numinv = floor( vp / (2.0*uBd) );
  

  if( mod( numinu+numinv, 2. ) == 0. )
  {

      float uc = numinu*uAd + uAd/2.;
      float vc = numinv*uBd + uBd/2.;
      up = up - uc;
      vp = vp - vc;
      vec3 upvp =  vec3( up/uAd, vp/uBd, 0. );
      vec3 cntr =  vec3( uc/uAd, vc/uBd, 0. );
      
      float dis =((up - uc)*2./uAd)*((up - uc)*2./uAd) + ((vp - vc)*2./uBd)*((vp - vc)*2./uBd);
      
      if(abs(dis)<1.0+uTol)
      {   

        float td = smoothstep( 1.0-uTol, 1.0+uTol, dis );

        gl_FragColor = mix( vec4( 1., 1., 1. ,1.),Color, td );
        
        if( dis <= 1.-uTol )
        {
            gl_FragColor = vec4( 1., 1., 1. ,1.);
        }

        
        if(uAlpha == 0.)
        {
          discard;
        }

        else
        {
          gl_FragColor.a = uAlpha;
        }
      
      }
 
  }
  
    gl_FragColor.rgb *= LightIntensity; // apply lighting model
}