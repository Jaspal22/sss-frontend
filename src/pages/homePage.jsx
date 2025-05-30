import React from 'react';
import TimeTableFormat from '../components/teachersTimetable';
import ClassWiseTimetable from '../components/classWise';
import AddTeacherSchedule from './addTeacherSchedule';
import AddClassSchedule from './addClassSchedule';
import UpdateScheduleClassWise from './updateScheduleClassWise';
import UpdateScheduleTeacherWise from './updateScheduleTeacherWise';
import { useState } from 'react';
import PTpage from './PTpage';

const ViewTimeTable = () => {
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'TimeTableFormat':
                return <TimeTableFormat />;
            case 'ClassWiseTimetable':
                return <ClassWiseTimetable />;
            case 'AddTeacherSchedule':
                return <AddTeacherSchedule />;
            case 'AddClassSchedule':
                return <AddClassSchedule />;
            case 'UpdateScheduleClassWise':
                return <UpdateScheduleClassWise />;
            case 'UpdateScheduleTeacherWise':
                return <UpdateScheduleTeacherWise />;
            case 'PT':
                return <PTpage />;
            default:
                return (
                    <div className="flex justify-center items-center min-h-screen h-full bg-green-50 shadow-lg">
                        <h1 style={{ fontFamily: 'Old English Text MT, sans-serif', fontSize: '5em', color: '#34D399', textShadow: '2px 2px 4px #000000' }}>Sacred Souls School</h1>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col md:flex-row  min-h-screen w-screen bg-green-100 shadow-md">
            {/* Content */}
            <div className="flex-1 p-4 bg-green-50 shadow-inner">
                {renderComponent()}
            </div>
            {/* Navbar */}
            <div className={`min-h-screen max-sm:w-1/2 w-full md:w-64 md:h-full bg-green-200 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-30 border-l border-gray-400 shadow-lg ${isNavbarOpen ? 'block absolute top-0 right-0 h-screen md:h-auto w-48 md:w-64 z-40' : 'hidden md:block'}`}>
                <nav className="p-4" style={{ marginTop: '20%' }}>
                    <ul>
                        <li className="p-2 hover:bg-green-300 cursor-pointer shadow-sm rounded-md shadow-md" onClick={() => setSelectedComponent(null)}>Home</li>
                        <li className="p-2 hover:bg-green-300 cursor-pointer shadow-sm rounded-md shadow-md" onClick={() => setSelectedComponent('TimeTableFormat')}>Teachers Time Table</li>
                        <li className="p-2 hover:bg-green-300 cursor-pointer shadow-sm rounded-md shadow-md" onClick={() => setSelectedComponent('ClassWiseTimetable')}>Class Wise Timetable</li>
                        <li className="p-2 hover:bg-green-300 cursor-pointer shadow-sm rounded-md shadow-md" onClick={() => setSelectedComponent('AddTeacherSchedule')}>Add Teacher Schedule</li>
                        <li className="p-2 hover:bg-green-300 cursor-pointer shadow-sm rounded-md shadow-md" onClick={() => setSelectedComponent('AddClassSchedule')}>Add Class Schedule</li>
                        <li className="p-2 hover:bg-green-300 cursor-pointer shadow-sm rounded-md shadow-md" onClick={() => setSelectedComponent('UpdateScheduleClassWise')}>Update Class Schedule</li>
                        <li className="p-2 hover:bg-green-300 cursor-pointer shadow-sm rounded-md shadow-md" onClick={() => setSelectedComponent('UpdateScheduleTeacherWise')}>Update Teacher Schedule</li>
                        <li className="p-2 hover:bg-green-300 cursor-pointer shadow-sm rounded-md shadow-md" onClick={() => setSelectedComponent('PT')}>PT-1</li>
                    </ul>
                </nav>
            </div>
            {/* Button to toggle navbar on smaller screens */}
            <button
                className="md:hidden absolute top-4 left-4 bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 rounded shadow-md z-50"
                onClick={() => setIsNavbarOpen(!isNavbarOpen)}
            >
                {isNavbarOpen ? 'Hide Menu' : 'Show Menu'}
            </button>
        </div>
    );
};

export default ViewTimeTable;
