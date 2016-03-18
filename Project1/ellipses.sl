surface
ovals(
	float	Ad  = 0.0125,
		Bd = 0.05,				// probability of seeing orange
		Ks = 0.5,		
		Kd = 0.5, 				// diffuse  coefficient
		Ka = 0.1, 				// ambient  coefficient
		roughness = 0.1;			// specular roughness
	color	specularColor = color( 1, 1, 1 )	// specular color
)
{
	
	float up = 2. * u;	// because we are rendering a sphere
	float vp = v;
	float numinu = floor( up / (2*Ad) );
	float numinv = floor( vp / (2*Bd) );


	color dotColor = Cs;

	if( mod( numinu+numinv, 2 ) == 0 ) 
	{
				float uc = numinu*2*Ad + Ad; 
				float vc = numinv*2*Bd + Bd; 
				up = (up - uc)/Ad;
				vp = (vp - vc)/Bd;
				point upvp = point( up, vp, 0. );
				point cntr = point( 0., 0., 0. );
				if( distance(upvp, cntr) < 1. )
				{
						dotColor = color( 1., .5, 0. );
				}

	}


	varying vector Nf = faceforward( normalize( N ), I );
	vector V = normalize( -I );


	Oi = 1.;
	Ci = Oi * ( dotColor * ( Ka * ambient() + Kd * diffuse(Nf) ) + specularColor * Ks * specular( Nf, V, roughness ));
}
