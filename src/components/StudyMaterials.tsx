import React, { useEffect, useState } from 'react';

interface StudyMaterial {
    subjectName: string;
    subjectCode: string;
    facultyName: string;
    type: string;
    fileUrl: string;
}

const StudyMaterials: React.FC = () => {
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetch('https://edublog-server.vercel.app/api/study-materials')
            .then(res => res.json())
            .then(data => setMaterials(data))
            .catch(error => console.error('Error fetching materials:', error));
    }, []);

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-4">Study Materials</h1>

            {/* 🔹 Filter Input */}
            <input
                type="text"
                placeholder="Search by Subject, Code, Faculty..."
                className="w-full p-3 mb-4 border rounded"
                onChange={(e) => setFilter(e.target.value.toLowerCase())}
            />

            {/* 🔹 Display Materials */}
            <div className="bg-white shadow-md rounded-lg p-4 overflow-x-scroll">
                <table className="w-full border-collapse">
                    <thead className='rounded-md'>
                        <tr className="bg-indigo-500 text-white rounded-md">
                            <th className="p-2">Subject</th>
                            <th className="p-2">Code</th>
                            <th className="p-2">Faculty</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials
                            .filter((item) =>
                                Object.values(item).some((val) =>
                                    val.toLowerCase().includes(filter)
                                )
                            )
                            .map((material, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-2">{material.subjectName}</td>
                                    <td className="p-2">{material.subjectCode}</td>
                                    <td className="p-2">{material.facultyName}</td>
                                    <td className="p-2">{material.type}</td>
                                    <td className="p-2">
                                        <a
                                            href={material.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        >
                                            View
                                        </a>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudyMaterials;
