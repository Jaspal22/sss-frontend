import React from 'react'
import { Link } from 'react-router-dom';

const PTpage = () => {
    return (
        <div className="container mx-auto p-4">
            <section className="section bg-gray-100 rounded-lg shadow-md mb-4 p-6 border border-gray-300">
                <h2 className="text-2xl text-gray-800 font-semibold mb-3">Incharge</h2>
{/*                 <Link to="/incharges-page" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Perform Action</Link> */}
            </section>
            <section className="section bg-gray-100 rounded-lg shadow-md mb-4 p-6 border border-gray-300">
                <h2 className="text-2xl text-gray-800 font-semibold mb-3">Upload Marks</h2>
                <Link to="/uploadmarks" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Perform Action</Link>
            </section>
            <section className="section bg-gray-100 rounded-lg shadow-md mb-4 p-6 border border-gray-300">
                <h2 className="text-2xl text-gray-800 font-semibold mb-3">Print</h2>
                <Link to="/PrintCards" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Perform Action</Link>
            </section>
            <section className="section bg-gray-100 rounded-lg shadow-md mb-4 p-6 border border-gray-300">
                <h2 className="text-2xl text-gray-800 font-semibold mb-3">Empty</h2>
                <button className="button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Perform Action</button>
            </section>
        </div>
    )
}

export default PTpage
