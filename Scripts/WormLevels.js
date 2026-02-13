class WormLevels
{
	constructor()
	{
		this.curLevel = 1
		
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
			],
			[ // level 2
				"022200222",
				"003222230",
				"002323220",
				"002222220",
				"000223200",
				"000233000",
				"003222300",
				"003303300"
			]
		]
	}
	
	GetCurLevel()
	{
		return( this.levels[this.curLevel] )
	}
}