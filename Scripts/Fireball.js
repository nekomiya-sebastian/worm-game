class Fireball
{
	constructor( pos,target )
	{
		this.pos = pos.Copy()
		const diff = target.Copy().Subtract( pos )
		this.travelDist = diff.GetDist()
		
		this.moveSpd = 20
		this.moveDir = diff.Normalize().Scale( this.moveSpd )
	}
	
	Update( map,dt,partSys )
	{
		if( Fireball.loaded )
		{
			this.pos.Add( this.moveDir.Copy().Scale( dt ) )
			this.travelDist -= this.moveSpd * dt
			if( this.travelDist <= 0 )
			{
				this.SpawnAOE( map.World2TilePos( this.pos ),map )
				partSys.SpawnParts( this.pos,NekoUtils.RandInt( 3,7 ),1 )
				return( true )
			}
		}
		else if( Fireball.spr.loaded ) Fireball.loaded = true
		
		return( false )
	}
	
	Draw( gfx )
	{
		if( Fireball.loaded )
		{
			Fireball.spr.Draw(
				this.pos.x - ( Fireball.spr.size.x / 2 * gfx.sprScale ),
				this.pos.y - ( Fireball.spr.size.y / 2 * gfx.sprScale ),
				gfx,this.moveDir.x > 0 )
		}
	}
	
	SpawnAOE( centerTile,map )
	{
		const aoeOffsets = [
			Vec2.Up(),
			Vec2.Down(),
			Vec2.Left(),
			Vec2.Right()
		]
		
		for( const offset of aoeOffsets )
		{
			const curTile = centerTile.Copy().Add( offset )
			if( map.IsTileOnScreen( curTile.x,curTile.y ) )
			{
				map.BreakTile( curTile.x,curTile.y,1,false )
			}
		}
		
		map.BreakTile( centerTile.x,centerTile.y,1,true )
	}
}

Fireball.spr = new Sprite( "Images/Fireball.png" )
Fireball.loaded = false