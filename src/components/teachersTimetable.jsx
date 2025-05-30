// TEACHER WISE TIME TABLE

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TimeTableFormat = () => {
    const [periods1, setPeriods1] = useState([]);
    const [periods2, setPeriods2] = useState([]);
    const [teacherName1, setTeacherName1] = useState('');
    const [teacherName2, setTeacherName2] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periodNumbers = ['1', '2', '3', '4', '5', '6', '7', '8'];

    const HandleSubmit = (e) => {
        e.preventDefault();
        setTeacherName1(document.getElementById('teacher1').value);
        setTeacherName2(document.getElementById('teacher2').value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requests = [];
                if (teacherName1) {
                    requests.push(
                        axios.post('http://localhost:3300/api/v1/create/getData', { teacherName: teacherName1 }, { headers: { 'Content-Type': 'application/json' } })
                    );
                }
                if (teacherName2) {
                    requests.push(
                        axios.post('http://localhost:3300/api/v1/create/getData', { teacherName: teacherName2 }, { headers: { 'Content-Type': 'application/json' } })
                    );
                }

                const responses = await Promise.all(requests);

                if (responses.length > 0) {
                    setPeriods1(responses[0]?.data?.schedule || []);
                }
                if (responses.length > 1) {
                    setPeriods2(responses[1]?.data?.schedule || []);
                }

                setDataLoaded(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (teacherName1 || teacherName2) {
            fetchData();
        } else {
            setDataLoaded(false);
        }
    }, [teacherName1, teacherName2]);

    const getSubject = (day, period, periods) => {
        const periodData = periods.find(p => p.dayofweek === day && p.period === period);
        return periodData ? periodData.className : '-';
    };

    const renderTimeTable = (periods, teacherName) => (
        <div className='mb-[20px]'>
            <p className='text-center font-bold mt-[10px] mb-[20px] text-xl'>TimeTable for {teacherName}</p>
            <div className='grid grid-cols-7 grid-rows-9 h-full w-full' style={{ height: '30vh', fontSize: '0.8em' }}>
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
                                {getSubject(day, period, periods)}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

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
                    }
                    .grid > div.header { font-weight: bold; }
                </style>
            </head>
            <body>
        `);

        if (teacherName1) {
            previewWindow.document.write(`
                <div class="timetable-container">
                    <div class="timetable-header">TimeTable for ${teacherName1}</div>
                    ${generateTimetableHTML(periods1)}
                </div>
            `);
        }
        if (teacherName2) {
            previewWindow.document.write(`
                <div class="timetable-container">
                    <div class="timetable-header">TimeTable for ${teacherName2}</div>
                    ${generateTimetableHTML(periods2)}
                </div>
            `);
        }

        previewWindow.document.write(`</body></html>`);
        previewWindow.document.close();
    };

    const generateTimetableHTML = (periods) => {
        let timetableHTML = `<div class="grid">`;
        timetableHTML += `<div class="header">Period</div>`;
        daysOfWeek.forEach(day => {
            timetableHTML += `<div class="header">${day}</div>`;
        });
        periodNumbers.forEach(period => {
            timetableHTML += `<div class="header">${period}</div>`;
            daysOfWeek.forEach(day => {
                timetableHTML += `<div>${getSubject(day, period, periods)}</div>`;
            });
        });
        timetableHTML += `</div>`;
        return timetableHTML;
    };

    return (
        <div className="min-h-screen bg-green-50 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto lg:max-w-5xl">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-green-100 shadow-lg rounded-3xl sm:p-20">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        View Teacher TimeTables
                    </h1>
                    <form onSubmit={HandleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="teacher1" className="block text-gray-700 text-sm font-bold mb-2">
                                    Teacher 1:
                                </label>
                                <input
                                    type="text"
                                    id="teacher1"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter Teacher 1 Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="teacher2" className="block text-gray-700 text-sm font-bold mb-2">
                                    Teacher 2:
                                </label>
                                <input
                                    type="text"
                                    id="teacher2"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter Teacher 2 Name"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Load TimeTables
                            </button>
                        </div>
                    </form>

                    <div className='flex justify-center mt-4'>
                        {dataLoaded && (
                            <button
                                onClick={handlePreview}
                                className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                            >
                                Preview TimeTables
                            </button>
                        )}
                    </div>
                    {teacherName1 && periods1.length > 0 && renderTimeTable(periods1, teacherName1)}
                    {teacherName2 && periods2.length > 0 && renderTimeTable(periods2, teacherName2)}
                </div>
            </div>
        </div>
    );
};

export default TimeTableFormat;




//  ##########################





// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const TimeTableFormat = () => {
//     const [periods, setPeriods] = useState([]);
//     const [teacherName, setTeacherName] = useState('');

//     const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     const periodNumbers = ['1', '2', '3', '4', '5', '6', '7', '8'];

//     const HandleSubmit = (e) => {
//         e.preventDefault();
//         const teacherName = document.querySelector('input').value;
//         console.log(teacherName);
        
//         setTeacherName(teacherName);
//     };

//     useEffect(() => {
//         axios
//             .post(
//                 'http://localhost:3300/api/v1/create/getData',
//                 { teacherName: teacherName },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             )
//             .then((res) => {
//                 setPeriods(res.data.schedule);
//                 // console.log(periods);                
//             })
//             .catch((error) => {
//                 console.error('Error fetching data:', error);
//             });
//     }, [teacherName]);

//     const getSubject = (day, period1) => {
//         // console.log(day, period1 , " Printed day and period ");      
        
//         const periodData = periods.map((p) =>{            
//             if(p.dayofweek === day ){
//                 if(p.period === period1){                    
//                     return p.subject;
//                 }
//             }
//         })        
//         return periodData ? periodData : '-'; // Display subject or '-' if no subject
//     };

//     return (
//         <div className='h-[595px] w-[842px] m-[10px]'>
//             <form onSubmit={HandleSubmit} className='flex justify-center items-center mb-[20px]'>
//                 <label className='mr-[10px]'>Teacher Name:</label>
//                 <input type='text' placeholder='Enter Teacher Name' />
//                 <button type='submit' className='bg-blue-500 text-white px-[10px] py-[5px] rounded-md'>
//                     Submit
//                 </button>
//             </form>

//             <p className='text-center font-bold mt-[10px] mb-[20px] text-2xl'>TimeTable Class - 3B</p>

//             <div className='grid grid-cols-7 grid-rows-9 h-full w-full'>
//                 {/* Header Row */}
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>
//                     Period
//                 </div>
//                 {daysOfWeek.map((day) => (
//                     <div
//                         key={day}
//                         className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'
//                     >
//                         {day}
//                     </div>
//                 ))}

//                 {/* Period Rows */}
//                 {periodNumbers.map((period) => (
//                     <React.Fragment key={period}>
//                         <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>
//                             {period}
//                         </div>
//                         {daysOfWeek.map((day) => (
//                             <div
//                                 key={`${day}-${period}`}
//                                 className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'
//                             >
//                                 {getSubject(day, period)}
//                             </div>
//                         ))}
//                     </React.Fragment>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default TimeTableFormat;






// ##########################




// import React, { use, useEffect, useState } from 'react'
// import axios from 'axios'

// const TimeTableFormat = () => {

//     const [periods, setPeriods] = useState([]);
//     const [teacherName, setTeacherName] = useState({});
//     const [className, setClassName] = useState({});
//     const [subject, setSubject] = useState({});
//     const HandleSubmit = (e) => {
//         e.preventDefault();
//         const teacherName = document.querySelector('input').value;

//         setTeacherName(teacherName);

//         console.log("Teacher Name: ", teacherName);
//     }

//     useEffect(() => {
//         axios
//         .post("http://localhost:3300/api/v1/create/getData", { teacherName: teacherName }, {
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         })
//         .then((res) => {
//             setPeriods(res.data.schedule);
//         });
//     },[teacherName])

    


//     return (
//         <div className='h-[595px] w-[842px] m-[10px]  '>

//             <form onSubmit={HandleSubmit} className='flex justify-center items-center mb-[20px]'>
//                 <label className='mr-[10px]'>Teacher Name:</label>
//                 <input type="text" placeholder='Enter Teacher Name' />

//                 <button type='submit' className='bg-blue-500 text-white px-[10px] py-[5px] rounded-md'>Submit</button>
//             </form>

//             <p className='text-center font-bold mt-[10px] mb-[20px] text-2xl'> TimeTable Class - 3B</p>



//             <div className='grid grid-cols-7 grid-rows-9 h-full w-full'>
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px] '>Period</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>Mon</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>Tue</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>Wed</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>Thu</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>Fri</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>Sat</div>

//                 {/* Period 1 */}
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>1</div>
                
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>
//                 {periods.map( (period) => {
//                    return <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>
//                     if({period.period === 1 }){period.subject}
//                     console.log(period.subject);
                    
//                     </div>
//                 })}
//                 </div> {/* MONDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Math</div> {/* Tuesday */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Math</div> {/* WEDNESDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Math</div> {/* THURSDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Math</div> {/* FRIDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Math</div> {/* SATURDAY


//                 {/* Period 2 */}
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>2</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>S.St.</div> {/* MONDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>S.St.</div> {/* Tuesday */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>S.St.</div> {/* WEDNESDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>S.St.</div> {/* THURSDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>S.St.</div> {/* FRIDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>S.St.</div> {/* SATURDAY */}

//                 {/* Period 3 */}
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>3</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Eng.</div> {/* MONDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Eng.</div> {/* Tuesday */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Eng.</div> {/* WEDNESDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Eng.</div> {/* THURSDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Eng.</div> {/* FRIDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Eng.</div> {/* SATURDAY */}

//                 {/* Period 4 */}
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>4</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Hindi</div> {/* MONDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Hindi</div> {/* Tuesday */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Hindi</div> {/* WEDNESDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Hindi</div> {/* THURSDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Dance</div> {/* FRIDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Dance</div> {/* SATURDAY */}

//                 {/* Period 5 */}
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>5</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Sci.</div> {/* MONDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Sci.</div> {/* Tuesday */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Sci.</div> {/* WEDNESDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Sci.</div> {/* THURSDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Sci.</div> {/* FRIDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Sci.</div> {/* SATURDAY */}

//                 {/* Period 6 */}
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>6</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Sports</div> {/* MONDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Art</div> {/* Tuesday */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Sports</div> {/* WEDNESDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Art</div> {/* THURSDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Sports</div> {/* FRIDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>-</div> {/* SATURDAY */}

//                 {/* Period 7 */}
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>7</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Comp.</div> {/* MONDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Comp.</div> {/* Tuesday */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Comp.</div> {/* WEDNESDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Comp.</div> {/* THURSDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>G.K.</div> {/* FRIDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>G.K.</div> {/* SATURDAY */}

//                 {/* Period 8 */}
//                 <div className='col-span-1 row-span-1 border-2 border-black font-bold text-center pt-[15px]'>8</div>
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Pbi.</div> {/* MONDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Pbi.</div> {/* Tuesday */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Pbi.</div> {/* WEDNESDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Pbi.</div> {/* THURSDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Music</div> {/* FRIDAY */}
//                 <div className='col-span-1 row-span-1 border-2 border-black text-center pt-[15px]'>Music</div> {/* SATURDAY */}

//             </div>
//         </div>
//     )
// }

// export default TimeTableFormat