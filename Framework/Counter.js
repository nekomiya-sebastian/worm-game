class Counter
{
	constructor( count )
	{
		this.count = count
		this.cur = 0
	}
	
	Tick()
	{
		++this.cur
		
		return( this.IsDone() )
	}
	
	Reset()
	{
		this.cur = 0
	}
	
	IsDone()
	{
		return( this.cur >= this.count )
	}
	
	GetCurItem()
	{
		return( this.cur )
	}
}