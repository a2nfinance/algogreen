import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type ProjectItem = {
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
    allProjects: ProjectItem[],
    project: ProjectItem
}

const initialState: state = {
    featuredProjects: [],
    allProjects: [],
    project: {
        _id: "",
        creator: "",
        project_name: "",
        short_description: "",
        project_leader: "",
        contact_email: "",
        project_location: "",
        start_date: null,
        end_date: null,
        detail_document: "",
        video: "",
        twitter: "",
        telegram: "",
        github: "",
        description: "",
        status: 0,
        is_eco_project: 1,
        created_at: null,
    }
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