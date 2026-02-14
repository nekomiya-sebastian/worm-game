class JumpingCat
{
	constructor( pos )
	{
		this.pos = pos
		
		this.idleAnim = new Anim( JumpingCat.idleAnimSprArr )
		
		this.hitbox = null
		this.hSize = Vec2.Zero()
		
		this.loaded = false
		
		this.lookDir = new Vec2( NekoUtils.Choose() ? 1 : -1,0 )
		
		this.vel = Vec2.Zero()
		this.jumpSpd = 15
		this.jumpUp = 25
		this.grav = 2
		this.jumping = false
	}
	
	Update( dt,worms,map,shop )
	{
		let collectedWorm = false
		if( this.loaded )
		{
			this.idleAnim.Update( dt )
			
			for( const worm of worms )
			{
				if( !worm.covered && !worm.collected && worm.loaded )
				{
					if( !worm.claimed && !this.jumping )
					{
						this.Jump( worm.pos.Copy() )
						worm.claimed = true
					}
					
					if( this.hitbox.Overlaps( worm.hitbox ) )
					{
						worm.Collect( shop )
						collectedWorm = true
					}
				}
			}
			
			const testPos = this.pos.Copy().Add( this.vel.Copy().Scale( dt ) )
			
			let canMove = true
			
			if( testPos.x < this.hSize.x ) this.vel.x = Math.abs( this.vel.x )
			else if( testPos.x > map.GetWorldWidth() - this.hSize.x ) this.vel.x = -Math.abs( this.vel.x )
			
			if( testPos.y > map.GetWorldHeight() - this.hSize.y )
			{
				this.vel.SetXY( 0,0 )
				canMove = false
				this.jumping = false
			}
			
			if( canMove )
			{
				this.pos = testPos
				
				this.hitbox.MoveTo( this.pos.x,this.pos.y )
				
				this.vel.y += this.grav * dt
			}
		}
		else if( this.idleAnim.Loaded() )
		{
			this.loaded = true
			
			this.hitbox = new Hitbox( this.pos.x,this.pos.y,
				this.idleAnim.GetSize().x * Graphics.sprScale,
				this.idleAnim.GetSize().y * Graphics.sprScale )
			
			this.hSize = this.hitbox.GetSize().Copy().Divide( 2 )
		}
		
		return( collectedWorm )
	}
	
	Draw( gfx )
	{
		// if( this.hitbox != null ) this.hitbox.Draw( gfx )
		
		if( this.loaded )
		{
			const drawPos = this.pos.Copy().Subtract(
				this.idleAnim.GetSize().Copy().Divide( 2 ).Scale( gfx.sprScale ) )
			
			if( this.jumping )
			{
				JumpingCat.jumpSpr.Draw( drawPos.x,drawPos.y,gfx,this.vel.x > 0.0 )
			}
			else
			{
				this.idleAnim.Draw( drawPos,gfx,this.lookDir.x > 0.0 )
			}
		}
	}
	
	Jump( targetLoc )
	{
		if( !this.jumping )
		{
			this.jumping = true
			
			const velDiv = 400
			this.vel = targetLoc.Copy().Subtract( this.pos ).Divide( velDiv ).Scale( this.jumpSpd )
				.Add( new Vec2( 0,-this.jumpUp ) )
			
			NekoUtils.ArrayChooseRand( JumpingCat.jumpSFX ).Play()
		}
	}
}

JumpingCat.idleAnimSprArr = Anim.GenSprArr( "Images/Cat",2 )
JumpingCat.jumpSpr = new Sprite( "Images/Cat3.png" )
JumpingCat.jumpSFX = [
	new SFX( "Audio/Jump1.mp3",0.2 ),
	new SFX( "Audio/Jump2.mp3",0.2 ),
	new SFX( "Audio/Jump3.mp3",0.2 ),
	new SFX( "Audio/Jump4.mp3",0.2 ),
]