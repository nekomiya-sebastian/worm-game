class NumberDrawer
{
	constructor( gfx )
	{
		this.nums = []
		for( let i = 0; i <= 9; ++i ) this.nums.push( new Sprite( "Images/Num" + i + ".png" ) )
		
		this.numDims = new Vec2( 3,5 ).Scale( gfx.sprScale )
	}
	
	DrawNum( num,pos,gfx,centerX = false,centerY = false )
	{
		const numStr = num.toString()
		
		const numSize = new Vec2( numStr.length * ( this.numDims.x + gfx.sprScale ),this.numDims.y )
		
		const centeredPos = pos.Copy().Subtract( numSize.Copy().Divide( 2 ) )
		
		const drawPos = new Vec2( centerX ? centeredPos.x : pos.x,
			centerY ? centeredPos.y : pos.y )
		
		for( const digit of numStr )
		{
			gfx.DrawSprite( drawPos.x,drawPos.y,this.nums[parseInt( digit )] )
			drawPos.x += this.numDims.x + gfx.sprScale // extra spr scale for space between numbers
		}
	}
}