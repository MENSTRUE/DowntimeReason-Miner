export type Experiment = '01' | '02';
export type ReportName = 'industrial_clusters'|'piade_alarms'|'piade_downtime'|'experiment_01'|'experiment_02';
export interface ClassificationResult { text:string; label:string; positive_label:string|null; positive_score:number|null; score_kind:string; decision_threshold:number|null; experiment:Experiment; annotation_scope?:string; safety_interpretation?:string; }
export interface ThemeResult { text:string; cluster_id:number; meaning:string; }
export interface ModelState {available:boolean; filename?:string; detail?:string; [key:string]:unknown}
export interface Health {status:string;service:string;models:Record<string, ModelState>;ready_for_inference:boolean;production_validated:boolean}
export interface ReportResponse {available:boolean;source:string;name:string;rows?:Record<string,string>[];data?:Record<string,unknown>;limit?:number}
export interface ApiError extends Error {status?:number}
