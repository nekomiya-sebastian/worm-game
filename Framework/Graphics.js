class Graphics
{
	constructor()
	{
		this.canvas = document.getElementById( "nekocanv" )
		this.context = this.canvas.getContext( "2d" )
		
		this.context.imageSmoothingEnabled = false
		this.context.mozImageSmoothingEnabled = false
		
		this.width = this.canvas.width
		this.height = this.canvas.height
		
		this.sprScale = 4
		
		// console.log( this.width + " " + this.height )
	}
	
	DrawRect( x,y,w,h,c )
	{
		this.context.fillStyle = c
		this.context.fillRect( Math.floor( x ),Math.floor( y ),
			Math.floor( w ),Math.floor( h ),c )
	}
	
	DrawSprite( x,y,sprite,flipped = false,scale = this.sprScale )
	{
		if( flipped )
		{
			this.context.save()
			this.context.translate( this.width,0 )
			this.context.scale( -1,1 )
			
			this.context.drawImage( sprite.sprite,this.width - x,y,
				-sprite.size.x * scale,sprite.size.y * scale )
				
			// this.context.restore()
			this.context.scale( -1,1 )
			this.context.translate( -this.width,0 )
		}
		else this.context.drawImage( sprite.sprite,x,y,sprite.size.x * scale,sprite.size.y * scale )
	}
}