class NekoUtils {}

NekoUtils.Assert = function( condition,msg )
{
	if( !condition ) console.log( msg ? msg : "Assert triggered!" )
}

NekoUtils.RandInt = function( min,max )
{
	return( Math.floor( Math.random() * ( max - min ) + min ) )
}

NekoUtils.RandFloat = function( min,max )
{
	return( ( Math.random() * ( max - min ) ) + min )
}

NekoUtils.Choose = function()
{
	return( NekoUtils.Chance( 0.5 ) )
}

NekoUtils.Chance = function( chance )
{
	return( NekoUtils.RandFloat( 0,1 ) < chance )
}

NekoUtils.ArrayChooseRand = function( arr )
{
	return( arr[NekoUtils.RandInt( 0,arr.length )] )
}

NekoUtils.ArrayIncludes = function( arr,func )
{
	for( const item of arr )
	{
		if( func( item ) ) return( true )
	}
	return( false )
}