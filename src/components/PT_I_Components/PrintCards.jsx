import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const PrintCards = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [isPrintButtonEnabled, setIsPrintButtonEnabled] = useState(false);

    console.log(classes);

    // console.log(students);
    // students.forEach((student) => {
    //     console.log("#####################", student.subjects);
    //     console.log(student.marksScored);
    //     console.log(student.totalMarks);

    // })

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/pt/fetchAllClasses`);
                setClasses(response.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, []);

    const handleClassChange = async (e) => {
        const className = e.target.value;
        setSelectedClass(className);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/pt/fetchAllClassStudents`, { className });
            setStudents(response.data);
            setIsPrintButtonEnabled(response.data.length > 0);
        } catch (error) {
            console.error('Error fetching students:', error);
            setIsPrintButtonEnabled(false);
        }
    };

    const printDiv = () => {
        const printContents = document.getElementById('printableArea').innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        window.print();

        document.body.innerHTML = originalContents;
    };

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center py-6">
            <div className="w-full max-w-4xl p-4 bg-white shadow-md rounded-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Admit Cards for PT1</h2>
                <div className="flex items-center justify-between mb-4">
                    <select
                        value={selectedClass}
                        onChange={handleClassChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-auto sm:text-sm border-gray-300 rounded-md"
                    >
                        <option value="">Select Class</option>
                        {classes.map((classItem) => (
                            <option key={classItem._id} value={classItem.className}>
                                {classItem.className}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={printDiv}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        disabled={!isPrintButtonEnabled}
                    >
                        Print
                    </button>
                </div>

                <div id="printableArea" className="p-4">
                    {students.length === 0 ? (
                        <p className="text-center">No student data available for printing.</p>
                    ) : (
                        students.map((student) => (
                            <div key={student._id} className="border border-gray-300 p-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <div><img src="./logo.png" className='w-[100px] h-[100px]' alt="" /></div>
                                    <div>
                                        <h1 className="text-4xl text-blue-800 font-bold text-center" style={{ fontFamily: 'Old English Text MT, sans-serif' }}>
                                            Sacred Souls School, Kauriwara
                                        </h1>
                                        <h3 className="text-xl text-center">AFFILIATED TO CBSE (NEW DELHI)</h3>
                                        <h4 className="text-lg text-center text-red-500">Session 2025-26</h4>
                                        <h4 className="text-lg text-center">PT-1 Result</h4>
                                    </div>
                                    <div><img src="./logo.png" className='w-[100px] h-[100px]' alt="" /></div>
                                </div>
                                {/* <h1 className="text-4xl font-bold text-center" style={{ fontFamily: 'Old English Text MT, sans-serif' }}>
                                    Sacred Souls School, Kauriwara
                                </h1>
                                <h3 className="text-xl text-center">AFFILIATED TO CBSE (NEW DELHI)</h3>
                                <h4 className="text-lg text-center text-red-500">Session 2025-26</h4>
                                <h4 className="text-lg text-center">PT-1 Result</h4> */}

                                <div className="flex justify-between mt-4 font-bold">
                                    <div className='flex flex-row gap-2'>
                                        <div className='font-bold'>Student Name: </div>
                                        <div className='font-bold border-b-2 border-black border-dotted w-[150px] text-center'>{student.studentName}</div>
                                    </div>

                                    <div className='flex flex-row gap-2'>
                                        <div className='font-bold'>Grade: </div>
                                        <div className='font-bold border-b-2 border-black border-dotted w-[50px] text-center'>{student.className}</div>
                                    </div>

                                </div>

                                <table className="w-full border-collapse mt-4">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-300 p-2">Subject</th>
                                            <th className="border border-gray-300 p-2">Total Marks</th>
                                            <th className="border border-gray-300 p-2">Marks Obtained</th>
                                        </tr>
                                    </thead>
                                    {/* <tbody>
                                        {students.forEach((student) => {
                                            <tr>

                                                <td className="border border-gray-300 p-2">{student.subjects}</td>
                                                
                                                <td className="border border-gray-300 p-2">{student.marksScored || 'N/A'}</td>
                                                
                                                <td className="border border-gray-300 p-2">{student.totalMarks}</td>

                                           
                                            </tr>
                                             })
                                        }
                                    </tbody> */}
                                    <tbody>
                                        {Object.entries(student.marksScored)
                                            .filter(([subject, marksScored]) => marksScored !== null && marksScored !== '-')
                                            .map(([subject, marksScored]) => (
                                                <tr key={subject}>
                                                    <td className="border border-gray-300 p-2 text-center">{student.subjects[subject] || "N/A"}</td>
                                                    <td className="border border-gray-300 p-2 text-center">{student.totalMarks[subject] || 'N/A'}</td>
                                                    <td className="border border-gray-300 p-2 text-center">{marksScored}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>

                                <div className="flex justify-end mt-4 font-bold">
                                    <div className='flex flex-row gap-2'>
                                        <div className='font-bold'>Total: </div>
                                        <div className='font-bold border-b-2 border-black border-dotted w-[150px] text-center'>{student.GrandTotal}</div>
                                    </div>

                                    <div className='flex flex-row gap-2'>
                                        <div className='font-bold'>Percentage: </div>
                                        <div className='font-bold border-b-2 border-black border-dotted w-[150px] text-center'>{student.Percentage}%</div>
                                    </div>
                                </div>
                                <div className='w-[250px] flex flex-row gap-0 font-bold mt-2'>
                                    <div>Remarks</div>
                                    <div className='w-[150px] border-b-2 border-black border-dotted h-5'></div>
                                </div>
                                <div className='w-full flex flex-row justify-between mt-1'>
                                    <div className=' flex flex-row gap-0 font-bold'>
                                        <div>Class Incharge Signature</div>
                                        <div className='w-[150px] border-b-2 border-black border-dotted h-5'></div>
                                    </div>
                                    <div className='flex flex-row gap-0 font-bold'>
                                        <div>Principal Signature</div>
                                        <div className='w-[150px] border-b-2 border-black border-dotted h-5'></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrintCards;


















// import { useState, useRef, useEffect } from 'react';
// import { useReactToPrint } from 'react-to-print';
// import axios from 'axios';

// const PrintCards = () => {
//     const [classes, setClasses] = useState([]);
//     const [selectedClass, setSelectedClass] = useState('');
//     const [students, setStudents] = useState([]);

//     useEffect(() => {
//         const fetchClasses = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3300/api/v1/pt/fetchAllClasses');
//                 setClasses(response.data);
//             } catch (error) {
//                 console.error('Error fetching classes:', error);
//             }
//         };

//         fetchClasses();
//     }, []);

//     const handleClassChange = async (e) => {
//         const className = e.target.value;
//         setSelectedClass(className);

//         try {
//             const response = await axios.post('http://localhost:3300/api/v1/pt/fetchAllClassStudents', { className });
//             setStudents(response.data);
//         } catch (error) {
//             console.error('Error fetching students:', error);
//         }
//     };

//     const componentRef = useRef();
//      const handlePrint = useReactToPrint({
//             content: () => componentRef.current,
//             // documentTitle: 'Admit Cards',
//             // onBeforeGetContent: () => {
//             //     return new Promise((resolve) => {
//             //         setTimeout(() => {
//             //             resolve();
//             //         }, 100);
//             //     });
//             // },
//         });

//     return (
//         <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center py-6">
//             <div className="w-full max-w-4xl p-4 bg-white shadow-md rounded-md">
//                 <h2 className="text-2xl font-semibold text-center mb-4">Admit Cards for PT1</h2>
//                 <div className="flex items-center justify-between mb-4">
//                     <select
//                         value={selectedClass}
//                         onChange={handleClassChange}
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-auto sm:text-sm border-gray-300 rounded-md"
//                     >
//                         <option value="">Select Class</option>
//                         {classes.map((classItem) => (
//                             <option key={classItem._id} value={classItem.className}>
//                                 {classItem.className}
//                             </option>
//                         ))}
//                     </select>

//                     <button
//                         onClick={handlePrint}
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         type="button"
//                     >
//                         Print
//                     </button>
//                 </div>

//                 <div ref={componentRef} className="p-4">
//                     {students.map((student) => (
//                         <div key={student._id} className="border border-gray-300 p-4 mb-6">
//                             <div className="flex justify-between items-center mb-2">
//                                 <div>Logo (Left)</div>
//                                 <div>Logo (Right)</div>
//                             </div>
//                             <h1 className="text-4xl font-bold text-center" style={{ fontFamily: 'Old English Text MT, sans-serif' }}>
//                                 Sacred Souls School, Kauriwara
//                             </h1>
//                             <h3 className="text-xl text-center">AFFILIATED TO CBSE (NEW DELHI)</h3>
//                             <h4 className="text-lg text-center text-red-500">Session 2025-26</h4>
//                             <h4 className="text-lg text-center">PT-1 Result</h4>

//                             <div className="flex justify-between mt-4">
//                                 <div>Student Name: {student.studentName}</div>
//                                 <div>Grade: {student.className}</div>
//                             </div>

//                             <table className="w-full border-collapse mt-4">
//                                 <thead>
//                                     <tr>
//                                         <th className="border border-gray-300 p-2">Subject</th>
//                                         <th className="border border-gray-300 p-2">Total Marks</th>
//                                         <th className="border border-gray-300 p-2">Marks Obtained</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {Object.keys(student.marksScored).map((subject, index) => {
//                                         if (student.marksScored[subject] !== '-') {
//                                             return (
//                                                 <tr key={index}>
//                                                     <td className="border border-gray-300 p-2">{subject}</td>
//                                                     <td className="border border-gray-300 p-2">{student.totalMarks[subject] || 'N/A'}</td>
//                                                     <td className="border border-gray-300 p-2">{student.marksScored[subject]}</td>
//                                                 </tr>
//                                             );
//                                         }
//                                         return null;
//                                     })}
//                                 </tbody>
//                             </table>

//                             <div className="flex justify-center mt-4">
//                                 <div className="mr-12">Total: {student.GrandTotal}</div>
//                                 <div>Percentage: {student.Percentage}%</div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PrintCards;






















// import { useState, useRef, useEffect } from 'react';
// import { useReactToPrint } from 'react-to-print';
// import axios from 'axios';

// const PrintCards = () => {
//     const [classes, setClasses] = useState([]);
//     const [selectedClass, setSelectedClass] = useState('');
//     const [students, setStudents] = useState([]);

//     useEffect(() => {
//         const fetchClasses = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3300/api/v1/pt/fetchAllClasses');
//                 setClasses(response.data);
//             } catch (error) {
//                 console.error('Error fetching classes:', error);
//             }
//         };

//         fetchClasses();
//     }, []);

//     const handleClassChange = async (e) => {
//         const className = e.target.value;
//         setSelectedClass(className);

//         try {
//             const response = await axios.post('http://localhost:3300/api/v1/pt/fetchAllClassStudents', { className });
//             setStudents(response.data);
//         } catch (error) {
//             console.error('Error fetching students:', error);
//         }
//     };

//     const componentRef = useRef();
//     const handlePrint = useReactToPrint({
//         content: () => componentRef.current,
//         documentTitle: 'Admit Cards',
//     });

//     return (
//         <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center py-6">
//             <div className="w-full max-w-4xl p-4 bg-white shadow-md rounded-md">
//                 <h2 className="text-2xl font-semibold text-center mb-4">Admit Cards for PT1</h2>
//                 <div className="flex items-center justify-between mb-4">
//                     <select
//                         value={selectedClass}
//                         onChange={handleClassChange}
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-auto sm:text-sm border-gray-300 rounded-md"
//                     >
//                         <option value="">Select Class</option>
//                         {classes.map((classItem) => (
//                             <option key={classItem._id} value={classItem.className}>
//                                 {classItem.className}
//                             </option>
//                         ))}
//                     </select>

//                     <button
//                         onClick={handlePrint}
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         type="button"
//                     >
//                         Print
//                     </button>
//                 </div>

//                 <div ref={componentRef} className="p-4">
//                     {students.map((student) => (
//                         <div key={student._id} className="border border-gray-300 p-4 mb-6">
//                             <div className="flex justify-between items-center mb-2">
//                                 <div>Logo (Left)</div>
//                                 <div>Logo (Right)</div>
//                             </div>
//                             <h1 className="text-4xl font-bold text-center" style={{ fontFamily: 'Old English Text MT, sans-serif' }}>
//                                 School Name
//                             </h1>
//                             <h3 className="text-xl text-center">AFFILIATED TO CBSE (NEW DELHI)</h3>
//                             <h4 className="text-lg text-center text-red-500">Session 2025-26</h4>
//                             <h4 className="text-lg text-center">PT-1 Result</h4>

//                             <div className="flex justify-between mt-4">
//                                 <div>Student Name: {student.studentName}</div>
//                                 <div>Grade: {student.className}</div>
//                             </div>

//                             <table className="w-full border-collapse mt-4">
//                                 <thead>
//                                     <tr>
//                                         <th className="border border-gray-300 p-2">Subject</th>
//                                         <th className="border border-gray-300 p-2">Total Marks</th>
//                                         <th className="border border-gray-300 p-2">Marks Obtained</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {Object.keys(student.marksScored).map((subject, index) => {
//                                         if (student.marksScored[subject] !== '-') {
//                                             return (
//                                                 <tr key={index}>
//                                                     <td className="border border-gray-300 p-2">{subject}</td>
//                                                     <td className="border border-gray-300 p-2">{student.totalMarks[subject] || 'N/A'}</td>
//                                                     <td className="border border-gray-300 p-2">{student.marksScored[subject]}</td>
//                                                 </tr>
//                                             );
//                                         }
//                                         return null;
//                                     })}
//                                 </tbody>
//                             </table>

//                             <div className="flex justify-center mt-4">
//                                 <div className="mr-12">Total: {student.GrandTotal}</div>
//                                 <div>Percentage: {student.Percentage}%</div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PrintCards;
