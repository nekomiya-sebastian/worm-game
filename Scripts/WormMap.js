class WormMap
{
	constructor( gfx )
	{
		this.tileSprs = [
			new Sprite( "Images/SkyTile.png" ),
			new Sprite( "Images/DirtTile.png" ),
			new Sprite( "Images/GrassTile.png" )
		]
		
		this.tiles = []
		this.loadedTiles = false
		
		this.width = -1
		this.height = -1
		this.tileSize = -1
		
		this.canClick = false
		
		this.wormDensity = 0.3
		this.worms = []
	}
	
	Update( mouse,shop )
	{
		if( this.loadedTiles )
		{
			if( mouse.down )
			{
				if( this.canClick )
				{
					const tileX = Math.floor( mouse.x / this.tileSize.x )
					const tileY = Math.floor( mouse.y / this.tileSize.y )
					const curTile = this.tiles[tileY * this.width + tileX]
					if( curTile > 1 )
					{
						--this.tiles[tileY * this.width + tileX]
						this.canClick = false
					}
				}
			}
			
			for( const worm of this.worms )
			{
				if( worm.Update( mouse,this.canClick,shop ) ) this.canClick = false
				if( this.GetTile( worm.wormTile.x,worm.wormTile.y ) == 1 ) worm.Uncover()
			}
		}
		
		if( !mouse.down ) this.canClick = true
	}
	
	Draw( gfx )
	{
		if( this.loadedTiles )
		{
			for( let y = 0; y < this.height; ++y )
			{
				for( let x = 0; x < this.width; ++x )
				{
					const curTile = this.GetTile( x,y )
					gfx.DrawSprite( x * this.tileSize.x,y * this.tileSize.y,
						this.tileSprs[curTile] )
				}
			}
			
			for( const worm of this.worms )
			{
				if( this.GetTile( worm.wormTile.x,worm.wormTile.y ) == 1 ) worm.Draw( gfx )
			}
		}
		else
		{
			// only set dims once all tiles are loaded
			let loaded = true
			for( const tile of this.tileSprs )
			{
				if( !tile.loaded )
				{
					loaded = false
					break
				}
			}
			if( loaded ) this.InitLoadTiles( gfx )
		}
	}
	
	InitLoadTiles( gfx )
	{
		this.tileSize = new Vec2( this.tileSprs[0].size.x,this.tileSprs[0].size.y ).Scale( gfx.sprScale )
		this.width = gfx.width / this.tileSize.x
		this.height = gfx.height / this.tileSize.y - 1
		
		// console.log( "dims: " + this.width + "," + this.height )
		// console.log( "tileSize: " + this.tileSize.x + "," + this.tileSize.y )
		if( this.width - Math.floor( this.width ) > 0 ) console.log( "invalid width!" )
		if( this.height - Math.floor( this.height ) > 0 ) console.log( "invalid height!" )
		
		this.loadedTiles = true
		
		for( let y = 0; y < this.height; ++y )
		{
			for( let x = 0; x < this.width; ++x )
			{
				this.tiles.push( 2 )
				
				if( NekoUtils.Chance( this.wormDensity ) )
				{
					const wormPos = new Vec2( x * this.tileSize.x,y * this.tileSize.y )
						.Add( this.tileSize.Copy().Divide( 2 ) )
					this.worms.push( new MapWorm( wormPos,NekoUtils.Choose(),new Vec2( x,y ),gfx ) )
				}
			}
		}
	}
	
	GetTile( x,y )
	{
		NekoUtils.Assert( x >= 0 && x < this.width && y >= 0 && y < this.height,
			"Invalid WormMap.GetTile coordinates! " + x + "," + y )
		
		return( this.tiles[y * this.width + x] )
	}
}