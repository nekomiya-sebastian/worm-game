class FloatingText
{
	constructor( anim,drawSpot,hoverDur,hoverDist )
	{
		this.anim = anim
		this.drawSpot = drawSpot
		this.hoverTimer = new Timer( hoverDur )
		this.hoverDist = hoverDist
	}
	
	Update( dt )
	{
		if( this.hoverTimer.Update( dt ) ) this.hoverTimer.Reset()
	}
	
	Draw( gfx )
	{
		if( this.anim.Loaded() )
		{
			this.anim.Draw( this.drawSpot.Copy().Add( Vec2.Up().Scale( this.hoverDist *
				Math.sin( this.hoverTimer.GetPercent() * Math.PI ) ) )
			,gfx )
		}
	}
	
	SetAnimFrame( ind )
	{
		this.anim.SetFrame( ind )
	}
}