#version 330 compatibility

in vec2 vST;

uniform sampler2D TexUnit;

void
main( )
{
	vec3 newcolor = texture2D( TexUnit, vST ).rgb;
	gl_FragColor = vec4( newcolor.rgb, 1. );
}
