class BouncingWorm
{
	constructor( gfx )
	{
		this.wormAnim = new Anim( MapWorm.wormSprArr )
		this.wormPos = new Vec2( gfx.width / 2,gfx.height / 2 )
		const wormSpd = 5
		this.wormDir = new Vec2( NekoUtils.RandFloat( -1,1 ),NekoUtils.RandFloat( -1,1 ) )
			.Normalize().Scale( wormSpd )
	}
	
	Update( gfx )
	{
		this.wormAnim.Update()
		
		this.wormPos.Add( this.wormDir )
		const wormHSize = this.wormAnim.GetSize().Copy().Divide( 2 ).Scale( gfx.sprScale )
		if( this.wormPos.y < wormHSize.y ) this.wormDir.y = Math.abs( this.wormDir.y )
		if( this.wormPos.y > gfx.height - wormHSize.y ) this.wormDir.y = -Math.abs( this.wormDir.y )
		if( this.wormPos.x < wormHSize.x ) this.wormDir.x = Math.abs( this.wormDir.x )
		if( this.wormPos.x > gfx.width - wormHSize.x ) this.wormDir.x = -Math.abs( this.wormDir.x )
	}
	
	Draw( gfx )
	{
		this.wormAnim.Draw(
			this.wormPos.Copy().Subtract( this.wormAnim.GetSize().Copy().Divide( 2 ).Scale( gfx.sprScale ) ),
			gfx,this.wormDir.x > 0.0 )
	}
}