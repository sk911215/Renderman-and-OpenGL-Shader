surface
ovals(
	float	Ad  = 0.025,
		Bd = 0.10,				// probability of seeing orange
		Ks = 0.5,		
		Kd = 0.5, 				// diffuse  coefficient
		Ka = 0.1, 				// ambient  coefficient
		roughness = 0.1;			// specular roughness
	color	specularColor = color( 1, 1, 1 )	// specular color
)
{
	varying vector Nf = faceforward( normalize( N ), I );
	vector V = normalize( -I );


	float up = 2. * u;	// because we are rendering a sphere
	float vp = v;
	float numinu = floor( up / (2*Ad) );
	float numinv = floor( vp / (2*Bd) );


	color dotColor = Cs;


				// noise magnitude
				point PP = point "shader" P;
				float magnitude = 0.;
				float size = 1;   //like noiseFreq
				float i;
				for( i = 0.; i < 6.0; i += 1.0 )
				{
					magnitude += 3*(noise(3* size * PP ) - 0.5 ) / size;
					size *= 2.0;
				}


				float uc = numinu*2*Ad + Ad; 
				float vc = numinv*2*Bd + Bd; 
				up = (up - uc)/Ad;
				vp = (vp - vc)/Bd;
				point upvp = point( up, vp, 0. );
				point cntr = point( 0., 0., 0. );


				vector delta = upvp - cntr;


				float oldrad = length(delta);
				float newrad = oldrad + magnitude;
				delta = delta * newrad / oldrad;

				float deltau = xcomp(delta) ;
				float deltav = ycomp(delta);


				up = deltau;
				vp = deltav ;


				float ellipseEquation= up*up +vp *vp;




				if( ellipseEquation <= 1. )
				{

						
						dotColor = color( 1., .5, 0. );
				}

	


	
	Oi = 1.;
	Ci = Oi * ( dotColor * ( Ka * ambient() + Kd * diffuse(Nf) ) + specularColor * Ks * specular( Nf, V, roughness ));
}
