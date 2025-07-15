export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      summaries: {
        Row: {
          url: string;
          summary: string;
          urdu_summary: string;
        };
        Insert: {
          url: string;
          summary: string;
          urdu_summary: string;
        };
        Update: {
          url?: string;
          summary?: string;
          urdu_summary?: string;
        };
      };
    };
  };
}