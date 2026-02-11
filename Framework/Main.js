class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.mouse = new Mouse( this.gfx )
		this.kbd = new Keyboard( this.gfx )
		
		// this.worm = new BouncingWorm( this.gfx )
		
		this.map = new WormMap( this.gfx )
	}
	
	Update()
	{
		this.map.Update( this.mouse )
		
		// this.worm.Update( this.gfx )
	}
	
	Draw()
	{
		this.map.Draw( this.gfx )
		
		// this.worm.Draw( this.gfx )
	}
}

const delay = 1000.0 / 60.0
const main = new Main()
setInterval( function()
{
	main.Update()
	// main.gfx.DrawRect( 0,0,main.gfx.width,main.gfx.height,"#000000" )
	main.Draw()
},delay )