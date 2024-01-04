import React from 'react'

const Header = () => {
  return (
   

<header className="bg-gray-50">
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 flex items-center justify-center">
    <div className="sm:flex sm:items-center sm:justify-between text-center">
      <div>
        <img src='logo.gif' alt='logo' width={100} height={100} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Stock Management</h1>
    </div>
  </div>
</header>


  )
}

export default Header