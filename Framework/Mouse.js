class Mouse
{
	constructor( gfx )
	{
		const canv = gfx.canvas
		
		this.down = false
		this.x = 0
		this.y = 0
		
		this.usingTouch = false
		
		const self = this
		
		const boundingRect = canv.getBoundingClientRect()
		const docElement = document.documentElement
		
		canv.addEventListener( "mousedown",function()
		{
			self.down = true
			
			this.usingTouch = false
		} )
		canv.addEventListener( "mouseup",function()
		{
			self.down = false
			
			this.usingTouch = false
		} )
		canv.addEventListener( "mousemove",function( e )
		{
			self.x = e.clientX - boundingRect.left - docElement.scrollLeft
			self.y = e.clientY - boundingRect.top - docElement.scrollTop
			
			this.usingTouch = false
		} )
		
		canv.addEventListener( "touchStart",function( e )
		{
			self.x = e.touches[0].clientX - boundingRect.left - docElement.scrollLeft
			self.y = e.touches[0].clientY - boundingRect.top - docElement.scrollTop
			
			self.down = true
			
			this.usingTouch = true
		} )
		canv.addEventListener( "touchEnd",function( e )
		{
			self.x = e.touches[0].clientX - boundingRect.left - docElement.scrollLeft
			self.y = e.touches[0].clientY - boundingRect.top - docElement.scrollTop
			
			self.down = false
			
			this.usingTouch = true
		} )
	}
}