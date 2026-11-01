export interface CuratedSurveyNominee {
    id: number;
    name: string;
    votes: number;
}

export interface CuratedSurvey {
    id: string;
    title: string;
    description: string;
    category: "Motor" | "Performans" | "Modifiye" | "Sürüş" | "Genel";
    status: "active";
    totalVotes: number;
    nominees: CuratedSurveyNominee[];
    createdBy: string;
    source: "curated";
}

export const curatedSurveys: CuratedSurvey[] = [];
