class Mouse
{
	constructor( gfx )
	{
		const canv = gfx.canvas
		
		this.down = false
		this.x = 0
		this.y = 0
		
		const self = this
		
		canv.addEventListener( "mousedown",function()
		{
			self.down = true
		} )
		canv.addEventListener( "mouseup",function()
		{
			self.down = false
		} )
		canv.addEventListener( "mousemove",function( e )
		{
			const boundingRect = canv.getBoundingClientRect()
			const docElement = document.documentElement
			
			const tempX = e.clientX - boundingRect.left - docElement.scrollLeft
			const tempY = e.clientY - boundingRect.top - docElement.scrollTop
			
			self.x = Math.floor( tempX / gfx.scale )
			self.y = Math.floor( tempY / gfx.scale )
		} )
	}
}