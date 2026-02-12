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
		
		this.upgradeVisiblePercent = 0.5 // if you have cost * this amount you can at least see the upgrade
		
		this.sealAnim = new Anim( BouncingSeal.sealSprArr,BouncingSeal.sealAnimFPS )
		this.sealCosts = [ 15,50,120,350,600,1000 ]
		this.curSeal = 0
		this.showSeal = false
		this.maxedSeal = false
		this.sealHitbox = null
		this.sealPos = null
		
		this.canClick = false
	}
	
	Update( mouse,dt )
	{
		if( !this.wormAddAnimUpdateTimer.Update( dt ) )
		{
			this.wormCountAnim.Update( dt )
		}
		
		if( !this.maxedSeal && this.nWorms >= this.sealCosts[this.curSeal] )
		{
			this.sealAnim.Update( dt )
			
			if( this.sealHitbox != null )
			{
				// check click for seal upgrade
				if( mouse.down && ( this.canClick || mouse.usingTouch ) &&
					this.nWorms > this.sealCosts[this.curSeal] &&
					this.sealHitbox.Contains( mouse.x,mouse.y ) )
				{
					this.nWorms -= this.sealCosts[this.curSeal]
					++this.curSeal
					this.map.SpawnSeal()
					this.canClick = false
				}
			}
			else if( this.sealAnim.Loaded() && this.sealPos != null )
			{
				this.sealHitbox = new Hitbox( this.sealPos.x,this.sealPos.y,
					this.sealAnim.GetSize().x * Graphics.sprScale,
					this.sealAnim.GetSize().y * Graphics.sprScale,
					false )
			}
		}
		
		if( !mouse.down ) this.canClick = true
	}
	
	Draw( gfx )
	{
		if( this.map.loadedTiles )
		{
			const tileSize = this.map.tileSize
			gfx.DrawRect( 0,gfx.height - tileSize.y,gfx.width,tileSize.y,"#46ba4e" )
		
			if( this.wormCountAnim.Loaded() )
			{
				this.wormCountAnim.Draw( new Vec2( 0,gfx.height - tileSize.y ),gfx,true )
				this.wormCountAnim.Draw(
					new Vec2( 0,gfx.height - tileSize.y + ( 9 + 6 ) * gfx.sprScale ),gfx )
				
				this.numDrawer.DrawNum( this.nWorms,
					new Vec2( tileSize.x / 2,gfx.height - tileSize.y + 9.5 * gfx.sprScale ),
					gfx,true,false )
				
				if( this.showSeal && !this.maxedSeal && this.sealAnim.Loaded() )
				{
					this.sealPos = new Vec2( tileSize.x * 1.5,gfx.height - tileSize.y )
					this.sealAnim.Draw( this.sealPos,gfx )
					
					this.numDrawer.DrawNum( this.sealCosts[this.curSeal],
						new Vec2( this.sealPos.x + this.sealAnim.GetSize().x / 2 * gfx.sprScale,
						gfx.height - 6 * gfx.sprScale ),
						gfx,true,false )
					// if( this.sealHitbox != null ) this.sealHitbox.Draw( gfx )
				}
			}
		}
	}
	
	GetWorm()
	{
		this.wormAddAnimUpdateTimer.Reset()
		
		if( this.nWorms < this.maxWorms ) ++this.nWorms
		
		if( !this.showSeal && this.nWorms >= this.sealCosts[0] * this.upgradeVisiblePercent )
		{
			this.showSeal = true
		}
	}
}