class BouncingSeal
{
	constructor( spawnPos )
	{
		this.sealAnim = new Anim( BouncingSeal.sealSprArr,BouncingSeal.sealAnimFPS )
		this.pos = spawnPos.Copy()
		const spd = 5
		this.moveDir = new Vec2( NekoUtils.RandFloat( -1,1 ),NekoUtils.RandFloat( -1,1 ) )
			.Normalize().Scale( spd )
		this.hSize = -1
		this.corners = null
	}
	
	Update( dt,map )
	{
		if( this.loaded )
		{
			this.sealAnim.Update( dt )
			
			this.pos.Add( this.moveDir.Copy().Scale( dt ) )
			
			let modifiedPos = false
			if( this.pos.y < this.hSize.y )
			{
				this.moveDir.y = Math.abs( this.moveDir.y )
				modifiedPos = true
			}
			if( this.pos.y > map.GetWorldHeight() - this.hSize.y )
			{
				this.moveDir.y = -Math.abs( this.moveDir.y )
				modifiedPos = true
			}
			if( this.pos.x < this.hSize.x )
			{
				this.moveDir.x = Math.abs( this.moveDir.x )
				modifiedPos = true
			}
			if( this.pos.x > map.GetWorldWidth() - this.hSize.x )
			{
				this.moveDir.x = -Math.abs( this.moveDir.x )
				modifiedPos = true
			}
			
			if( !modifiedPos )
			{
				for( const corner of this.corners )
				{
					const checkPos = this.pos.Copy().Add( corner )
					if( map.GetTileWorld( checkPos ) > 1 )
					{
						const hitTile = map.World2TilePos( checkPos )
						const hitTilePos = map.Tile2WorldPos( hitTile.x,hitTile.y,true )
						const diff = this.pos.Copy().Subtract( hitTilePos )
						
						if( Math.abs( diff.x ) > Math.abs( diff.y ) )
						{
							// console.log( "bounce x " + diff.x + ", " + diff.y )
							if( diff.x > 0 ) this.moveDir.x = Math.abs( this.moveDir.x )
							else this.moveDir.x = -Math.abs( this.moveDir.x )
						}
						else
						{
							// console.log( "bounce y " + diff.x + ", " + diff.y )
							if( diff.y > 0 ) this.moveDir.y = Math.abs( this.moveDir.y )
							else this.moveDir.y = -Math.abs( this.moveDir.y )
						}
						
						this.PlayBounceSFX()
						
						map.BreakTile( hitTile.x,hitTile.y )
						
						break
					}
				}
			}
			else this.PlayBounceSFX()
		}
		else if( this.sealAnim.Loaded() )
		{
			this.loaded = true
			this.hSize = this.sealAnim.GetSize().Copy().Divide( 2 ).Scale( Graphics.sprScale )
			this.corners = [
				this.hSize,
				new Vec2( -this.hSize.x,this.hSize.y ),
				new Vec2( this.hSize.x,-this.hSize.y ),
				new Vec2( -this.hSize.x,-this.hSize.y )
			]
		}
	}
	
	Draw( gfx )
	{
		if( this.sealAnim.Loaded() )
		{
			this.sealAnim.Draw(
				this.pos.Copy().Subtract( this.sealAnim.GetSize().Copy().Divide( 2 ).Scale( gfx.sprScale ) ),
				gfx,this.moveDir.x > 0.0 )
			
			// const drawPos = this.pos.Copy().Subtract( this.sealAnim.GetSize().Copy().Divide( 2 ).Scale( gfx.sprScale ) )
			// gfx.DrawRect( drawPos.x,drawPos.y,this.hSize.x * 2,this.hSize.y * 2,"red" )
		}
	}
	
	PlayBounceSFX()
	{
		NekoUtils.ArrayChooseRand( BouncingSeal.bounceSFX ).Play()
	}
}

BouncingSeal.sealSprArr = Anim.GenSprArr( "Images/Seal",4 )
BouncingSeal.sealAnimFPS = 12
BouncingSeal.bounceSFX = [
	new SFX( "Audio/Seal1.mp3",0.1 ),
	new SFX( "Audio/Seal2.mp3",0.1 ),
	new SFX( "Audio/Seal3.mp3",0.1 ),
	new SFX( "Audio/Seal4.mp3",0.1 ),
]