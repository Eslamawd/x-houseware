import React from 'react'
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';


function Logo() {
  return (
    <Link 
      to="/" 
      className="flex items-center transition-opacity hover:opacity-80"
    >
      <div className="flex items-center">
        <img src='/vite.png' alt="ServexLB Logo" className="mr-2 " /> 
       
      </div>
    </Link>
  );
}

export default Logo