
  function UnFlatten( obj ) {
    const u = {} ;
    for ( const [ key, value ] of Object.entries( obj ) ) {
      const key_parts = key.split( "." ) ;
      if ( key_parts.length == 1 ) {
        u[key] = value ;
      } else {
        const tmp_u = u ;
        for ( let i = 0 ; i < key_parts.length-1 ; i++ ) {
          const k = key_parts[i] ;
          if ( !tmp_u[k] ) {
            tmp_u[k] = {} ;
          }
          tmp_u = tmp_u[k] ;
        }
        tmp_u[key_parts[key_parts.length-1]] = value ;
      }
    }
    return u ;
  }
  function Flatten( obj ) {
    const f = {} ;
    for ( const [ key, value ] of Object.entries( obj ) ) {
      if ( $.isPlainObject( value ) ) {
        const f_values = Flatten( value ) ;
        for ( const [ fkey, fvalue ] of Object.entries( f_values ) ) {
          f[key+"."+fkey] = fvalue ;
        }
      } else {
        f[key] = value ;
      }
    }
    return f ;
  }


