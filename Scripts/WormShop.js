class WormShop
{
	constructor( gfx,map,numDrawer )
	{
		this.map = map
		this.numDrawer = numDrawer
		
		this.nWorms = 0
		this.maxWorms = 999999
		
		this.wormCountAnim = new Anim( MapWorm.wormSprArr,12 )
		this.wormAddAnimUpdateTimer = new Timer( 0.7,true )
	}
	
	Update( mouse )
	{
		if( !this.wormAddAnimUpdateTimer.Update() )
		{
			this.wormCountAnim.Update()
		}
	}
	
	Draw( gfx )
	{
		if( this.map.loadedTiles )
		{
			gfx.DrawRect( 0,gfx.height - this.map.tileSize.y,gfx.width,this.map.tileSize.y,"#46ba4e" )
		
			if( this.wormCountAnim.Loaded() )
			{
				this.wormCountAnim.Draw( new Vec2( 0,gfx.height - this.map.tileSize.y ),gfx,true )
				this.wormCountAnim.Draw(
					new Vec2( 0,gfx.height - this.map.tileSize.y + ( 9 + 6 ) * gfx.sprScale ),gfx )
				
				this.numDrawer.DrawNum( this.nWorms,
					new Vec2( this.map.tileSize.x / 2,gfx.height - this.map.tileSize.y + 9.5 * gfx.sprScale ),
					gfx,true,false )
			}
		}
	}
	
	GetWorm()
	{
		this.wormAddAnimUpdateTimer.Reset()
		
		if( this.nWorms < this.maxWorms ) ++this.nWorms
	}
}