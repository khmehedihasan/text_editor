import React from 'react';
import { NavLink } from 'react-router-dom'

function Nav(){
    return(
       <nav className='nav'>
           <NavLink to="/" className={(e)=> e.isActive?'active':''} >Admin</NavLink>
           <NavLink to="/user" className={(e)=> e.isActive?'active':''} >User</NavLink>
       </nav>
    )
}

export default Nav;