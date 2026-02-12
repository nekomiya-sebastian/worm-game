class WormBuyItem
{
	constructor( anim,costs,pos,upgradeInd,additionalSpr = null )
	{
		this.anim = anim
		this.costs = costs
		this.cur = 0
		this.show = false
		this.maxed = false
		this.hitbox = null
		this.pos = pos
		this.upgradeInd = upgradeInd
		this.additionalSpr = additionalSpr
	}
	
	Update( mouse,nWorms,canClick,dt,map )
	{
		const canPurchase = nWorms >= this.costs[this.cur]
		if( !this.maxed && canPurchase )
		{
			this.anim.Update( dt )
			
			if( this.hitbox != null )
			{
				// check click for upgrade
				if( mouse.down && ( canClick || mouse.usingTouch ) &&
					canPurchase &&
					this.hitbox.Contains( mouse.x,mouse.y ) )
				{
					const spent = this.costs[this.cur]
					if( ++this.cur >= this.costs.length ) this.maxed = true
					this.Purchase( map )
					
					return( spent )
				}
			}
			else if( this.anim.Loaded() && this.pos != null && this.hitbox == null )
			{
				this.hitbox = new Hitbox( this.pos.x,this.pos.y,
					this.anim.GetSize().x * Graphics.sprScale,
					this.anim.GetSize().y * Graphics.sprScale,
					false )
			}
		}
		else if( this.maxed ) this.anim.Update( dt )
		
		return( 0 )
	}
	
	Draw( gfx,map,numDrawer )
	{
		if( this.show && this.anim.Loaded() )
		{
			// if( this.hitbox != null ) this.hitbox.Draw( gfx )
			
			this.anim.Draw( this.pos,gfx )
			
			if( !this.maxed )
			{
				numDrawer.DrawNum( this.costs[this.cur],
					new Vec2( this.pos.x + this.anim.GetSize().x / 2 * gfx.sprScale,
					gfx.height - 6 * gfx.sprScale ),
					gfx,true,false )
			}
		
			switch( this.upgradeInd )
			{
				case 1: // draw x2 for 2x worm chance upgrade
					if( this.additionalSpr.loaded )
					{
						this.additionalSpr.Draw( this.pos.x + gfx.sprScale * 5,this.pos.y,gfx )
					}
					break
			}
		}
	}
	
	Purchase( map )
	{
		const moreWormPercentAdd = 0.2
		switch( this.upgradeInd )
		{
			case 0:
				map.SpawnSeal()
				break
			case 1:
				map.BuffWormDensity( moreWormPercentAdd )
				break
			case 2:
				map.SpawnCat()
				break
			default:
				console.log( "Upgrade " + this.upgradeInd + " undefined!" )
				break
		}
	}
	
	CheckVisible( nWorms )
	{
		if( !this.show && nWorms >= this.costs[0] * WormBuyItem.upgradeVisiblePercent )
		{
			this.show = true
		}
	}
}
WormBuyItem.upgradeVisiblePercent = 0.5 // if you have cost * this amount you can at least see the upgrade

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
		
		this.buyItems = [
			new WormBuyItem(
				new Anim( BouncingSeal.sealSprArr,BouncingSeal.sealAnimFPS ),
				[ 15,30,70,120,350,600,1000 ],
				new Vec2( map.tileSize.x * 1.5,gfx.height - map.tileSize.y ),
				0
			),
			new WormBuyItem(
				new Anim( MapWorm.wormSprArr,2 ),
				[ 50,90,500,2000 ],
				new Vec2( map.tileSize.x * 3,gfx.height - map.tileSize.y + 5 * Graphics.sprScale ),
				1,
				new Sprite( "Images/x2.png" )
			),
			new WormBuyItem(
				new Anim( JumpingCat.idleAnimSprArr ),
				[ 80,900,3000 ],
				new Vec2( map.tileSize.x * 4.5,gfx.height - map.tileSize.y ),
				2
			)
		]
		
		this.canClick = false
	}
	
	Update( mouse,dt )
	{
		if( !this.wormAddAnimUpdateTimer.Update( dt ) )
		{
			this.wormCountAnim.Update( dt )
		}
		
		for( const buyItem of this.buyItems )
		{
			const spent = buyItem.Update( mouse,this.nWorms,this.canClick,dt,this.map )
			
			if( spent > 0 )
			{
				this.canClick = false
				this.nWorms -= spent
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
			}
			
			for( const buyItem of this.buyItems ) buyItem.Draw( gfx,this.map,this.numDrawer )
		}
	}
	
	GetWorm()
	{
		this.wormAddAnimUpdateTimer.Reset()
		
		if( this.nWorms < this.maxWorms ) ++this.nWorms
		
		for( const buyItem of this.buyItems ) buyItem.CheckVisible( this.nWorms )
	}
}