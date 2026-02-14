class Laser
{
	constructor( pos,target )
	{
		this.pos = pos.Copy()
		const spd = 30
		this.vel = target.Copy().Subtract( pos ).Normalize().Scale( spd )
		
		this.brokenTiles = []
	}
	
	Update( map,dt )
	{
		if( Laser.loaded )
		{
			this.pos.Add( this.vel.Copy().Scale( dt ) )
			
			if( this.x < -Laser.spr.size.x || this.x > map.GetWorldWidth() ||
				this.y < -Laser.spr.size.y )
			{
				return( true )
			}
			
			const tilePos = map.World2TilePos( this.pos )
			if( map.IsTileOnScreen( tilePos.x,tilePos.y ) )
			{
				for( const tile of this.brokenTiles )
				{
					if( tile.x == tilePos.x && tile.y == tilePos.y ) return
				}
				this.brokenTiles.push( tilePos )
				map.BreakTile( tilePos.x,tilePos.y )
			}
		}
		else if( Laser.spr.loaded ) Laser.loaded = true
		
		return( false )
	}
	
	Draw( gfx )
	{
		if( Laser.loaded )
		{
			Laser.spr.Draw(
				this.pos.x - ( Laser.spr.size.x / 2 * gfx.sprScale ),
				this.pos.y - ( Laser.spr.size.y / 2 * gfx.sprScale ),
				gfx,this.vel.x > 0 )
		}
	}
}

Laser.spr = new Sprite( "Images/Laser.png" )
Laser.loaded = false