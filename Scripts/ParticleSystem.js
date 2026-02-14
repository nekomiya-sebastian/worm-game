class Particle
{
	constructor( pos,moveVec )
	{
		this.pos = pos.Copy()
		this.moveVec = moveVec
		this.flipped = NekoUtils.Choose()
	}
	
	Update( map,dt )
	{
		this.pos.Add( this.moveVec.Copy().Scale( dt ) )
		
		this.moveVec.y += Particle.grav * dt
		
		return( this.pos.y > map.GetWorldHeight() + Particle.disappearYAdd )
	}
}
Particle.grav = 1
Particle.disappearYAdd = 100

class ParticleSystem
{
	constructor()
	{
		this.partScale = 1
		
		this.sprs = [
			new Anim( MapWorm.wormSprArr ),
			new Sprite( "Images/Fireball.png" )
		]
		this.scales = [
			4,
			2
		]
		NekoUtils.Assert( this.scales.length == this.sprs.length )
		this.parts = []
		for( const unused of this.sprs ) this.parts.push( [] )
	}
	
	SetMapSprs( mapSprs )
	{
		let offset = this.sprs.length
		for( const spr of mapSprs )
		{
			this.sprs.push( spr )
			this.parts.push( [] )
			this.scales.push( this.partScale )
		}
		return( offset )
	}
	
	Update( map,dt )
	{
		for( const spr of this.sprs )
		{
			if( spr.Update ) spr.Update( dt )
		}
		
		for( let i = 0; i < this.parts.length; ++i )
		{
			const partList = this.parts[i]
			for( let j = 0; j < partList.length; ++j )
			{
				if( partList[j].Update( map,dt ) )
				{
					// replace j with last element, then remove now duped last element
					partList[j] = partList[partList.length - 1]
					partList.pop()
					--j // decrement j so we don't skip now swapped element
				}
			}
		}
	}
	
	Draw( gfx )
	{
		for( let i = 0; i < this.parts.length; ++i )
		{
			for( let j = 0; j < this.parts[i].length; ++j )
			{
				const curPart = this.parts[i][j]
				this.sprs[i].PartDraw( curPart.pos,gfx,
					curPart.flipped,this.scales[i] )
			}
		}
	}
	
	SpawnParts( pos,count,partId )
	{
		NekoUtils.Assert( partId >= 0 && partId < this.parts.length,
			"Invalid partId in ParticleSystem.SpawnParts: " + partId )
		
		const maxUp = 20
		const maxSide = 10
		
		for( let i = 0; i < count; ++i )
		{
			this.parts[partId].push( new Particle( pos,new Vec2(
				NekoUtils.RandFloat( -maxSide,maxSide ),
				NekoUtils.RandFloat( 0,-maxUp )
				) ) )
		}
	}
}