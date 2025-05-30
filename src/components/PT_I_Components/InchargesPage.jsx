import React from 'react'

const InchargesPage = () => {
    const [className, setClassName] = React.useState('');
    const [inchargeName, setInchargeName] = React.useState('');
    const [subjects, setSubjects] = React.useState(Array(10).fill(''));

    const handleSubmit = async (e) => {
        e.preventDefault();

        const subjectsData = {};
        subjects.forEach((subject, index) => {
            if (subject) {
                subjectsData[`subject${index + 1}`] = subject;
            }
        });

        const data = {
            className: className,
            inchargeName: inchargeName,
            subjects: subjectsData
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/pt/createClass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('Class created successfully');
            } else {
                console.error('Failed to create class');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubjectChange = (index) => (e) => {
        const newSubjects = [...subjects];
        newSubjects[index] = e.target.value;
        setSubjects(newSubjects);
    };


    return (
        <div className="min-h-screen bg-green-50 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-green-300 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <h1 className="text-2xl font-bold text-gray-800 text-center">CREATE CLASS</h1>
                    <form onSubmit={handleSubmit} className="mt-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="className">
                                Class Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="className"
                                type="text"
                                placeholder="Class Name"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="inchargeName">
                                Incharge Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="inchargeName"
                                type="text"
                                placeholder="Incharge Name"
                                value={inchargeName}
                                onChange={(e) => setInchargeName(e.target.value)}
                            />
                        </div>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div className="mb-4" key={index}>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`subject${index + 1}`}>
                                    Subject {index + 1}
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id={`subject${index + 1}`}
                                    type="text"
                                    placeholder={`Subject ${index + 1}`}
                                    value={subjects[index]}
                                    onChange={handleSubjectChange(index)}
                                />
                            </div>
                        ))}
                        <div className="flex items-center justify-center">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Create Class
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default InchargesPage