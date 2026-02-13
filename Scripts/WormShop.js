class WormBuyItem
{
	constructor( anim,costs,pos,upgradeInd,additional = null )
	{
		this.anim = anim
		this.costs = costs
		this.cur = 0
		this.show = false
		this.maxed = false
		this.hitbox = null
		this.pos = pos
		this.upgradeInd = upgradeInd
		this.additional = additional
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
					if( this.additional.loaded )
					{
						this.additional.Draw( this.pos.x + gfx.sprScale * 5,this.pos.y,gfx )
					}
					break
				case 3: // draw +10% for worm king
					if( this.additional.loaded )
					{
						this.additional.Draw( this.pos.x + gfx.sprScale * 2,
							this.pos.y + gfx.sprScale * 6,
							gfx )
					}
					break
			}
		}
	}
	
	Purchase( map )
	{
		const moreWormPercentAdd = 0.2
		const kingWormChanceBuff = 0.08
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
			case 3:
				map.BuffKingWormChance( kingWormChanceBuff )
				break
			case 999:
				map.NextLevel()
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
	
	ShowTut( nWorms )
	{
		return( this.show && this.cur == 0 && nWorms >= this.costs[this.cur] )
	}
}
WormBuyItem.upgradeVisiblePercent = 0.5 // if you have cost * this amount you can at least see the upgrade

class WormShop
{
	constructor( gfx,map,numDrawer )
	{
		this.map = map
		this.numDrawer = numDrawer
		
		this.nWorms = 999
		this.maxWorms = 999999
		
		this.wormCountAnim = new Anim( MapWorm.wormSprArr,12 )
		this.wormAddAnimUpdateTimer = new Timer( 0.7,true )
		
		const xStart = map.tileSize.x * 1
		const xAdd = map.tileSize.x * 1
		let curX = 0
		
		this.tutActive = true
		this.tutAnim = new Anim( Anim.GenSprArr( "Images/Tut",2 ),0 )
		this.tutSpot = new Vec2( xStart,gfx.height - map.tileSize.y - 18 * Graphics.sprScale )
		this.tutHoverTimer = new Timer( 0.8 )
		this.tutHoverDist = 8 * Graphics.sprScale
		
		this.buyItems = [
			new WormBuyItem(
				new Anim( BouncingSeal.sealSprArr,BouncingSeal.sealAnimFPS ),
				[ 15,30,70,110,350,600,1000 ],
				new Vec2( xStart + xAdd * curX++,gfx.height - map.tileSize.y ),
				0
			),
			new WormBuyItem(
				new Anim( MapWorm.wormSprArr,2 ),
				[ 50,90,500,2000 ],
				new Vec2( xStart + xAdd * curX++,gfx.height - map.tileSize.y + 5 * Graphics.sprScale ),
				1,
				new Sprite( "Images/x2.png" )
			),
			new WormBuyItem(
				new Anim( JumpingCat.idleAnimSprArr ),
				[ 80,900,3000 ],
				new Vec2( xStart + xAdd * curX++,gfx.height - map.tileSize.y ),
				2
			),
			new WormBuyItem(
				new Anim( WormKing.kingSprArr,2 ),
				[ 140,700 ],
				new Vec2( xStart + xAdd * curX++,gfx.height - map.tileSize.y + 2 * Graphics.sprScale ),
				3,
				new Sprite( "Images/Plus10.png" )
			),
			new WormBuyItem(
				new Anim( Anim.GenSprArr( "Images/NextArrows",2 ) ),
				[ 100,300,800 ],
				new Vec2( xStart + xAdd * curX++,gfx.height - map.tileSize.y ),
				999
			)
		]
		
		this.canClick = false
	}
	
	Update( mouse,dt )
	{
		if( this.tutActive )
		{
			this.tutAnim.SetFrame( mouse.usingTouch ? 1 : 0 )
			if( this.tutHoverTimer.Update( dt ) ) this.tutHoverTimer.Reset()
		}
		
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
				this.tutActive = false
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
			
			if( this.tutActive && this.tutAnim.Loaded() && this.buyItems[0].ShowTut( this.nWorms ) )
			{
				this.tutAnim.Draw( this.tutSpot.Copy().Add( Vec2.Up().Scale( this.tutHoverDist *
					Math.sin( this.tutHoverTimer.GetPercent() * Math.PI ) ) )
				,gfx )
			}
		}
	}
	
	GetWorm( amount )
	{
		this.wormAddAnimUpdateTimer.Reset()
		
		this.nWorms += amount
		if( this.nWorms > this.maxWorms ) this.nWorms = this.maxWorms
		
		for( const buyItem of this.buyItems ) buyItem.CheckVisible( this.nWorms )
	}
}