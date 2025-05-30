import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AddTeacherSchedule = () => {
    const [teacherName, setTeacherName] = useState('');
    const [dayofweek, setDayofweek] = useState('');
    const [periods, setPeriods] = useState(Array(8).fill({ className: '', subject: '' }));
    const [message, setMessage] = useState('');

    const handlePeriodChange = (index, field, value) => {
        const newPeriods = periods.map((period, i) => {
            if (i === index) {
                return { ...period, [field]: value };
            }
            return period;
        });
        setPeriods(newPeriods);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const scheduleData = periods.map((period, index) => ({
                teacherName: teacherName,
                className: period.className,
                subject: period.subject,
                period: index + 1,
                dayofweek
            }));

            console.log(scheduleData);

            const response = await axios.post('http://localhost:3300/api/v1/create/AddByTeacher', scheduleData);

            setMessage(response.data.message);
            setTeacherName('');
            setDayofweek('');
            setPeriods(Array(8).fill({ className: '', subject: '' }));
            toast.success('Schedule added successfully!');

        } catch (error) {
            setMessage(error.response?.data?.message || 'Error adding schedule');
            toast.error('Error adding schedule.');
        }
    };

    return (
        <div className="min-h-screen bg-green-50 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto lg:max-w-5xl">
                <Toaster position="top-right" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-green-100 shadow-lg rounded-3xl sm:p-20">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Add Teacher Schedule
                    </h1>
                    {message && <div className="mb-4 text-center text-green-700">{message}</div>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="teacherName" className="block text-gray-700 text-sm font-bold mb-2">
                                    Teacher Name:
                                </label>
                                <input
                                    type="text"
                                    id="teacherName"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={teacherName}
                                    onChange={(e) => setTeacherName(e.target.value)}
                                    placeholder="Enter teacher's name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="dayofweek" className="block text-gray-700 text-sm font-bold mb-2">
                                    Day of the Week:
                                </label>
                                <select
                                    id="dayofweek"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={dayofweek}
                                    onChange={(e) => setDayofweek(e.target.value)}
                                    required
                                >
                                    <option value="">Select Day</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            {Array.from({ length: Math.ceil(periods.length / 3) }).map((_, rowIndex) => (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" key={rowIndex}>
                                    {periods.slice(rowIndex * 3, rowIndex * 3 + 3).map((period, index) => {
                                        const periodIndex = rowIndex * 3 + index;
                                        return (
                                            <div key={periodIndex} className="bg-green-50 p-4 border rounded shadow-md">
                                                <h2 className="text-lg font-semibold text-gray-800 mb-2">Period {periodIndex + 1}</h2>
                                                <div>
                                                    <label htmlFor={`className-${periodIndex}`} className="block text-gray-700 text-sm font-bold mb-2">
                                                        Class Name:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id={`className-${periodIndex}`}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value={period.className}
                                                        onChange={(e) => handlePeriodChange(periodIndex, 'className', e.target.value)}
                                                        placeholder="Enter class name"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`subject-${periodIndex}`} className="block text-gray-700 text-sm font-bold mb-2">
                                                        Subject:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id={`subject-${periodIndex}`}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value={period.subject}
                                                        onChange={(e) => handlePeriodChange(periodIndex, 'subject', e.target.value)}
                                                        placeholder="Enter subject"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-center">
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Add Schedule
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTeacherSchedule;
