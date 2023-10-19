import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ProjectItem = {
    title: string,
    description: string,
    owner: string
    created_at: string,
    type: number,
    status: number
}

type state = {
    featuredProjects: ProjectItem[],
    allProjects: ProjectItem[]
}

const initialState: state = {
    featuredProjects: [],
    allProjects: []
}

export const projectSlice = createSlice({
    name: 'project',
    initialState: initialState,
    reducers: {
        setProjectComponentState: (state: state, action: PayloadAction<{ att: string, value: any }>) => {
            state[action.payload.att] = action.payload.value
        }
    }
})

export const { setProjectComponentState } = projectSlice.actions;
export default projectSlice.reducer;