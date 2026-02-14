class Nekosaurus
{
	constructor( spawnPos )
	{
		this.pos = spawnPos.Copy().Add( Vec2.Down().Scale( Graphics.sprScale / 2 ) )
		
		this.anim = new Anim( Nekosaurus.sprArr )
		
		this.loaded = false
		
		this.laserTimer = new Timer( 0.8 )
		
		this.lookDir = NekoUtils.Choose() ? 1 : -1
	}
	
	Update( map,dt )
	{
		if( this.loaded )
		{
			this.anim.Update( dt )
			
			if( this.laserTimer.Update( dt ) )
			{
				this.laserTimer.Reset()
				
				const targetTile = map.GetRandTileFilled( false )
				if( targetTile != null )
				{
					const targetPos = map.Tile2WorldPos( targetTile.x,targetTile.y,true )
					this.lookDir = ( targetPos.x > this.pos.x ? -1 : 1 )
					
					const shotOffset = Nekosaurus.shotOffsets[this.anim.GetFrame()]
						.Copy().Scale( Graphics.sprScale )
					if( this.lookDir > 0 ) shotOffset.x *= -1
					const shotPos = this.pos.Copy().Add( shotOffset )
					
					NekoUtils.ArrayChooseRand( Nekosaurus.laserSFX ).Play()
					
					return( new Laser( shotPos,targetPos ) )
				}
			}
		}
		else if( this.anim.Loaded() )
		{
			this.loaded = true
		}
		
		return( null )
	}
	
	Draw( gfx )
	{
		if( this.loaded )
		{
			this.anim.Draw(
				this.pos.Copy().Subtract( this.anim.GetSize().Copy().Divide( 2 ).Scale( gfx.sprScale ) ),
				gfx,this.lookDir > 0 )
		}
	}
}

Nekosaurus.sprArr = Anim.GenSprArr( "Images/Nekosaurus",2 )
Nekosaurus.shotOffsets = [ new Vec2( 9,8 ),new Vec2( 9,2 ) ]
Nekosaurus.laserSFX = [
	new SFX( "Audio/Laser1.mp3",0.2 ),
	new SFX( "Audio/Laser2.mp3",0.2 ),
	new SFX( "Audio/Laser3.mp3",0.2 ),
	new SFX( "Audio/Laser4.mp3",0.2 )
]