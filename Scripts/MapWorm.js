class MapWorm
{
	constructor( pos,flipped,wormTile,partSys )
	{
		this.partSys = partSys
		
		this.pos = pos
		this.flipped = flipped
		this.wormAnim = new Anim( MapWorm.wormSprArr )
		this.wormTile = wormTile
		
		this.hitbox = null
		this.loaded = false
		
		this.collected = false
		this.covered = true
		
		this.wormValue = 1
	}
	
	Update( mouse,canClick,shop,dt )
	{
		if( this.loaded && !this.covered )
		{
			if( mouse.down && this.hitbox.Contains( mouse.x,mouse.y ) &&
				!this.collected && !this.covered && canClick )
			{
				// collect worm on click
				this.Collect( shop )
				
				return( true )
			}
		}
		else if( this.wormAnim.Loaded() )
		{
			this.loaded = true
			this.hitbox = new Hitbox( this.pos.x,this.pos.y,
				this.wormAnim.GetSize().x * Graphics.sprScale,
				this.wormAnim.GetSize().y * Graphics.sprScale )
				.Expand( MapWorm.hitboxExpandAmount )
		}
		
		this.wormAnim.Update( dt )
		
		return( false ) // return true if clicked
	}
	
	Draw( gfx )
	{
		if( this.loaded && !this.collected )
		{
			// this.hitbox.Draw( gfx )
			
			this.wormAnim.Draw(
				this.pos.Copy().Subtract( this.wormAnim.GetSize().Copy().Divide( 2 ).Scale( gfx.sprScale ) ),
				gfx,this.flipped )
		}
	}
	
	Uncover()
	{
		this.covered = false
	}
	
	Collect( shop )
	{
		if( !this.collected )
		{
			shop.GetWorm( this.wormValue )
			this.collected = true
			
			let partAmount = this.wormValue
			if( partAmount > 10 )
			{
				partAmount = Math.floor( Math.max( 10,partAmount / ( WormMap.kingWormChance * 10 ) ) )
			}
			
			this.partSys.SpawnParts( this.pos,partAmount,0 )
			
			this.PlayPickupSFX()
		}
	}
	
	PlayPickupSFX()
	{
		NekoUtils.ArrayChooseRand( MapWorm.SFX ).Play()
	}
}

MapWorm.wormSprArr = Anim.GenSprArr( "Images/Worm",2 )
MapWorm.hitboxExpandAmount = 15 * Graphics.sprScale
MapWorm.SFX = [
	new SFX( "Audio/Worm1.mp3",0.2 ),
	new SFX( "Audio/Worm2.mp3",0.2 ),
	new SFX( "Audio/Worm3.mp3",0.2 ),
	new SFX( "Audio/Worm4.mp3",0.2 ),
]