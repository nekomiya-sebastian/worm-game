class WormKing extends MapWorm
{
	constructor( pos,flipped,wormTile,partSys )
	{
		super( pos,flipped,wormTile,partSys )
		
		this.wormValue = NekoUtils.RandInt( 10,100 )
		
		this.crownAnim = new Anim( WormKing.kingSprArr )
		this.crownLoaded = false
	}
	
	Update( mouse,canClick,shop,dt )
	{
		const result = super.Update( mouse,canClick,shop,dt )
		
		if( this.crownLoaded ) this.crownAnim.SetFrame( this.wormAnim.GetFrame() )
		else if( this.crownAnim.Loaded() ) this.crownLoaded = true
		
		return( result )
	}
	
	Draw( gfx )
	{
		// super.Draw( gfx )
		
		if( this.loaded && this.crownLoaded && !this.collected )
		{
			this.crownAnim.Draw(
				this.pos.Copy().Subtract( this.crownAnim.GetSize().Copy().Divide( 2 ).Scale( gfx.sprScale ) ),
				gfx,this.flipped )
		}
	}
	
	PlayPickupSFX()
	{
		NekoUtils.ArrayChooseRand( WormKing.SFX ).Play()
	}
}

WormKing.kingSprArr = Anim.GenSprArr( "Images/KingWorm",2 )
WormKing.SFX = [
	new SFX( "Audio/WormKing1.mp3",0.2 ),
	new SFX( "Audio/WormKing2.mp3",0.2 ),
	new SFX( "Audio/WormKing3.mp3",0.2 )
]