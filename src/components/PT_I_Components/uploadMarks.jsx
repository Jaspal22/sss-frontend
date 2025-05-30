import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UploadMarks = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [classes, setClasses] = useState([]);
    const [classData, setClassData] = useState(null);
    const [studentName, setStudentName] = useState('');
    const [obtainedMarks, setObtainedMarks] = useState({});
    const [totalMarks, setTotalMarks] = useState({});
    const [grandTotal, setGrandTotal] = useState(0);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        if (classData) {
            // Initialize totalMarks with default values from classData
            const initialTotalMarks = {};
            Object.entries(classData.subjects).forEach(([subjectKey, subjectName]) => {
                initialTotalMarks[subjectName] = '40'; // set a default value
            });
            setTotalMarks(initialTotalMarks);
        }
    }, [classData]);

    useEffect(() => {
        // Calculate grand total and percentage whenever obtainedMarks or totalMarks change
        let calculatedGrandTotal = 0;
        let calculatedTotalPossibleMarks = 0;

        if (classData) {
            Object.entries(classData.subjects).forEach(([subjectKey, subjectName]) => {
                const obtained = parseFloat(obtainedMarks[subjectName] || 0);
                const total = parseFloat(totalMarks[subjectName]);

                calculatedGrandTotal += obtained;
                calculatedTotalPossibleMarks += isNaN(total) ? 0 : total;
            });

            setGrandTotal(calculatedGrandTotal);
            setPercentage(
                calculatedTotalPossibleMarks > 0
                    ? (calculatedGrandTotal / calculatedTotalPossibleMarks) * 100
                    : 0
            );
            // Store total marks with 2 digit after decimal precision
            setGrandTotal(Number(calculatedGrandTotal.toFixed(2)));
        }
    }, [obtainedMarks, totalMarks, classData]);

    // Helper to map subjects to subject1, subject2, ... for DB schema
    const mapSubjectsForDB = (subjectsObj) => {
        const mapped = {};
        let i = 1;
        for (const [subjectKey, subjectName] of Object.entries(subjectsObj)) {
            mapped[`subject${i}`] = subjectName;
            i++;
        }
        // Fill up to subject10 with empty string if less than 10 subjects
        for (; i <= 10; i++) {
            mapped[`subject${i}`] = '';
        }
        return mapped;
    };

    const handleSubmit = async () => {
        try {
            const marksScored = {};
            const totalMarksData = {};
            let subjectsData = {};

            if (classData) {
                // Map marksScored and totalMarks as before
                Object.entries(classData.subjects).forEach(([subjectKey, subjectName], idx) => {
                    marksScored[`subject${idx + 1}`] = obtainedMarks[subjectName] || '0';
                    totalMarksData[`subject${idx + 1}`] = totalMarks[subjectName] || '';
                });
                // Map subjects for DB schema
                subjectsData = mapSubjectsForDB(classData.subjects);
                // subjectsData = classData.subjects ? mapSubjectsForDB(classData.subjects) : {};
            }

            const payload = {
                studentName: studentName,
                className: selectedClass,
                CI: classData?.inchargeName || 'N/A',
                GrandTotal: grandTotal.toString(),
                Percentage: percentage.toFixed(2).toString(),
                marksScored: marksScored,
                totalMarks: totalMarksData,
                subjects: subjectsData,
                overallTotal: grandTotal,
                overallPercentage: percentage,
            };

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/v1/pt/addMarks`, payload);
            toast.success('Marks uploaded successfully!');

            // Clear the form data
            setStudentName('');
            setObtainedMarks({});
            setTotalMarks({});
        } catch (error) {
            console.error('Error uploading marks:', error);
            toast.error('Error uploading marks.');
        }
    };

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/v1/pt/fetchAllClasses`);
                setClasses(response.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchClassData = async () => {
            if (selectedClass) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/v1/pt/fetchClassData`, {
                        className: selectedClass,
                    });
                    setClassData(response.data);
                } catch (error) {
                    console.error('Error fetching class data:', error);
                }
            }
        };

        fetchClassData();
    }, [selectedClass]);

    const handleClassChange = (e) => {
        setSelectedClass(e.target.value);
    };

    const handleMarksChange = (e, subjectName) => {
        setObtainedMarks({ ...obtainedMarks, [subjectName]: e.target.value });
    };

    const handleTotalMarksChange = (e, subjectName) => {
        setTotalMarks({ ...totalMarks, [subjectName]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-green-50 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-green-100 shadow-lg rounded-3xl sm:p-20">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Add Student Data
                    </h1>

                    <div className="mb-4">
                        <label htmlFor="class" className="block text-gray-700 text-sm font-bold mb-2">
                            Select Class:
                        </label>
                        <select
                            id="class"
                            value={selectedClass}
                            onChange={handleClassChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select a class</option>
                            {classes.map((cls) => (
                                <option key={cls._id} value={cls.className}>
                                    {cls.className}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="studentName" className="block text-gray-700 text-sm font-bold mb-2">
                                Student Name:
                            </label>
                            <input
                                type="text"
                                id="studentName"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Class:
                            </label>
                            <input
                                type="text"
                                value={selectedClass}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="mb-4 text-right">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Class Incharge:
                        </label>
                        <input
                            type="text"
                            value={classData?.inchargeName || ''}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            disabled
                        />
                    </div>

                    {classData && (
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full mx-auto">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left">Subject Name</th>
                                        <th className="px-4 py-2 text-left">Obtained Marks</th>
                                        <th className="px-4 py-2 text-left">Total Marks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(classData.subjects).map(([subjectKey, subjectName]) => (
                                        <tr key={subjectKey}>
                                            <td className="border px-4 py-2">{subjectName}</td>
                                            <td className="border px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={obtainedMarks[subjectName] || ''}
                                                    onChange={(e) => handleMarksChange(e, subjectName)}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </td>
                                            <td className="border px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={totalMarks[subjectName] || ''}
                                                    onChange={(e) => handleTotalMarksChange(e, subjectName)}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex items-center justify-center mt-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Upload Marks
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadMarks;






















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const UploadMarks = () => {
//     const [selectedClass, setSelectedClass] = useState('');
//     const [classes, setClasses] = useState([]);
//     const [classData, setClassData] = useState(null);
//     const [studentName, setStudentName] = useState('');
//     const [obtainedMarks, setObtainedMarks] = useState({});
//     const [totalMarks, setTotalMarks] = useState({});
//     const [grandTotal, setGrandTotal] = useState(0);
//     const [percentage, setPercentage] = useState(0);

//     useEffect(() => {
//         if (classData) {
//             // Initialize totalMarks with default values from classData
//             const initialTotalMarks = {};
//             Object.entries(classData.subjects).forEach(([subjectKey, subjectName]) => {
//                 initialTotalMarks[subjectName] = '40'; // set a default value
//             });
//             setTotalMarks(initialTotalMarks);
//         }
//     }, [classData]);

//     useEffect(() => {
//         // Calculate grand total and percentage whenever obtainedMarks or totalMarks change
//         let calculatedGrandTotal = 0;
//         let calculatedTotalPossibleMarks = 0;

//         if (classData) {
//             Object.entries(classData.subjects).forEach(([subjectKey, subjectName]) => {
//                 const obtained = parseInt(obtainedMarks[subjectName] || 0, 10);
//                 const total = parseInt(totalMarks[subjectName] , 10);

//                 calculatedGrandTotal += obtained;
//                 calculatedTotalPossibleMarks += total;
//             });

//             setGrandTotal(calculatedGrandTotal);
//             setPercentage(calculatedTotalPossibleMarks > 0 ? (calculatedGrandTotal / calculatedTotalPossibleMarks) * 100 : 0);
//         }
//     }, [obtainedMarks, totalMarks, classData]);

//     const handleSubmit = async () => {
//         try {
//             const marksScored = {};
//             const totalMarksData = {};
//             const subjectsData = {};

//             if (classData) {
//                 Object.entries(classData.subjects).forEach(([subjectKey, subjectName]) => {
//                     marksScored[subjectKey] = obtainedMarks[subjectName] || '0';
//                     totalMarksData[subjectKey] = totalMarks[subjectName] || '100';
//                     subjectsData[subjectKey] = subjectName;
//                 });
//             }

//             const payload = {
//                 studentName: studentName,
//                 className: selectedClass,
//                 CI: classData?.inchargeName || 'N/A',
//                 GrandTotal: grandTotal.toString(),
//                 Percentage: percentage.toFixed(2).toString(),
//                 marksScored: marksScored,
//                 totalMarks: totalMarksData,
//                 subjects: subjectsData,
//                 overallTotal: grandTotal,
//                 overallPercentage: percentage,
//             };

//             await axios.post(`http://localhost:3300/api/v1/pt/addMarks`, payload);
//             toast.success('Marks uploaded successfully!');

//             // Clear the form data
//             setStudentName('');
//             setObtainedMarks({});
//             setTotalMarks({});
//         } catch (error) {
//             console.error('Error uploading marks:', error);
//             toast.error('Error uploading marks.');
//         }
//     };

//     useEffect(() => {
//         const fetchClasses = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3300/api/v1/pt/fetchAllClasses`);
//                 setClasses(response.data);
//             } catch (error) {
//                 console.error('Error fetching classes:', error);
//             }
//         };

//         fetchClasses();
//     }, []);

//     useEffect(() => {
//         const fetchClassData = async () => {
//             if (selectedClass) {
//                 try {
//                     const response = await axios.post(`http://localhost:3300/api/v1/pt/fetchClassData`, {
//                         className: selectedClass,
//                     });
//                     setClassData(response.data);
//                 } catch (error) {
//                     console.error('Error fetching class data:', error);
//                 }
//             }
//         };

//         fetchClassData();
//     }, [selectedClass]);

//     const handleClassChange = (e) => {
//         setSelectedClass(e.target.value);
//     };

//     const handleMarksChange = (e, subjectName) => {
//         setObtainedMarks({ ...obtainedMarks, [subjectName]: e.target.value });
//     };

//     const handleTotalMarksChange = (e, subjectName) => {
//         setTotalMarks({ ...totalMarks, [subjectName]: e.target.value });
//     };

//     return (
//         <div className="min-h-screen bg-green-50 py-6 flex flex-col justify-center sm:py-12">
//             <div className="relative py-3 sm:max-w-xl sm:mx-auto">
//                 <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
//                 <div className="relative px-4 py-10 bg-green-100 shadow-lg rounded-3xl sm:p-20">
//                     <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
//                         Add Student Data
//                     </h1>

//                     <div className="mb-4">
//                         <label htmlFor="class" className="block text-gray-700 text-sm font-bold mb-2">
//                             Select Class:
//                         </label>
//                         <select
//                             id="class"
//                             value={selectedClass}
//                             onChange={handleClassChange}
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         >
//                             <option value="">Select a class</option>
//                             {classes.map((cls) => (
//                                 <option key={cls._id} value={cls.className}>
//                                     {cls.className}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4 mb-4">
//                         <div>
//                             <label htmlFor="studentName" className="block text-gray-700 text-sm font-bold mb-2">
//                                 Student Name:
//                             </label>
//                             <input
//                                 type="text"
//                                 id="studentName"
//                                 value={studentName}
//                                 onChange={(e) => setStudentName(e.target.value)}
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700 text-sm font-bold mb-2">
//                                 Class:
//                             </label>
//                             <input
//                                 type="text"
//                                 value={selectedClass}
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 disabled
//                             />
//                         </div>
//                     </div>

//                     <div className="mb-4 text-right">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">
//                             Class Incharge:
//                         </label>
//                         <input
//                             type="text"
//                             value={classData?.inchargeName || ''}
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             disabled
//                         />
//                     </div>

//                     {classData && (
//                         <div className="overflow-x-auto">
//                             <table className="table-auto w-full mx-auto">
//                                 <thead>
//                                     <tr>
//                                         <th className="px-4 py-2 text-left">Subject Name</th>
//                                         <th className="px-4 py-2 text-left">Obtained Marks</th>
//                                         <th className="px-4 py-2 text-left">Total Marks</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {Object.entries(classData.subjects).map(([subjectKey, subjectName]) => (
//                                         <tr key={subjectKey}>
//                                             <td className="border px-4 py-2">{subjectName}</td>
//                                             <td className="border px-4 py-2">
//                                                 <input
//                                                     type="number"
//                                                     value={obtainedMarks[subjectName] || ''}
//                                                     onChange={(e) => handleMarksChange(e, subjectName)}
//                                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                                 />
//                                             </td>
//                                             <td className="border px-4 py-2">
//                                                 <input
//                                                     type="number"
//                                                     value={totalMarks[subjectName] || ''}
//                                                     onChange={(e) => handleTotalMarksChange(e, subjectName)}
//                                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}

//                     <div className="flex items-center justify-center mt-4">
//                         <button
//                             onClick={handleSubmit}
//                             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         >
//                             Upload Marks
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UploadMarks;


















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const UploadMarks = () => {
//     const [selectedClass, setSelectedClass] = useState('');
//     const [classes, setClasses] = useState([]);
//     const [classData, setClassData] = useState(null);
//     const [studentName, setStudentName] = useState('');
//     const [obtainedMarks, setObtainedMarks] = useState({});
//     const [totalMarks, setTotalMarks] = useState({});
//     const [grandTotal, setGrandTotal] = useState(0);
//     const [percentage, setPercentage] = useState(0);

//     useEffect(() => {
//         if (classData) {
//             // Initialize totalMarks with default values from classData
//             const initialTotalMarks = {};
//             Object.entries(classData.subjects).forEach(([subjectKey, subjectName]) => {
//                 initialTotalMarks[subjectName] = '100'; // set a default value
//             });
//             setTotalMarks(initialTotalMarks);
//         }
//     }, [classData]);

//     useEffect(() => {
//         // Calculate grand total and percentage whenever obtainedMarks or totalMarks change
//         let calculatedGrandTotal = 0;
//         let calculatedTotalPossibleMarks = 0;

//         if (classData) {
//             Object.entries(classData.subjects).forEach(([subjectKey, subjectName]) => {
//                 const obtained = parseInt(obtainedMarks[subjectName] || 0, 10);
//                 const total = parseInt(totalMarks[subjectName] || 100, 10);

//                 calculatedGrandTotal += obtained;
//                 calculatedTotalPossibleMarks += total;
//             });

//             setGrandTotal(calculatedGrandTotal);
//             setPercentage(calculatedTotalPossibleMarks > 0 ? (calculatedGrandTotal / calculatedTotalPossibleMarks) * 100 : 0);
//         }
//     }, [obtainedMarks, totalMarks, classData]);

//     const handleSubmit = async () => {
//         try {
//             const marksScored = {};
//             const totalMarksData = {};
//             const subjectsData = {};

//             if (classData) {
//                 Object.entries(classData.subjects).forEach(([subjectKey, subjectName]) => {
//                     marksScored[subjectKey] = obtainedMarks[subjectName] || '0';
//                     totalMarksData[subjectKey] = totalMarks[subjectName] || '40';
//                     subjectsData[subjectKey] = subjectName;
//                 });
//             }

//             const payload = {
//                 studentName: studentName,
//                 className: selectedClass,
//                 CI: classData?.inchargeName || 'N/A',
//                 GrandTotal: grandTotal.toString(),
//                 Percentage: percentage.toFixed(2).toString(),
//                 marksScored: marksScored,
//                 totalMarks: totalMarksData,
//                 subjects: subjectsData,
//                 overallTotal: grandTotal,
//                 overallPercentage: percentage,
//             };

//             await axios.post('http://localhost:3300/api/v1/pt/addMarks', payload);
//             alert('Marks uploaded successfully!');
//         } catch (error) {
//             console.error('Error uploading marks:', error);
//             alert('Error uploading marks.');
//         }
//     };

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

//     useEffect(() => {
//         const fetchClassData = async () => {
//             if (selectedClass) {
//                 try {
//                     const response = await axios.post('http://localhost:3300/api/v1/pt/fetchClassData', {
//                         className: selectedClass,
//                     });
//                     setClassData(response.data);
//                 } catch (error) {
//                     console.error('Error fetching class data:', error);
//                 }
//             }
//         };

//         fetchClassData();
//     }, [selectedClass]);

//     const handleClassChange = (e) => {
//         setSelectedClass(e.target.value);
//     };

//     const handleMarksChange = (e, subjectName) => {
//         setObtainedMarks({ ...obtainedMarks, [subjectName]: e.target.value });
//     };

//     const handleTotalMarksChange = (e, subjectName) => {
//         setTotalMarks({ ...totalMarks, [subjectName]: e.target.value });
//     };

//     return (
//         <div className="min-h-screen bg-green-50 py-6 flex flex-col justify-center sm:py-12">
//             <div className="relative py-3 sm:max-w-xl sm:mx-auto">
//                 <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
//                 <div className="relative px-4 py-10 bg-green-100 shadow-lg rounded-3xl sm:p-20">
//                     <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
//                         Add Student Data
//                     </h1>

//                     <div className="mb-4">
//                         <label htmlFor="class" className="block text-gray-700 text-sm font-bold mb-2">
//                             Select Class:
//                         </label>
//                         <select
//                             id="class"
//                             value={selectedClass}
//                             onChange={handleClassChange}
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         >
//                             <option value="">Select a class</option>
//                             {classes.map((cls) => (
//                                 <option key={cls._id} value={cls.className}>
//                                     {cls.className}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4 mb-4">
//                         <div>
//                             <label htmlFor="studentName" className="block text-gray-700 text-sm font-bold mb-2">
//                                 Student Name:
//                             </label>
//                             <input
//                                 type="text"
//                                 id="studentName"
//                                 value={studentName}
//                                 onChange={(e) => setStudentName(e.target.value)}
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700 text-sm font-bold mb-2">
//                                 Class:
//                             </label>
//                             <input
//                                 type="text"
//                                 value={selectedClass}
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 disabled
//                             />
//                         </div>
//                     </div>

//                     <div className="mb-4 text-right">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">
//                             Class Incharge:
//                         </label>
//                         <input
//                             type="text"
//                             value={classData?.inchargeName || ''}
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             disabled
//                         />
//                     </div>

//                     {classData && (
//                         <div className="overflow-x-auto">
//                             <table className="table-auto w-full mx-auto">
//                                 <thead>
//                                     <tr>
//                                         <th className="px-4 py-2 text-left">Subject Name</th>
//                                         <th className="px-4 py-2 text-left">Obtained Marks</th>
//                                         <th className="px-4 py-2 text-left">Total Marks</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {Object.entries(classData.subjects).map(([subjectKey, subjectName]) => (
//                                         <tr key={subjectKey}>
//                                             <td className="border px-4 py-2">{subjectName}</td>
//                                             <td className="border px-4 py-2">
//                                                 <input
//                                                     type="number"
//                                                     value={obtainedMarks[subjectName] || ''}
//                                                     onChange={(e) => handleMarksChange(e, subjectName)}
//                                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                                 />
//                                             </td>
//                                             <td className="border px-4 py-2">
//                                                 <input
//                                                     type="number"
//                                                     value={totalMarks[subjectName] || ''}
//                                                     onChange={(e) => handleTotalMarksChange(e, subjectName)}
//                                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}

//                     <div className="flex items-center justify-center mt-4">
//                         <button
//                             onClick={handleSubmit}
//                             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         >
//                             Upload Marks
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UploadMarks;
