import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdateScheduleTeacherWise = () => {
    const [teacherName, setTeacherName] = useState('');
    const [scheduleData, setScheduleData] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = ['1', '2', '3', '4', '5', '6', '7', '8'];

    const fetchSchedules = async () => {
        if (teacherName) {
            setLoading(true);
            try {
                const response = await axios.post('http://localhost:3300/api/v1/create/getData', {
                    teacherName: teacherName,
                });
                const fetchedSchedules = response.data.schedule;
                console.log(fetchedSchedules);

                const initialScheduleData = {};

                daysOfWeek.forEach(day => {
                    initialScheduleData[day] = {};
                    periods.forEach(period => {
                        initialScheduleData[day][period] = { subject: '', className: '' };
                    });
                });

                if (Array.isArray(fetchedSchedules)) {
                    fetchedSchedules.forEach(schedule => {
                        const dayOfWeek = schedule.dayofweek;
                        const period = schedule.period;

                        if (initialScheduleData[dayOfWeek] && initialScheduleData[dayOfWeek][period]) {
                            initialScheduleData[dayOfWeek][period] = {
                                subject: schedule.subject,
                                className: schedule.className,
                                _id: schedule._id,
                            };
                        }
                    });

                    setScheduleData(initialScheduleData);
                    setMessage('Schedules fetched successfully.');
                } else {
                    setMessage('No schedules found for this teacher.');
                    setScheduleData(initialScheduleData);
                }
            } catch (error) {
                console.error("Error fetching schedules:", error);
                setMessage(error.response?.data?.message || 'Error fetching schedules. Please check the console for more details.');
                setScheduleData({});
            } finally {
                setLoading(false);
            }
        }
    };


    const handleScheduleChange = (day, period, field, value) => {
        setScheduleData(prevData => {
            if (!prevData) return prevData;

            return ({
                ...prevData,
                [day]: {
                    ...prevData[day],
                    [period]: {
                        ...prevData[day][period],
                        [field]: value
                    }
                }
            });
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const scheduleDataForSubmit = [];
        if (scheduleData) {
            for (const day in scheduleData) {
                for (const period in scheduleData[day]) {
                    const { subject, className, _id } = scheduleData[day][period];
                    if (subject || className) {  // Only include if either subject or className is filled
                        scheduleDataForSubmit.push({
                            dayOfWeek: day,
                            period: parseInt(period),
                            subject: subject || '',
                            className: className || '',
                            _id: _id || null
                        });
                    }
                }
            }
        }

        try {
            const response = await axios.post('http://localhost:3300/api/v1/class/updateByTeacherwise', {
                teacherName: teacherName,
                scheduleData: scheduleDataForSubmit,
            });
            setMessage(response.data.message);
            toast.success(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating schedules.');
            toast.error(error.response?.data?.message || 'Error updating schedules.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto mt-8 bg-lightgreen-50 shadow-lg rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-4 text-green-800 shadow-md">Update Teacher Schedule</h1>
            {message && <div className="mb-4">{message}</div>}
            <form onSubmit={handleSubmit} className="max-w-full mx-auto">
                <div className="mb-4">
                    <label htmlFor="teacherName" className="block text-gray-700 text-sm font-bold mb-2">
                        Teacher Name:
                    </label>
                    <input
                        type="text"
                        id="teacherName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <button type="button" onClick={fetchSchedules} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2 shadow-md">
                        Fetch Schedules
                    </button>
                </div>
                {scheduleData && (
                    <div className="overflow-x-auto shadow-md">
                        <table className="table-auto w-full border-collapse border border-green-300">
                            <thead>
                                <tr className="bg-green-100">
                                    <th className="border border-green-300 px-4 py-2"></th>
                                    {periods.map(period => (
                                        <th key={period} className="border border-green-300 px-4 py-2">Period {period}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {daysOfWeek.map(day => (
                                    <tr key={day}>
                                        <th className="border border-green-300 px-4 py-2">{day}</th>
                                        {periods.map(period => (
                                            <td key={`${day}-${period}`} className="border border-green-300 px-4 py-2">
                                                <input
                                                    type="text"
                                                    placeholder="Subject"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                                    value={scheduleData[day]?.[period]?.subject || ''}
                                                    onChange={(e) => handleScheduleChange(day, period, 'subject', e.target.value)}
                                                    disabled={loading}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Class Name"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    value={scheduleData[day]?.[period]?.className || ''}
                                                    onChange={(e) => handleScheduleChange(day, period, 'className', e.target.value)}
                                                    disabled={loading}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex items-center justify-center mt-4">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-md"
                        type="submit"
                        disabled={loading || !scheduleData}
                    >
                        {loading ? 'Updating...' : 'Update Schedules'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateScheduleTeacherWise;
