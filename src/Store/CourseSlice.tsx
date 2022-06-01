import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ICourseState {
    name: string                    // Course name
    id: string                      // Course Id
    assessments: IAssessment[]      // list of assessment categories
}

interface IAssessment {
    name: string                    // Assessment category name
    items: IAssessmentItem[]        // Assessment items
}
interface IAssessmentItem {
    name: string                    // Assessment item name
    score: number                   // Item score
    term: string                    // term name (Prelims, Midterms, Finals)
}


const fetchCourseData = createAsyncThunk('course/fetchCourseData',
    async () => {
        return []
    }
)


const initialState: ICourseState[] = []

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCourseData.fulfilled, (state, { payload }) => {
            state = payload
        })
    },
})

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer