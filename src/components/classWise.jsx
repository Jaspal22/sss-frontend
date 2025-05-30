import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassWiseTimetable = () => {
    const [className1, setClassName1] = useState('');
    const [className2, setClassName2] = useState('');
    const [scheduleData1, setScheduleData1] = useState(null);
    const [scheduleData2, setScheduleData2] = useState(null);
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const periodNumbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const [dataLoaded1, setDataLoaded1] = useState(false);
    const [dataLoaded2, setDataLoaded2] = useState(false);

    const fetchSchedule = async (className, setScheduleData, setDataLoaded) => {
        try {
            const response = await axios.post('http://localhost:3300/api/v1/class/classdata', { className: className }, { headers: { 'Content-Type': 'application/json' } });
            setScheduleData(response.data.schedule);
            setDataLoaded(true);
        } catch (error) {
            console.error(`Error fetching schedule for ${className}:`, error);
            setDataLoaded(false);
        }
    };

    useEffect(() => {
        if (className1) {
            fetchSchedule(className1, setScheduleData1, setDataLoaded1);
        } else {
            setScheduleData1(null);
            setDataLoaded1(false);
        }
        if (className2) {
            fetchSchedule(className2, setScheduleData2, setDataLoaded2);
        } else {
            setScheduleData2(null);
            setDataLoaded2(false);
        }
    }, [className1, className2]);


    const handleClassNameChange1 = (event) => {
        setClassName1(event.target.value);
    };
    const handleClassNameChange2 = (event) => {
        setClassName2(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:3300/api/v1/class/create', { className: className1 });
            await axios.post('http://localhost:3300/api/v1/class/create', { className: className2 });
            await fetchSchedule(className1, setScheduleData1, setDataLoaded1);
            await fetchSchedule(className2, setScheduleData2, setDataLoaded2);
            setClassName1('');
            setClassName2('');
        } catch (error) {
            console.error("Error submitting class name:", error);
        }
    };
    const getScheduleEntry = (day, period, scheduleData) => {
        if (!scheduleData) return null;

        for (const teacherSchedule of scheduleData) {
            const entry = teacherSchedule.schedules.find(
                (schedule) => schedule.dayofweek === day && schedule.period === String(period)
            );
            if (entry) {
                return `${entry.subject} (${teacherSchedule.teacherName})`;
            }
        }
        return null;
    };

    const handlePreview = () => {
        const previewWindow = window.open('', '_blank');

        previewWindow.document.write(`
        <html>
        <head>
            <title>TimeTable Preview</title>
            <style>
                body { font-family: Arial, sans-serif; }
                .timetable-container { margin-bottom: 20px; }
                .timetable-header { text-align: center; font-weight: bold; margin-bottom: 10px; font-size: 1.2em; }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    grid-template-rows: repeat(9, 1fr);
                    height: 30vh;
                    font-size: 0.8em;
                }
                .grid > div {
                    border: 2px solid black;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    word-break: break-word; /* Added word-break */
                }
                .grid > div.header { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="timetable-container">
                <div class="timetable-header">TimeTable for ${className1}</div>
                ${generateTimetableHTML(scheduleData1)}
            </div>
             <div class="timetable-container">
                <div class="timetable-header">TimeTable for ${className2}</div>
                ${generateTimetableHTML(scheduleData2)}
            </div>
        </body>
        </html>
    `);
        previewWindow.document.close();
    };



    const generateTimetableHTML = (scheduleData) => {
        let timetableHTML = `<div class="grid">`;
        timetableHTML += `<div class="header">Period</div>`;
        daysOfWeek.forEach(day => {
            timetableHTML += `<div class="header">${day}</div>`;
        });
        periodNumbers.forEach(period => {
            timetableHTML += `<div class="header">${period}</div>`;
            daysOfWeek.forEach(day => {
                timetableHTML += `<div>${getScheduleEntry(day, period, scheduleData) || '-'}</div>`;
            });
        });
        timetableHTML += `</div>`;
        return timetableHTML;
    };


    return (
        <div className="min-h-screen bg-green-50 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto lg:max-w-5xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-green-100 shadow-lg rounded-3xl sm:p-20">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Class Wise TimeTable
                    </h1>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="className1" className="block text-gray-700 text-sm font-bold mb-2">
                                    Class Name 1:
                                </label>
                                <input
                                    type="text"
                                    id="className1"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={className1}
                                    onChange={handleClassNameChange1}
                                    placeholder="Enter Class Name 1"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="className2" className="block text-gray-700 text-sm font-bold mb-2">
                                    Class Name 2:
                                </label>
                                <input
                                    type="text"
                                    id="className2"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={className2}
                                    onChange={handleClassNameChange2}
                                    placeholder="Enter Class Name 2"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <button type='submit'
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                clear
                            </button>
                        </div>
                    </form>
                    <div className='flex justify-center mt-4'>
                        {(dataLoaded1 || dataLoaded2) && (
                            <button
                                onClick={handlePreview}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Preview TimeTable
                            </button>
                        )}
                    </div>
                    {scheduleData1 ? (
                        <div className='mb-[20px]'>
                            <p className='text-center font-bold mt-[10px] mb-[20px] text-xl'>TimeTable for {className1}</p>
                            <div className='grid grid-cols-7 grid-rows-9 h-full w-full' style={{ height: '30vh', fontSize: '0.8em', gridTemplateColumns: 'repeat(7, minmax(140px, 1fr))' }}>
                                <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[5px]'>Period</div>
                                {daysOfWeek.map((day) => (
                                    <div key={day} className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[5px] flex items-center justify-center'>
                                        {day}
                                    </div>
                                ))}
                                {periodNumbers.map((period) => (
                                    <React.Fragment key={period}>
                                        <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[5px] flex items-center justify-center'>
                                            {period}
                                        </div>
                                        {daysOfWeek.map((day) => (
                                            <div key={`${day}-${period}`} className='col-span-1 row-span-1 border-2 border-black text-center  flex items-center justify-center'>
                                                {getScheduleEntry(day, period, scheduleData1) || '-'}
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Loading timetable for Class 1...</p>
                    )}
                    {scheduleData2 ? (
                        <div className='mb-[20px]'>
                            <p className='text-center font-bold mt-[10px] mb-[20px] text-xl'>TimeTable for Class {className2}</p>
                            <div className='grid grid-cols-7 grid-rows-9 h-full w-full' style={{ height: '30vh', fontSize: '0.8em', gridTemplateColumns: 'repeat(7, minmax(140px, 1fr))' }}>
                                <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[5px]'>Period</div>
                                {daysOfWeek.map((day) => (
                                    <div key={day} className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[5px] flex items-center justify-center'>
                                        {day}
                                    </div>
                                ))}
                                {periodNumbers.map((period) => (
                                    <React.Fragment key={period}>
                                        <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[5px] flex items-center justify-center'>
                                            {period}
                                        </div>
                                        {daysOfWeek.map((day) => (
                                            <div key={`${day}-${period}`} className='col-span-1 row-span-1 border-2 border-black text-center  flex items-center justify-center'>
                                                {getScheduleEntry(day, period, scheduleData2) || '-'}
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Loading timetable for Class 2...</p>
                    )}
                </div>
            {/* </div> */}
        </div>
    );
};

export default ClassWiseTimetable;




// ###################








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ClassWiseTimetable = () => {
//     const [className, setClassName] = useState('');
//     const [scheduleData, setScheduleData] = useState(null);
//     const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const periodNumbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
//     const [dataLoaded, setDataLoaded] = useState(false);

//     const fetchSchedule = async () => {
//         try {
//             const response = await axios.post('http://localhost:3300/api/v1/class/classdata', { className: className }, { headers: { 'Content-Type': 'application/json' } });
//             setScheduleData(response.data.schedule);
//             setDataLoaded(true);
//         } catch (error) {
//             console.error("Error fetching schedule:", error);
//             setDataLoaded(false);
//         }
//     };

//     useEffect(() => {
//         if (className) {
//             fetchSchedule();
//         } else {
//             setScheduleData(null);
//             setDataLoaded(false);
//         }
//     }, [className]);


//     const handleClassNameChange = (event) => {
//         setClassName(event.target.value);
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             await axios.post('http://localhost:3300/api/v1/class/create', { className });
//             await fetchSchedule();
//             setClassName('');
//         } catch (error) {
//             console.error("Error submitting class name:", error);
//         }
//     };
//     const getScheduleEntry = (day, period) => {
//         if (!scheduleData) return null;

//         for (const teacherSchedule of scheduleData) {
//             const entry = teacherSchedule.schedules.find(
//                 (schedule) => schedule.dayofweek === day && schedule.period === String(period)
//             );
//             if (entry) {
//                 return `${entry.subject} (${teacherSchedule.teacherName})`;
//             }
//         }
//         return null;
//     };

//     const handlePreview = () => {
//         const previewWindow = window.open('', '_blank');
//     //     previewWindow.document.write(`
//     //         <html>
//     //         <head>
//     //             <title>TimeTable Preview</title>
//     //             <style>
//     //                 body { font-family: Arial, sans-serif; }
//     //                 .timetable-container { margin-bottom: 20px; }
//     //                 .timetable-header { text-align: center; font-weight: bold; margin-bottom: 10px; font-size: 1.2em; }
//     //                 .grid {
//     //                     display: grid;
//     //                     grid-template-columns: repeat(7, minmax(100px, 1fr)); /* Reduced column width */
//     //                     grid-template-rows: repeat(9, 1fr);
//     //                     height: 100%;
//     //                     font-size: 0.7em; /* Reduced font size */
//     //                 }
//     //                 .grid > div {
//     //                     border: 2px solid black;
//     //                     text-align: center;
//     //                     display: flex;
//     //                     align-items: center;
//     //                     justify-content: center;
//     //                     word-break: break-word; /* Added word-break */
//     //                 }
//     //                 .grid > div.header { font-weight: bold; }
//     //             </style>
//     //         </head>
//     //         <body>
//     //             <div class="timetable-container">
//     //                 <div class="timetable-header">TimeTable for ${className}</div>
//     //                 ${generateTimetableHTML(scheduleData)}
//     //             </div>
//     //         </body>
//     //         </html>
//     //     `);
//     //     previewWindow.document.close();
//     // };


//     previewWindow.document.write(`
//         <html>
//         <head>
//             <title>TimeTable Preview</title>
//             <style>
//                 body { font-family: Arial, sans-serif; }
//                 .timetable-container { margin-bottom: 20px; }
//                 .timetable-header { text-align: center; font-weight: bold; margin-bottom: 10px; font-size: 1.2em; }
//                 .grid {
//                     display: grid;
//                     grid-template-columns: repeat(7, 1fr);
//                     grid-template-rows: repeat(9, 1fr);
//                     height: 30vh;
//                     font-size: 0.8em;
//                 }
//                 .grid > div {
//                     border: 2px solid black;
//                     text-align: center;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     word-break: break-word; /* Added word-break */
//                 }
//                 .grid > div.header { font-weight: bold; }
//             </style>
//         </head>
//         <body>
//             <div class="timetable-container">
//                 <div class="timetable-header">TimeTable for ${className}</div>
//                 ${generateTimetableHTML(scheduleData)}
//             </div>
//         </body>
//         </html>
//     `);
//        previewWindow.document.close();
//     };



//     const generateTimetableHTML = (scheduleData) => {
//         let timetableHTML = `<div class="grid">`;
//         timetableHTML += `<div class="header">Period</div>`;
//         daysOfWeek.forEach(day => {
//             timetableHTML += `<div class="header">${day}</div>`;
//         });
//         periodNumbers.forEach(period => {
//             timetableHTML += `<div class="header">${period}</div>`;
//             daysOfWeek.forEach(day => {
//                 timetableHTML += `<div>${getScheduleEntry(day, period) || '-'}</div>`;
//             });
//         });
//         timetableHTML += `</div>`;
//         return timetableHTML;
//     };


//     return (
//         <div>
//             <form onSubmit={handleSubmit} className='flex justify-center items-center mb-[20px]'>
//                 <div className='mr-[10px]'>
//                     <label className='mr-[10px]'>Class Name:</label>
//                     <input
//                         type="text"
//                         value={className}
//                         onChange={handleClassNameChange}
//                         placeholder="Enter Class Name"
//                         required
//                         id='className'
//                     />
//                 </div>

//                 <button type='submit' className='bg-blue-500 text-white px-[10px] py-[5px] rounded-md'>
//                     Submit
//                 </button>
//             </form>
//             <div className='flex justify-center mt-4'>
//                 {dataLoaded && (
//                     <button
//                         onClick={handlePreview}
//                         className='bg-green-500 text-white px-[10px] py-[5px] rounded-md'
//                     >
//                         Preview TimeTable
//                     </button>
//                 )}
//             </div>
//             {scheduleData ? (
//                 <div className='mb-[20px]'>
//                     <p className='text-center font-bold mt-[10px] mb-[20px] text-xl'>TimeTable for {className}</p>
//                     <div className='grid grid-cols-7 grid-rows-9 h-full w-full' style={{ height: '30vh', fontSize: '0.8em', gridTemplateColumns: 'repeat(7, minmax(140px, 1fr))' }}>
//                         <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[5px]'>Period</div>
//                         {daysOfWeek.map((day) => (
//                             <div key={day} className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[5px] flex items-center justify-center'>
//                                 {day}
//                             </div>
//                         ))}
//                         {periodNumbers.map((period) => (
//                             <React.Fragment key={period}>
//                                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[5px] flex items-center justify-center'>
//                                     {period}
//                                 </div>
//                                 {daysOfWeek.map((day) => (
//                                     <div key={`${day}-${period}`} className='col-span-1 row-span-1 border-2 border-black text-center  flex items-center justify-center'>
//                                         {getScheduleEntry(day, period) || '-'}
//                                     </div>
//                                 ))}
//                             </React.Fragment>
//                         ))}
//                     </div>
//                 </div>
//             ) : (
//                 <p>Loading timetable...</p>
//             )}
//         </div>
//     );
// };

// export default ClassWiseTimetable;
