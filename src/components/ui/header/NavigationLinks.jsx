import React from 'react' 
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Settings, User, ShoppingBag, MessageCircle, LogOut, LogIn } from 'lucide-react';
import { Button } from "../button";

import { useAuth } from '../../../context/AuthContext';


function NavigationLinks() {

    const navegate = useNavigate();

    const { user, logout } = useAuth();



     const handleWhatsAppRedirect = () => {
               window.open(`https://wa.me/`, '_blank');
           };


    const handleLogout = () => { 
       logout().then(() => {
       navegate('/'); // Redirect to home page
       }).catch((error) => {
        console.error('Logout failed:', error);
      // Optionally, you can show an error message to the user
        alert('Logout failed. Please try again.');
       });
            };

  return (
    <nav className="hidden md:flex items-center space-x-4">
      <div 
        
      
        className="text-green-500 hover:text-white hover:bg-green-500 font-medium flex items-center rounded-full border border-gray-400 corsur-pointer px-4 py-2 w-fit"
        onClick={handleWhatsAppRedirect}
        title="Contact us on WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
      </div>
      
   
      {user && user?.role === 'admin' ? (
        <Link to="/admin" className=' hover:text-white hover:bg-blue-950 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 py-2 w-fit'>
            <Settings className="h-4 w-4" />
            <span>Admin</span>
        
        </Link>
      ) : user?.role === 'seals' ? (
          <Link to="/seals" className=' hover:text-white hover:bg-blue-950 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 py-2 w-fit'>
            <Settings className="h-4 w-4" />
            <span>Seller</span>
      
        </Link>
      ) : null

    }
      
      {user ? (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-2 items-center"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
          
      
        </>
      ) : (
        <>
          <Link to="/login">
            <Button  variant="default" size="sm" className="flex  gap-2 items-center">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          </Link>
          
          <Link to="/register">
            <Button variant="outline" size="sm">Register</Button>
          </Link>
        </>
      )}
      
    </nav>
  )
}

export default NavigationLinks