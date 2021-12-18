import React from 'react'

// Table row object type
export type AssessmentType = {
    [key: string]: string | number | null;
    name: string;
    grade: number | null;
}
// Table component prop type
interface ITableProps {
    docs: AssessmentType[]
}

const Table: React.FC<ITableProps> = ({ docs }) => {
    // internal function to map the keys of the object
    const mapRemainingFields = (doc: AssessmentType) => {
        console.log('doc', doc)
        return doc ? Object.keys(doc) : [] as string[]
    }
    
    return (
        <table>
            <thead>
                <tr className="table-header">
                    <th className="checkbox-cont"><input className="checkbox" type="checkbox" /></th>
                    <th>Name</th>
                    {mapRemainingFields(docs[0]).filter(field => !['name', 'grade'].includes(field)).map((field: string) => 
                        <th key={field}>{field}</th>
                    )}
                    <th>Grade</th>
                </tr>
            </thead>

            <tbody>
                {docs.map((doc, indx) => 
                    <tr key={indx} className="table-data">
                        <td className="checkbox-cont"><input type="checkbox" className="checkbox" /></td>
                        <td className="assessment-name">{doc.name}</td>
                        {doc ? mapRemainingFields(doc).filter(field => !['name', 'grade'].includes(field)).map((field: string) => 
                            <td key={field} className="assessment-custom">{doc[field]}</td>
                        ) : undefined}
                        <td className="assessment-grade">{doc.grade}</td>
                    </tr>
                )}
            </tbody>
            
        </table>
    )
}

export default Table