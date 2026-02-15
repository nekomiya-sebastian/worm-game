class WormMap
{
	constructor( levels,partSys )
	{
		this.levels = levels
		this.partSys = partSys
		
		this.tileSprs = [
			new Sprite( "Images/SkyTile.png" ),
			new Sprite( "Images/DirtTile.png" ),
			new Sprite( "Images/GrassTile.png" ),
			new Sprite( "Images/RockTile.png" ),
			new Sprite( "Images/BlueBrickTile.png" ),
			new Sprite( "Images/YellowBrickTile.png" ),
			new Sprite( "Images/MagmaTile.png" )
		]
		this.tileIndOffset = this.partSys.SetMapSprs( this.tileSprs )
		
		this.tiles = []
		this.loadedTiles = false
		this.loadFlip = false
		
		this.width = -1
		this.height = -1
		this.tileSize = new Vec2( 24,24 ).Scale( Graphics.sprScale )
		
		this.canClick = false
		
		this.levelResetCheckTimer = new Timer( 1.0 )
		
		this.pickStr = 1
		this.pickAnim = new HandAnim( new Anim( Anim.GenSprArr( "Images/Pickaxe",4 ),24 ),
			new Vec2( 6,12 ).Scale( -1 ) )
		this.pinchAnim = new HandAnim( new Anim( Anim.GenSprArr( "Images/Pinch",3 ),16 ),
			new Vec2( 6,10 ).Scale( -1 ) )
		
		this.wormDensity = 0.3
		this.worms = []
		
		this.seals = []
		this.cats = []
		this.dragons = []
		this.fireballs = []
		this.nekosaurs = []
		this.lasers = []
		this.nekosaurSpots = []
		this.loadedNekosaurSpots = false
		
		this.breakTileSFX = [
			new SFX( "Audio/BreakTile2.mp3",0.7 ),
			new SFX( "Audio/BreakTile1.mp3",0.3 ),
			new SFX( "Audio/BreakTile3.mp3",0.3 ),
			new SFX( "Audio/BreakTile5.mp3",0.25 ),
			new SFX( "Audio/BreakTile4.mp3",0.35 ),
			// new SFX( "Audio/BreakTile6.mp3" ),
		]
		this.levelLoadSFX = [
			new SFX( "Audio/Swish1.mp3",0.9 ),
			new SFX( "Audio/Swish2.mp3",1.0 ),
			new SFX( "Audio/Swish3.mp3",0.6 ),
			new SFX( "Audio/Swish4.mp3",0.9 ),
		]
		this.firstLoad = true
		
		this.basicTutActive = true
		this.basicTut = new FloatingText( new Anim( Anim.GenSprArr( "Images/TutBasic",2 ) ),new Vec2(
			864 / 2 - Graphics.sprScale * ( 24 + 18 ),
			( 864 - 24 ) / 2 - Graphics.sprScale * 22 ),
			0.8,
			8 * Graphics.sprScale )
			
			
		this.tutWormLoc = new Vec2( 3,4 )
	}
	
	Update( mouse,shop,dt,gfx )
	{
		this.basicTut.Update( dt )
		
		if( this.loadedTiles )
		{
			if( this.levelResetCheckTimer.Update( dt ) ) this.CheckResetLevel()
			
			if( mouse.down && this.canClick &&
				mouse.x >= 0 && mouse.x < this.GetWorldWidth() &&
				mouse.y >= 0 && mouse.y < this.GetWorldHeight() )
			{
				const curTile = this.GetTileWorld( new Vec2( mouse.x,mouse.y ) )
				if( curTile > 1 )
				{
					const tilePos = this.World2TilePos( new Vec2( mouse.x,mouse.y ) )
					this.BreakTile( tilePos.x,tilePos.y,this.pickStr )
					this.canClick = false
					
					if( tilePos.Equals( this.tutWormLoc ) ) this.basicTut.SetAnimFrame( 1 )
					
					this.pickAnim.Activate( mouse.x,mouse.y )
					
					this.CheckResetLevel()
				}
			}
			
			for( const worm of this.worms )
			{
				if( worm.Update( mouse,this.canClick,shop,dt ) )
				{
					this.canClick = false
					
					this.basicTutActive = false
					
					this.pinchAnim.Activate( mouse.x,mouse.y )
					
					this.CheckResetLevel()
				}
				if( this.GetTile( worm.wormTile.x,worm.wormTile.y ) == 1 ) worm.Uncover()
			}
			
			for( const seal of this.seals ) seal.Update( dt,this )
			for( const cat of this.cats )
			{
				if( cat.Update( dt,this.worms,this,shop ) ) this.CheckResetLevel()
			}
			for( const dragon of this.dragons )
			{
				const fireball = dragon.Update( this,dt )
				if( fireball != null ) this.fireballs.push( fireball )
			}
			for( let i = 0; i < this.fireballs.length; ++i )
			{
				if( this.fireballs[i].Update( this,dt,this.partSys ) )
				{
					this.fireballs[i] = this.fireballs[this.fireballs.length - 1]
					this.fireballs.pop()
					--i
				}
			}
			for( const nekosaur of this.nekosaurs )
			{
				const laser = nekosaur.Update( this,dt )
				if( laser != null ) this.lasers.push( laser )
			}
			for( let i = 0; i < this.lasers.length; ++i )
			{
				if( this.lasers[i].Update( this,dt ) )
				{
					this.lasers[i] = this.lasers[this.lasers.length - 1]
					this.lasers.pop()
					--i
				}
			}
		}
		
		this.pickAnim.Update( dt )
		this.pinchAnim.Update( dt )
		
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
			
			for( const dragon of this.dragons ) dragon.Draw( gfx )
			for( const nekosaur of this.nekosaurs ) nekosaur.Draw( gfx )
			for( const seal of this.seals ) seal.Draw( gfx )
			for( const cat of this.cats ) cat.Draw( gfx )
			
			for( const fireball of this.fireballs ) fireball.Draw( gfx )
			for( const laser of this.lasers ) laser.Draw( gfx )
			
			if( this.basicTutActive ) this.basicTut.Draw( gfx )
			
			
			this.pickAnim.Draw( gfx )
			this.pinchAnim.Draw( gfx )
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
		// this.tileSize = new Vec2( this.tileSprs[0].size.x,this.tileSprs[0].size.y ).Scale( gfx.sprScale )
		this.width = gfx.width / this.tileSize.x
		this.height = gfx.height / this.tileSize.y - 1
		
		// console.log( "dims: " + this.width + "," + this.height )
		// console.log( "tileSize: " + this.tileSize.x + "," + this.tileSize.y )
		if( this.width - Math.floor( this.width ) > 0 ) console.log( "invalid width!" )
		if( this.height - Math.floor( this.height ) > 0 ) console.log( "invalid height!" )
		
		if( !this.loadedNekosaurSpots )
		{
			this.loadedNekosaurSpots = true
			for( let i = 0; i < this.width; ++i ) this.nekosaurSpots.push( i )
			NekoUtils.ShuffleArr( this.nekosaurSpots )
		}
		
		this.LoadLevel()
		
		this.loadedTiles = true
	}
	
	LoadLevel()
	{
		const level = this.levels.GetCurLevel()
		NekoUtils.Assert( level[0].length == this.width,"Invalid level width!" )
		NekoUtils.Assert( level.length == this.height,"Invalid level height!" )
		
		this.worms = []
		
		this.tiles = []
		for( let i = 0; i < this.width * this.height; ++i ) this.tiles.push( 0 )
		
		for( let y = 0; y < level.length; ++y )
		{
			const line = level[y]
			for( let x = 0; x < line.length; ++x )
			{
				const curTile = parseInt( line[( this.loadFlip ? line.length - x - 1 : x )] )
				this.SetTile( x,y,curTile )
				
				if( curTile > 1 && ( NekoUtils.Chance( this.wormDensity ) ) ||
					( this.firstLoad && x == this.tutWormLoc.x && y == this.tutWormLoc.y ) )
				{
					const wormPos = new Vec2( x * this.tileSize.x,y * this.tileSize.y )
						.Add( this.tileSize.Copy().Divide( 2 ) )
					if( NekoUtils.Chance( WormMap.kingWormChance ) )
					{
						this.worms.push( new WormKing( wormPos,NekoUtils.Choose(),
							new Vec2( x,y ),this.partSys ) )
					}
					else
					{
						this.worms.push( new MapWorm( wormPos,NekoUtils.Choose(),
							new Vec2( x,y ),this.partSys ) )
					}
				}
			}
		}
		
		// respawn seals to position them on free tiles
		const nSeals = this.seals.length
		this.seals = []
		for( let i = 0; i < nSeals; ++i ) this.SpawnSeal()
		
		// console.log( "x: " + x + ", y: " + y + ", width: " + this.width + ", height: " + this.height )
		
		this.loadFlip = !this.loadFlip
		
		if( this.firstLoad ) this.firstLoad = false
		else NekoUtils.ArrayChooseRand( this.levelLoadSFX ).Play()
	}
	
	NextLevel()
	{
		this.levels.GotoNextLevel()
		this.LoadLevel()
	}
	
	CheckResetLevel()
	{
		this.levelResetCheckTimer.Reset()
		
		for( const worm of this.worms )
		{
			if( !worm.collected ) return
		}
		
		for( let y = 0; y < this.height; ++y )
		{
			for( let x = 0; x < this.width; ++x )
			{
				if( this.GetTile( x,y ) > 1 ) return
			}
		}
		
		this.LoadLevel()
	}
	
	SpawnSeal()
	{
		const spawnableTiles = []
		for( let y = 0; y < this.height; ++y )
		{
			for( let x = 0; x < this.width; ++x )
			{
				if( this.GetTile( x,y ) == 0 ) spawnableTiles.push( new Vec2( x,y ) )
			}
		}
		NekoUtils.Assert( spawnableTiles.length > 0,"No spawnable tiles found!" )
		let spawnTile = new Vec2( this.width / 2,this.height / 2 )
		if( spawnableTiles.length > 0 ) spawnTile = NekoUtils.ArrayChooseRand( spawnableTiles )
		
		const spawnSpot = this.Tile2WorldPos( spawnTile.x,spawnTile.y,true )
		
		this.seals.push( new BouncingSeal( spawnSpot ) )
	}
	
	BuffWormDensity( amount )
	{
		this.wormDensity += amount
		this.worms = []
		this.LoadLevel()
	}
	
	SpawnCat()
	{
		const maxSpot = this.Tile2WorldPos( this.width,this.height )
		const randSpot = new Vec2( NekoUtils.RandFloat( 0.0,maxSpot.x ),NekoUtils.RandFloat( 0.0,maxSpot.y ) )
		this.cats.push( new JumpingCat( randSpot ) )
	}
	
	BuffKingWormChance( chanceBuff )
	{
		WormMap.kingWormChance += chanceBuff
	}
	
	SpawnDragon()
	{
		const spawnTile = this.GetRandTile()
		this.dragons.push( new Dragon( this.Tile2WorldPos( spawnTile.x,spawnTile.y ) ) )
	}
	
	BuffPickStrength()
	{
		++this.pickStr
	}
	
	SpawnNekosaurus()
	{
		const xSpot = ( this.nekosaurSpots.length > 0 ? this.nekosaurSpots.pop() : this.GetRandTile().x )
		this.nekosaurs.push( new Nekosaurus( this.Tile2WorldPos( xSpot,this.height - 1,true ) ) )
	}
	
	BreakTile( x,y,amount = 1,checkReset = true )
	{
		const curTile = this.GetTile( x,y )
		
		if( curTile > 1 )
		{
			const breakPartCount = 1 * curTile
			this.partSys.SpawnParts( this.Tile2WorldPos( x,y,true ),
				breakPartCount,this.tileIndOffset + curTile )
			this.SetTile( x,y,Math.max( 1,curTile - amount ) )
			
			if( checkReset )
			{
				// NekoUtils.ArrayChooseRand( this.breakTileSFX ).Play()
				this.breakTileSFX[curTile - 2].Play()
				
				this.CheckResetLevel()
			}
		}
	}
	
	SetTile( x,y,tile )
	{
		NekoUtils.Assert( this.IsTileOnScreen( x,y ),
			"Invalid WormMap.SetTile coordinates! " + x + "," + y )
		
		this.tiles[y * this.width + x] = tile
	}
	
	GetTile( x,y )
	{
		NekoUtils.Assert( this.IsTileOnScreen( x,y ),
			"Invalid WormMap.GetTile coordinates! " + x + "," + y )
		
		return( this.tiles[y * this.width + x] )
	}
	
	IsTileOnScreen( x,y )
	{
		return( x >= 0 && x < this.width && y >= 0 && y < this.height )
	}
	
	GetTileWorld( pos )
	{
		const tilePos = this.World2TilePos( pos )
		return( this.GetTile( tilePos.x,tilePos.y ) )
	}
	
	World2TilePos( pos )
	{
		return( new Vec2(
			Math.floor( pos.x / this.tileSize.x ),
			Math.floor( pos.y / this.tileSize.y )
		) )
	}
	
	Tile2WorldPos( x,y,centered = false )
	{
		const worldPos = new Vec2( x * this.tileSize.x,y * this.tileSize.y )
		if( centered ) worldPos.Add( this.tileSize.Copy().Divide( 2 ) )
		return( worldPos )
	}
	
	GetWorldWidth()
	{
		return( this.width * this.tileSize.x )
	}
	
	GetWorldHeight()
	{
		return( this.height * this.tileSize.y )
	}
	
	GetRandTile()
	{
		return( new Vec2( NekoUtils.RandInt( 0,this.width ),
			NekoUtils.RandInt( 0,this.height ) ) )
	}
	
	GetRandTileFilled( forceInvalidTile = false )
	{
		const spawnableTiles = []
		for( let y = 0; y < this.height; ++y )
		{
			for( let x = 0; x < this.width; ++x )
			{
				if( this.GetTile( x,y ) > 1 ) spawnableTiles.push( new Vec2( x,y ) )
			}
		}
		if( spawnableTiles.length > 0 || forceInvalidTile )
		{
			let spawnTile = new Vec2( this.width / 2,this.height / 2 )
			if( spawnableTiles.length > 0 ) spawnTile = NekoUtils.ArrayChooseRand( spawnableTiles )
			
			return( spawnTile )
		}
		else return( null )
	}
}

WormMap.kingWormChance = 0.01