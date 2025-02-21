import React from 'react';
import Img from "./Images/404notfound.avif";

const NotFound = () => {
    return (
        <div className="flex justify-center items-center">
            <img className='p-4' src={Img} alt="404 not found" width="350px" />
            {/* <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1> */}
        </div>
    );
};

export default NotFound;
