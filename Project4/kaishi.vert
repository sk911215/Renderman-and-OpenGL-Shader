#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;

out vec3 vNs;

out vec3 vLs;

out vec3 vEs;

out vec3 vMC;

uniform float uA, uB, uC;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

void
main( )
{ 
  vMC = gl_Vertex.xyz;

  vec4 new_vertex = gl_Vertex;

  new_vertex.z = uA * cos(uB*gl_Vertex.x) * cos(uC*gl_Vertex.y);

  vMC.z = new_vertex.z;

  float dzdx = -uA * uB * sin(uB*new_vertex.x) * cos(uC*new_vertex.y);
  float dzdy = -uA * uC * cos(uB*new_vertex.x) * sin(uC*new_vertex.y);
  vec3 Tx = vec3(1.,0.,dzdx);
  vec3 Ty = vec3(0.,1.,dzdy);
  vec3 new_normal = normalize(cross(Tx,Ty));

  vec4 ECposition = gl_ModelViewMatrix * new_vertex;
    
  vNs = normalize( gl_NormalMatrix * new_normal );  // surface normal vector

  vLs = eyeLightPosition - ECposition.xyz;    // vector from the point

  vEs = vec3( 0., 0., 0. ) - ECposition.xyz;    // vector from the point
 
  gl_Position = gl_ModelViewProjectionMatrix * new_vertex;

}