class Anim
{
	constructor( sprName,nSprs,fps = 4,sprSuffix = ".png" )
	{
		this.sprs = []
		for( let i = 0; i < nSprs; ++i ) this.sprs.push( new Sprite( sprName + ( i + 1 ) + sprSuffix ) )
		
		this.frameTimer = new Timer( 1.0 / fps )
		this.curFrame = new Counter( nSprs )
	}
	
	Update()
	{
		if( this.frameTimer.Update() )
		{
			this.frameTimer.Reset()
			if( this.curFrame.Tick() ) this.curFrame.Reset()
		}
	}
	
	Draw( pos,gfx,flipped = false )
	{
		this.sprs[this.curFrame.GetCurItem()].Draw( pos.x,pos.y,gfx,flipped )
	}
	
	Reset()
	{
		this.frameTimer.Reset()
		this.curFrame.Reset()
	}
	
	GetSize()
	{
		return( this.sprs[0].size )
	}
}