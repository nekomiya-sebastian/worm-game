class Hitbox
{
	constructor( x,y,width,height )
	{
		this.x = x
		this.y = y
		this.width = width
		this.height = height
	}
	
	Draw( gfx,color = "magenta" )
	{
		gfx.DrawRect( this.x - this.width / 2,this.y - this.height / 2,this.width,this.height,color )
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
		x += this.width / 2
		y += this.height / 2
		return( x > this.x && x < this.x + this.width &&
			y > this.y && y < this.y + this.height )
	}
	
	Overlaps( otherHitbox )
	{
		
	}
}