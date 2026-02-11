class MapWorm
{
	constructor( pos,flipped,wormTile )
	{
		this.pos = pos
		this.flipped = flipped
		this.wormAnim = new Anim( MapWorm.wormSprArr )
		this.wormTile = wormTile
		
		// hitbox used to click worm to collect
	}
	
	Update( mouse,canClick )
	{
		// collect worm on click
		
		this.wormAnim.Update()
		
		return( false ) // return true if clicked
	}
	
	Draw( gfx )
	{
		if( this.wormAnim.Loaded() )
		{
			this.wormAnim.Draw(
				this.pos.Copy().Subtract( this.wormAnim.GetSize().Copy().Divide( 2 ).Scale( gfx.sprScale ) ),
				gfx,this.flipped )
		}
	}
}

MapWorm.wormSprArr = Anim.GenSprArr( "Images/Worm",2 )