class MapWorm
{
	constructor( pos,flipped,wormTile,gfx )
	{
		this.gfx = gfx
		
		this.pos = pos
		this.flipped = flipped
		this.wormAnim = new Anim( MapWorm.wormSprArr )
		this.wormTile = wormTile
		
		this.hitbox = null
		this.loaded = false
		
		this.collected = false
		
		this.covered = true
	}
	
	Update( mouse,canClick,shop )
	{
		if( this.loaded && !this.covered )
		{
			if( mouse.down && this.hitbox.Contains( mouse.x,mouse.y ) &&
				!this.collected && !this.covered && canClick )
			{
				// collect worm on click
				shop.GetWorm()
				this.collected = true
				
				return( true )
			}
		}
		else if( this.wormAnim.Loaded() )
		{
			this.loaded = true
			this.hitbox = new Hitbox( this.pos.x,this.pos.y,
				this.wormAnim.GetSize().x * this.gfx.sprScale,this.wormAnim.GetSize().y * this.gfx.sprScale )
		}
		
		this.wormAnim.Update()
		
		return( false ) // return true if clicked
	}
	
	Draw( gfx )
	{
		if( this.wormAnim.Loaded() && !this.collected )
		{
			this.wormAnim.Draw(
				this.pos.Copy().Subtract( this.wormAnim.GetSize().Copy().Divide( 2 ).Scale( gfx.sprScale ) ),
				gfx,this.flipped )
		}
	}
	
	Uncover()
	{
		this.covered = false
	}
}

MapWorm.wormSprArr = Anim.GenSprArr( "Images/Worm",2 )