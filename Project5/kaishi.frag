#version 330 compatibility


uniform sampler2D uImageUnit;
uniform float uScenter, uTcenter, uDs, uDt; 
uniform float uMagFactor,uRotAngle;
uniform float uSharpFactor;
uniform bool uCircle; 


in vec2 vST;

void main()
{
  
  vec2 st = vST;
  vec4 refractcolor;
  vec3 irgb;
  
  vec4 color = vec4( 1., 0., 0., 1. );

  if(uCircle)
  {
    if(((st.s-uScenter)*(st.s-uScenter)+(st.t-uTcenter)*(st.t-uTcenter))<(uDs*uDs+uDt*uDt))
  {
    
      //Mag
      st -= vec2(uScenter,uTcenter);
      st /= uMagFactor;

      //rotation
      float x_new = st.s*cos(uRotAngle) - st.t*sin(uRotAngle);
      float y_new = st.s*sin(uRotAngle) + st.t*cos(uRotAngle);
      st = vec2(x_new,y_new);
      st += vec2(uScenter,uTcenter);

      //Sharpning
      vec2 isize = textureSize( uImageUnit, 0 );
      float ResS = float( isize.s );
      float ResT = float( isize.t );

      vec2 stp0 = vec2(1./ResS,  0. );
      vec2 st0p = vec2(0.     ,  1./ResT);
      vec2 stpp = vec2(1./ResS,  1./ResT);
      vec2 stpm = vec2(1./ResS, -1./ResT);
      vec3 i00 =   texture2D( uImageUnit, st ).rgb;
      vec3 im1m1 = texture2D( uImageUnit, st-stpp ).rgb;
      vec3 ip1p1 = texture2D( uImageUnit, st+stpp ).rgb;
      vec3 im1p1 = texture2D( uImageUnit, st-stpm ).rgb;
      vec3 ip1m1 = texture2D( uImageUnit, st+stpm ).rgb;
      vec3 im10 =  texture2D( uImageUnit, st-stp0 ).rgb;
      vec3 ip10 =  texture2D( uImageUnit, st+stp0 ).rgb;
      vec3 i0m1 =  texture2D( uImageUnit, st-st0p ).rgb;
      vec3 i0p1 =  texture2D( uImageUnit, st+st0p ).rgb;
      vec3 target = vec3(0.,0.,0.);
      target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
      target += 2.*(im10+ip10+i0m1+i0p1);
      target += 4.*(i00);
      target /= 16.;

      refractcolor = vec4(texture(uImageUnit,st).rgb,1.);

      irgb = texture( uImageUnit,  st ).rgb;
      color = vec4( mix( target, irgb, uSharpFactor ), 1. );
      refractcolor = color;


  }
  else
    refractcolor = vec4(texture2D( uImageUnit, st ).rgb, 1. );

  }





else{


  if((abs(st.s-uScenter)<uDs/2.0)&&(abs(st.t-uTcenter)<uDt/2.0))
  {
    
      //Mag
      st -= vec2(uScenter,uTcenter);
      st /= uMagFactor;

      //rotation
      float x_new = st.s*cos(uRotAngle) - st.t*sin(uRotAngle);
      float y_new = st.s*sin(uRotAngle) + st.t*cos(uRotAngle);
      st = vec2(x_new,y_new);

      st += vec2(uScenter,uTcenter);

      //Sharpning
      vec2 isize = textureSize( uImageUnit, 0 );
      float ResS = float( isize.s );
      float ResT = float( isize.t );

      vec2 stp0 = vec2(1./ResS,  0. );
      vec2 st0p = vec2(0.     ,  1./ResT);
      vec2 stpp = vec2(1./ResS,  1./ResT);
      vec2 stpm = vec2(1./ResS, -1./ResT);
      vec3 i00 =   texture2D( uImageUnit, st ).rgb;
      vec3 im1m1 = texture2D( uImageUnit, st-stpp ).rgb;
      vec3 ip1p1 = texture2D( uImageUnit, st+stpp ).rgb;
      vec3 im1p1 = texture2D( uImageUnit, st-stpm ).rgb;
      vec3 ip1m1 = texture2D( uImageUnit, st+stpm ).rgb;
      vec3 im10 =  texture2D( uImageUnit, st-stp0 ).rgb;
      vec3 ip10 =  texture2D( uImageUnit, st+stp0 ).rgb;
      vec3 i0m1 =  texture2D( uImageUnit, st-st0p ).rgb;
      vec3 i0p1 =  texture2D( uImageUnit, st+st0p ).rgb;
      vec3 target = vec3(0.,0.,0.);
      target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
      target += 2.*(im10+ip10+i0m1+i0p1);
      target += 4.*(i00);
      target /= 16.;

      refractcolor = vec4(texture(uImageUnit,st).rgb,1.);

      irgb = texture( uImageUnit,  st ).rgb;
      color = vec4( mix( target, irgb, uSharpFactor ), 1. );
      refractcolor = color;


  }
  else
    refractcolor = vec4(texture2D( uImageUnit, st ).rgb, 1. );

  }
    gl_FragColor = refractcolor;



}