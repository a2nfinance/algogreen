import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ProjectItem = {
    _id: string,
    creator: string,
    project_name: string,
    short_description: string,
    project_leader: string,
    contact_email: string,
    project_location: string,
    start_date: number,
    end_date: number,
    detail_document: string,
    video: string,
    twitter: string,
    telegram: string,
    github: string,
    description: string,
    status: number,
    is_eco_project: number,
    created_at: string
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
        setProjectState: (state: state, action: PayloadAction<{ att: string, value: any }>) => {
            state[action.payload.att] = action.payload.value
        }
    }
})

export const { setProjectState } = projectSlice.actions;
export default projectSlice.reducer;