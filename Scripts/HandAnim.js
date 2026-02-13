class HandAnim
{
	constructor( anim,offset )
	{
		this.anim = anim
		this.loaded = false
		this.handPos = Vec2.Zero()
		this.animOffset = offset
		this.active = false
	}
	
	Update( dt )
	{
		if( this.loaded )
		{
			if( this.active && this.anim.Update( dt ) ) this.active = false
		}
		else if( this.anim.Loaded() ) this.loaded = true
	}
	
	Draw( gfx )
	{
		if( this.loaded && this.active )
		{
			this.anim.Draw(
				this.handPos.Copy().Add( this.animOffset.Copy().Scale( Graphics.sprScale ) ),
				gfx )
		}
	}
	
	Activate( x,y )
	{
		this.active = true
		this.handPos.SetXY( x,y )
		this.anim.Reset()
	}
}