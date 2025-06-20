import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-lg sm:text-xl font-bold text-gray-800">
            Blog App
          </Link>
          
          {/* Hamburger menu button for mobile */}
          <button
            onClick={toggleMenu}
            className="sm:hidden p-2 rounded-md text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/create"
                  className="text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md font-medium"
                >
                  Create Blog
                </Link>
                <Link
                  to="/my-blogs"
                  className="text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md font-medium"
                >
                  My Blogs
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-800 px-3"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-800 px-3"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-gray-600 hover:text-gray-800 px-3"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <Link
                    to="/"
                    className="block text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md font-medium"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                  <Link
                    to="/create"
                    className="block text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md font-medium"
                    onClick={toggleMenu}
                  >
                    Create Blog
                  </Link>
                  <Link
                    to="/my-blogs"
                    className="block text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md font-medium"
                    onClick={toggleMenu}
                  >
                    My Blogs
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="block w-full text-left text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md font-medium"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md font-medium"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 