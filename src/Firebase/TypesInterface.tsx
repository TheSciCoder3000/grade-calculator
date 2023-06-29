// ================================================== Firestore Database type model ==================================================
/**
 * interface schema of the data received from the firestore
 */
export interface IUserDoc {
    userUid: string; // User's id
    years: IYears[]; // collection of object containing the college year name and id
    terms: ItemCommonProps[]; // collection of object containing the term name and id
    subjects: ISubjects[]; // collection of object contianing the subject name and id
    /**
     * columns used by the tables, grouped by page
     */
    columns: {
        overview: IColumnProps;
        details: IColumnProps;
    };
}

export interface IYears extends ItemCommonProps {
    sems: ItemCommonProps[];
}

/**
 * Subject interface that extends from the IUserField Interface.
 * Adds the following properties:
 * - `mid`: avg midterm grade
 * - `final`: avg finals grade
 */
export interface ISubjects extends ItemCommonProps {
    year: string;
    sem: string;
    grades: IFieldProps[];
    extra: IFieldProps[];
}

/**
 * assessment item schema that defines the properties of an
 * assessment item located in the database.
 * - `id:` item identifier
 * - `name:` Course Name
 * - `extra:` list of extra custom fields that is displayed in the table
 * - `subj`: subject id key
 * - `term`: term id key
 * - `type`: type name
 * - `grade`: assessment score
 */
export interface IAssessment extends ItemCommonProps {
    /**
     * subject id key (should be included inside the subject).
     * * **Item query identifier**
     */
    subj: string;
    /**
     * term id key (should be included inside the terms )
     * * **Used to filter which items will be displayed first**
     */
    term: string;
    /**
     * assessment category (ex. Enabling, Summative, Formative, Class Participation, etc.)
     * * **Used to determine which table the item will be placed**
     */
    catgory: string;
    grades: IFieldProps[];
    extra: IFieldProps[];
}

/**
 * column props grouped by column categories such as `extra` and `grades`.
 * Each category has an array of objects that defines the id of the column
 * and it's display name.
 */
export interface IColumnProps {
    extra: ItemCommonProps[];
    grades: ItemCommonProps[];
}

/**
 * Global user field interface used to define the object's name and id
 * - `name`: string that will be displayed on the ui
 * - `id`: used for querying in the database
 */
export interface ItemCommonProps {
    /**
     * display name of item
     */
    name: string;
    /**
     * database item id
     */
    id: string;
}

/**
 * field properties that defines the schema of a field column.
 * Besides the `selection` and `name` column, the rest of the fields are
 * divided into two categories which are `grade` and `extra`. Grade fields
 * are cells that defines the numeric score of the row item while `extra`
 * fields are used for filtering and sorting purposes
 */
interface IFieldProps {
    /**
     * foreign key of field id
     */
    id: string;
    value: string | number | undefined;
}

// ======================================== Helper Types ========================================
/**
 * other column fields besides `name`. It is either
 * `grades` or `extra`
 */
export type ColumnFields = "grades" | "extra";

export type FilterTypes = "sems" | "years";

export type TableType = "overview" | "details";

/**
 * Properties of an object containing the changes made to a subject
 * in the field `name` or `id` categorized by `type` and the new updated `value`
 */
export interface IUpdateRowProps {
    id: string;
    name: string;
    type: ColumnFields;
    value: string | number | null | undefined;
}
