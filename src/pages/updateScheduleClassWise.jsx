import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdateScheduleClassWise = () => {
    const [className, setClassName] = useState('');
    const [scheduleData, setScheduleData] = useState(null); // Initialize to null
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = ['1', '2', '3', '4', '5', '6', '7', '8'];

    const fetchSchedules = async () => {
        if (className) {
            setLoading(true);
            try {
                const response = await axios.post('http://localhost:3300/api/v1/class/classdata', {
                    className: className,
                });
                const fetchedSchedules = response.data.schedule;

                const initialScheduleData = {};
                daysOfWeek.forEach(day => {
                    initialScheduleData[day] = {};
                    periods.forEach(period => {
                        initialScheduleData[day][period] = { subject: '', teacherName: '' };
                    });
                });

                fetchedSchedules.forEach(teacherSchedule => {
                    teacherSchedule.schedules.forEach(schedule => {
                        const dayOfWeek = schedule.dayofweek;
                        const period = schedule.period;

                        if (initialScheduleData[dayOfWeek] && initialScheduleData[dayOfWeek][period]) {
                            initialScheduleData[dayOfWeek][period] = {
                                subject: schedule.subject,
                                teacherName: schedule.teacherName,
                                _id: schedule._id,
                            };
                        }
                    });
                });

                setScheduleData(initialScheduleData);
                setMessage('Schedules fetched successfully.');
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
            // Check if prevData is null before proceeding
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
        if (scheduleData) { // Check if scheduleData is not null
            for (const day in scheduleData) {
                for (const period in scheduleData[day]) {
                    const { subject, teacherName, _id } = scheduleData[day][period];
                    scheduleDataForSubmit.push({
                        dayOfWeek: day,
                        period: parseInt(period),
                        subject: subject || '',
                        teacherName: teacherName || '',
                        _id: _id || null
                    });
                }
            }
        }

        try {
            const response = await axios.post('http://localhost:3300/api/v1/class/updatebyclass', {
                className: className,
                scheduleData: scheduleDataForSubmit,
            });
            setMessage(response.data.message);
            toast.success(response.data.message); // Show success toast
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating schedules.');
            toast.error(error.response?.data?.message || 'Error updating schedules.'); // Show error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Update Class Schedule</h1>
            {message && <div className="mb-4">{message}</div>}
            <form onSubmit={handleSubmit} className="max-w-full mx-auto">
                <div className="mb-4">
                    <label htmlFor="className" className="block text-gray-700 text-sm font-bold mb-2">
                        Class Name:
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            id="className"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                            onClick={fetchSchedules}
                            disabled={loading}
                        >
                            Fetch
                        </button>
                    </div>
                </div>

                {/* Conditionally render the table only when scheduleData is not null */}
                {scheduleData && (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-400">
                            <thead>
                                <tr>
                                    <th className="border border-gray-400 px-4 py-2"></th>
                                    {periods.map(period => (
                                        <th key={period} className="border border-gray-400 px-4 py-2">Period {period}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {daysOfWeek.map(day => (
                                    <tr key={day}>
                                        <th className="border border-gray-400 px-4 py-2">{day}</th>
                                        {periods.map(period => (
                                            <td key={`${day}-${period}`} className="border border-gray-400 px-4 py-2">
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
                                                    placeholder="Teacher Name"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    value={scheduleData[day]?.[period]?.teacherName || ''}
                                                    onChange={(e) => handleScheduleChange(day, period, 'teacherName', e.target.value)}
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
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        disabled={loading || !scheduleData} // Disable if loading or scheduleData is null
                    >
                        {loading ? 'Updating...' : 'Update Schedules'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateScheduleClassWise;
