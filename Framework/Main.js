class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.mouse = new Mouse( this.gfx )
		this.kbd = new Keyboard( this.gfx )
		
		this.numDrawer = new NumberDrawer( this.gfx )
		
		// this.worm = new BouncingWorm( this.gfx )
		
		this.map = new WormMap( this.gfx )
		
		this.shop = new WormShop( this.gfx,this.map,this.numDrawer )
	}
	
	Update()
	{
		this.map.Update( this.mouse,this.shop )
		
		// this.worm.Update( this.gfx )
		
		this.shop.Update( this.mouse )
	}
	
	Draw()
	{
		this.map.Draw( this.gfx )
		
		this.shop.Draw( this.gfx )
		
		// this.worm.Draw( this.gfx )
	}
}

const delay = 1000.0 / 60.0
const main = new Main()
setInterval( function()
{
	main.Update()
	main.gfx.DrawRect( 0,0,main.gfx.width,main.gfx.height,"#000000" )
	main.Draw()
},delay )