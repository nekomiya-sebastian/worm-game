class Dragon
{
	constructor( spawnPos )
	{
		this.anim = new Anim( Dragon.sprArr )
		this.pos = spawnPos.Copy()
		
		this.moveDir = new Vec2( NekoUtils.RandFloat( -1,1 ),NekoUtils.RandFloat( -1,1 ) )
			.Normalize().Scale( Dragon.spd )
		this.flyDurRange = new Range( 3,7 )
		this.flyDur = new Timer( this.flyDurRange.RandFloat() )
		
		this.fireballRefire = new Timer( 1.0 )
		
		this.hSize = -1
		
		this.loaded = false
	}
	
	Update( map,dt )
	{
		if( this.flyDur.Update( dt ) )
		{
			this.flyDur.Reset()
			this.Retarget( map )
		}
		else if( this.loaded )
		{
			this.anim.Update( dt )
			
			if( this.pos.y < this.hSize.y ) this.moveDir.y = Math.abs( this.moveDir.y )
			if( this.pos.y > map.GetWorldHeight() - this.hSize.y ) this.moveDir.y = -Math.abs( this.moveDir.y )
			if( this.pos.x < this.hSize.x ) this.moveDir.x = Math.abs( this.moveDir.x )
			if( this.pos.x > map.GetWorldWidth() - this.hSize.x ) this.moveDir.x = -Math.abs( this.moveDir.x )
			
			this.pos.Add( this.moveDir.Copy().Scale( dt ) )
			
			if( this.fireballRefire.Update( dt ) )
			{
				this.fireballRefire.Reset()
				
				const shotOffset = Dragon.shotOffsets[this.anim.GetFrame()]
					.Copy().Scale( Graphics.sprScale )
				if( this.moveDir.x < 0 ) shotOffset.x *= -1
				const shotPos = this.pos.Copy().Add( shotOffset )
				
				const targetTile = map.GetRandTileFilled( false )
				if( targetTile != null )
				{
					const targetPos = map.Tile2WorldPos( targetTile.x,targetTile.y,true )
					
					NekoUtils.ArrayChooseRand( Dragon.fireballSFX ).Play()
					
					return( new Fireball( shotPos,targetPos ) )
				}
			}
		}
		else if( this.anim.Loaded() )
		{
			this.loaded = true
			
			this.hSize = this.anim.GetSize().Copy().Divide( 2 ).Scale( Graphics.sprScale )
		}
		
		return( null )
	}
	
	Draw( gfx )
	{
		if( this.loaded )
		{
			this.anim.Draw(
				this.pos.Copy().Subtract( this.anim.GetSize().Copy().Divide( 2 ).Scale( gfx.sprScale ) ),
				gfx,this.moveDir.x > 0.0 )
		}
	}
	
	Retarget( map )
	{
		this.flyDur.SetDur( this.flyDurRange.RandFloat() )
		
		const targetTile = map.GetRandTile()
		const targetPos = map.Tile2WorldPos( targetTile.x,targetTile.y,true )
		this.moveDir.Set( targetPos.Copy().Subtract( this.pos ).Normalize()
			.Scale( Dragon.spd ) )
	}
}

Dragon.sprArr = Anim.GenSprArr( "Images/Dragon",2 )
Dragon.spd = 5
Dragon.shotOffsets = [ new Vec2( 17,0 ),new Vec2( 19,5 ) ]
Dragon.fireballSFX = [
	new SFX( "Audio/Fireball1.mp3",0.2 ),
	new SFX( "Audio/Fireball2.mp3",0.2 ),
	new SFX( "Audio/Fireball3.mp3",0.2 )
]