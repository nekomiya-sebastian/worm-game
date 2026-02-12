class Hitbox
{
	constructor( x,y,width,height,centered = true )
	{
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.centered = centered
	}
	
	Draw( gfx,color = "magenta" )
	{
		let drawX = this.x
		let drawY = this.y
		if( this.centered )
		{
			drawX -= this.width / 2
			drawY -= this.height / 2
		}
		gfx.DrawRect( drawX,drawY,this.width,this.height,color )
	}
	
	MoveTo( x,y )
	{
		this.x = x
		this.y = y
	}
	
	MoveBy( x,y )
	{
		this.x += x
		this.y += y
	}
	
	Contains( x,y )
	{
		if( this.centered )
		{
			x += this.width / 2
			y += this.height / 2
		}
		return( x > this.x && x < this.x + this.width &&
			y > this.y && y < this.y + this.height )
	}
	
	Overlaps( otherHitbox )
	{
		
	}
}