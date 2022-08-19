import React, { useEffect } from 'react'
import './style.css'


const Navbar = () => {

  return (
    <div className='navBar'>
      <div className='navItem'>Log in</div>
      <div className='navItem'>Chat</div>
      <div className='navItem'>Game</div>
      <div className='navItem'>Stats</div>
    </div>
  )
}

export default Navbar