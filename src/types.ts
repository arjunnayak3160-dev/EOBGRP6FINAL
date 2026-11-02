export interface TeamMember {
  id: string;
  name: string;
  rollNo: string;
  sapId: string;
  division: string;
  photoUrl: string;
  role: string;
  focusArea: string;
  contributions: string[];
}

export interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  category: 'intro' | 'team' | 'honeycomb' | 'spiderweb' | 'simulation' | 'materials' | 'conclusion';
  content: {
    heading?: string;
    bullets?: string[];
    highlightBox?: {
      title: string;
      text: string;
      tag?: string;
    };
    stats?: {
      label: string;
      value: string;
      detail?: string;
      color?: string;
    }[];
    columns?: {
      title: string;
      items: string[];
      badge?: string;
    }[];
    diagramType?: 'team-grid' | 'honeycomb-fea' | 'spider-verlet' | 'material-matrix' | 'hales-theorem' | 'buehler-sacrificial' | 'summary-chart';
  };
  notes?: string;
}
