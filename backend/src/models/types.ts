export interface Website {
  id: string;
  userId: string;
  domain: string;
  name: string;
  description?: string;
  pageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SEOAudit {
  id: string;
  websiteId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
  score: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface AuditIssue {
  id: string;
  auditId: string;
  type: 'critical' | 'warning' | 'info';
  category: string;
  title: string;
  description: string;
  affectedPages: number;
  recommendation: string;
  howToFix: string;
  priority: number;
}

export interface Keyword {
  id: string;
  websiteId: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  currentRank: number;
  previousRank?: number;
  url: string;
  createdAt: Date;
  lastChecked?: Date;
}

export interface Report {
  id: string;
  websiteId: string;
  auditId: string;
  reportType: 'pdf' | 'excel' | 'both';
  status: 'generating' | 'ready' | 'failed';
  filePath?: string;
  createdAt: Date;
  expiresAt: Date;
}
