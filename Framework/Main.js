class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.mouse = new Mouse( this.gfx )
		this.kbd = new Keyboard( this.gfx )
		
		this.numDrawer = new NumberDrawer( this.gfx )
		this.partSys = new ParticleSystem()
		
		this.levels = new WormLevels()
		
		this.map = new WormMap( this.levels,this.partSys )
		
		this.shop = new WormShop( this.gfx,this.map,this.numDrawer )
		
		this.bgm = new SFX( "Audio/worm_song.mp3" )
		this.tapped = false
	}
	
	Update( dt )
	{
		if( this.tapped )
		{
			if( this.bgm.loaded && !this.bgm.IsPlaying() ) this.bgm.Loop()
		}
		else if( this.mouse.down ) this.tapped = true
		
		this.map.Update( this.mouse,this.shop,dt,this.gfx )
		
		this.shop.Update( this.mouse,dt )
		
		this.partSys.Update( this.map,dt )
	}
	
	Draw()
	{
		this.map.Draw( this.gfx )
		
		this.shop.Draw( this.gfx )
		
		this.partSys.Draw( this.gfx )
	}
}

const delay = 1000.0 / 60.0
const main = new Main()
let prevTime = Date.now()
setInterval( function()
{
	const now = Date.now()
	const dt = ( now - prevTime ) / 30
	prevTime = now
	
	if( dt > 5 ) return // prevent rubber banding from tabbing out
	
	main.Update( dt )
	main.gfx.DrawRect( 0,0,main.gfx.width,main.gfx.height,"#000000" )
	main.Draw()
},delay )