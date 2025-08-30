export interface IndexSummary {
  files: number;
  symbols: number;
  notes: string[];
}

export async function buildRepoIndex(cwd: string): Promise<IndexSummary> {
  // Placeholder: in v1, shell out to ripgrep/ctags if present.
  return { files: 0, symbols: 0, notes: ['indexing stub'] };
}
