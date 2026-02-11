class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.mouse = new Mouse( this.gfx )
		this.kbd = new Keyboard( this.gfx )
		
		this.wormAnim = new Anim( "Images/Worm",2 )
		this.wormPos = new Vec2( this.gfx.width / 2,this.gfx.height / 2 )
		const wormSpd = 5
		this.wormDir = new Vec2( NekoUtils.RandFloat( -1,1 ),NekoUtils.RandFloat( -1,1 ) )
			.Normalize().Scale( wormSpd )
		
		this.grassImg = new Sprite( "Images/GrassTile.png" )
	}
	
	Update()
	{
		this.wormAnim.Update()
		
		this.wormPos.Add( this.wormDir )
		const wormHSize = this.wormAnim.GetSize().Copy().Divide( 2 ).Scale( this.gfx.sprScale )
		if( this.wormPos.y < wormHSize.y ) this.wormDir.y = Math.abs( this.wormDir.y )
		if( this.wormPos.y > this.gfx.height - wormHSize.y ) this.wormDir.y = -Math.abs( this.wormDir.y )
		if( this.wormPos.x < wormHSize.x ) this.wormDir.x = Math.abs( this.wormDir.x )
		if( this.wormPos.x > this.gfx.width - wormHSize.x ) this.wormDir.x = -Math.abs( this.wormDir.x )
	}
	
	Draw()
	{
		if( this.grassImg.loaded )
		{
			const width = this.gfx.width / this.grassImg.size.x
			const height = this.gfx.height / this.grassImg.size.y
			if( width - Math.floor( width ) > 0 ) console.log( "invalid width!" )
			if( height - Math.floor( height ) > 0 ) console.log( "invalid height!" )
			
			for( let y = 0; y < height; ++y )
			{
				for( let x = 0; x < width; ++x )
				{
					this.grassImg.Draw( x * this.grassImg.size.x * this.gfx.sprScale,
						y * this.grassImg.size.y * this.gfx.sprScale,
						this.gfx,false )
				}
			}
		}
		
		this.wormAnim.Draw(
			this.wormPos.Copy().Subtract( this.wormAnim.GetSize().Copy().Divide( 2 ).Scale( this.gfx.sprScale ) ),
			this.gfx,this.wormDir.x > 0.0 )
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