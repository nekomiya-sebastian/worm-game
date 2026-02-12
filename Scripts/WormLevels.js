class WormLevels
{
	constructor()
	{
		this.curLevel = 0
		
		this.levels =
		[
			[ // level 1
				"022220000",
				"222002000",
				"220002200",
				"000000200",
				"002222002",
				"022000002",
				"020000022",
				"022222200"
			]
		]
	}
	
	GetCurLevel()
	{
		return( this.levels[this.curLevel] )
	}
}