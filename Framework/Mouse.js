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
			const boundingRect = canv.getBoundingClientRect()
			const docElement = document.documentElement
			
			self.x = e.clientX - boundingRect.left - docElement.scrollLeft
			self.y = e.clientY - boundingRect.top - docElement.scrollTop
			
			this.usingTouch = false
		} )
		
		canv.addEventListener( "touchstart",function( e )
		{
			e.preventDefault()
			
			const boundingRect = canv.getBoundingClientRect()
			const docElement = document.documentElement
			
			self.x = e.touches[0].clientX - boundingRect.left - docElement.scrollLeft
			self.y = e.touches[0].clientY - boundingRect.top - docElement.scrollTop
			
			self.down = true
			
			this.usingTouch = true
		} )
		canv.addEventListener( "touchend",function( e )
		{
			e.preventDefault()
			
			const boundingRect = canv.getBoundingClientRect()
			const docElement = document.documentElement
			
			self.x = e.touches[0].clientX - boundingRect.left - docElement.scrollLeft
			self.y = e.touches[0].clientY - boundingRect.top - docElement.scrollTop
			
			self.down = false
			
			this.usingTouch = true
		} )
	}
}