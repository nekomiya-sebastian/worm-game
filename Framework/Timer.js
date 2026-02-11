class Timer
{
	constructor( dur,startFinished = false )
	{
		const delay = dur * 60
		this.time = startFinished ? delay + 1 : 0
		this.dur = delay
	}
	
	Update()
	{
		if( this.time <= this.dur ) ++this.time
		
		return( this.IsDone() )
	}
	
	Reset()
	{
		this.time = 0
	}
	
	SetDur( duration )
	{
		this.dur = duration * 60
	}
	
	IsDone()
	{
		return( this.time > this.dur )
	}
}